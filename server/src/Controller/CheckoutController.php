<?php

namespace App\Controller;

use App\Entity\AddressBilling;
use App\Entity\AddressShipping;
use App\Entity\CardCredentials;
use App\Entity\Region;
use App\Entity\ShippingPricing;
use App\Entity\User;
use App\Entity\UserOrder;
use App\Entity\UserOrderSubproduct;
use App\Repository\RegionRepository;
use App\Repository\ShippingPricingRepository;
use App\Repository\SubproductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class CheckoutController extends AbstractController
{
    /**
     * @Route("/api/checkout", name="checkout", methods="POST")
     */
    public function checkoutIndex(Request $request, SubproductRepository $subproductRepository, EntityManagerInterface $em, SerializerInterface $serializer, ValidatorInterface $validator, MailerInterface $mailer)
    {
        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);

        $errorMsg = [];
        if (!isset($req->shipping_address)) $errorMsg['violations'][] = 'shipping_address missing';
        if (!isset($req->billing_address)) $errorMsg['violations'][] = 'billing_address missing';
        if (!isset($req->card_credentials)) $errorMsg['violations'][] = 'card_credentials missing';
        if (!isset($req->subproducts)) $errorMsg['violations'][] = 'subproducts missing';
        if (!isset($req->pricing_id)) $errorMsg['violations'][] = 'pricing_id missing';
        if (!isset($req->packaging)) $errorMsg['violations'][] = 'packaging missing';

        $pricing = $this->getDoctrine()->getRepository(ShippingPricing::class)->find($req->pricing_id);
        if (!$pricing) $errorMsg['violations'][] = 'Shipping pricing not found';

        if (is_int($req->shipping_address)) {
            $shippingAddress = $this->getDoctrine()->getRepository(AddressShipping::class)->find($req->shipping_address);
            if (!$shippingAddress) $errorMsg['violations'][] = 'shipping address not found';
        }
        if (is_int($req->billing_address)) {
            $billingAddress = $this->getDoctrine()->getRepository(AddressBilling::class)->find($req->billing_address);
            if (!$billingAddress) $errorMsg['violations'][] = 'Billing address not found';
        }

        if (is_int($req->card_credentials)) {
            $cardCredentials = $this->getDoctrine()->getRepository(CardCredentials::class)->find($req->card_credentials);
            if (!$cardCredentials) $errorMsg['violations'][] = 'Card credentials not found';
        }

        if ($errorMsg) return $this->json($errorMsg, 400, []);

        if (isset($req->user_id)) {
            $user = $this->getDoctrine()->getRepository(User::class)->find($req->user_id);
            if (!$user) return $this->json(["message" => "user not found."], 400);
            $email = $user->getEmail();
        } else if (!isset($req->email)) {
            return $this->json(["message" => "email is missing."], 400);
        } else {
            $email = $req->email;
        }

        $order = new UserOrder();

        $price = 0;
        foreach ($req->subproducts as $value) {
            $product = $subproductRepository->find($value->subproduct_id);
            if (!$product) return $this->json(['message' => 'subproduct with id ' . $value->subproduct_id . ' not found.'], 400);
            $orderSubproducts = new UserOrderSubproduct();
            $orderSubproducts->setSubproduct($product);
            $orderSubproducts->setPrice($product->getPrice());
            $orderSubproducts->setPromo($product->getPromo());
            $orderSubproducts->setUserOrder($order);
            $em->persist($orderSubproducts);

            $currentPrice = $product->getWeight() * $pricing->getPricePerKilo() * $value->quantity;
            $currentPrice += $product->getPrice();
            $price += $currentPrice;
        }
        $price += $pricing->getBasePrice();
        $order->setCost($price);

        do {
            $tracking_number = substr(str_replace(['+', '/', '='], '', base64_encode(random_bytes(32))), 0, 32);
            $orderTracking = $this->getDoctrine()->getRepository(UserOrder::class)->findOneBy(['trackingNumber' => $tracking_number]);
        } while ($orderTracking);

        $order->setTrackingNumber($tracking_number);

        if (!isset($shippingAddress)) {
            try {
                try {
                    $shippingAddress = $serializer->deserialize(json_encode($req->shipping_address), AddressShipping::class, 'json', [
                        AbstractNormalizer::IGNORED_ATTRIBUTES => ['user', 'region', 'userOrders']
                    ]);
                } catch (NotNormalizableValueException $e) {
                    return $this->json(['message' => $e->getMessage()], 400);
                }

                if (!isset($req->shipping_address->region_id)) return $this->json(['message' => 'Region is undefined'], 400);
                $region = $this->getDoctrine()->getRepository(Region::class)->findOneBy(['id' => $req->shipping_address->region_id]);
                if (!$region) return $this->json(['message' => 'Region not found'], 404);
                $shippingAddress->setRegion($region);

                $error = $validator->validate($shippingAddress);
                if (count($error) > 0) return $this->json($error, 400);
            } catch (NotEncodableValueException $e) {
                return $this->json(['message' => $e->getMessage()], 400);
            }
        }

        if (!isset($billingAddress)) {
            try {
                try {
                    $billingAddress = $serializer->deserialize(json_encode($req->billing_address), AddressBilling::class, 'json', [
                        AbstractNormalizer::IGNORED_ATTRIBUTES => ['user', 'region']
                    ]);
                } catch (NotNormalizableValueException $e) {
                    return $this->json(['message' => $e->getMessage()], 400);
                }

                if (!isset($req->billing_address->region_id)) return $this->json(['message' => 'region_id is undefined'], 400);
                $region = $this->getDoctrine()->getRepository(Region::class)->findOneBy(['id' => $req->billing_address->region_id]);
                if (!$region) return $this->json(['message' => 'Region not found'], 404);
                $billingAddress->setRegion($region);


                $error = $validator->validate($billingAddress);
                if (count($error) > 0) return $this->json($error, 400);
            } catch (NotEncodableValueException $e) {
                return $this->json(['message' => $e->getMessage()], 400);
            }
        }

        if (!isset($cardCredentials)) {
            try {
                try {
                    $cardCredentials = $serializer->deserialize(json_encode($req->card_credentials), CardCredentials::class, 'json', [
                        AbstractNormalizer::IGNORED_ATTRIBUTES => ['user']
                    ]);
                } catch (NotNormalizableValueException $e) {
                    return $this->json(['message' => $e->getMessage()], 400);
                }

                $error = $validator->validate($cardCredentials);
                if (count($error) > 0) return $this->json($error, 400);
            } catch (NotEncodableValueException $e) {
                return $this->json(['message' => $e->getMessage()], 400);
            }
        }

        if (isset($user)) {
            $user->addCardCredential($cardCredentials);
            $user->addAddressShipping($shippingAddress);
            $user->addAddressBilling($billingAddress);
            $user->addUserOrder($order);
            $em->persist($cardCredentials);
            $em->persist($user);
        }

        $order->setAddressShipping($shippingAddress);
        $order->setAddressBilling($billingAddress);
        $order->setStatus(false);
        $order->setPackaging($req->packaging);
        $order->setCreatedAt(new \DateTime());

        $em->persist($shippingAddress);
        $em->persist($billingAddress);
        $em->persist($orderSubproducts);
        $em->persist($order);
        $em->flush();

        $SendEmailTo = (new Email())
        ->from('8.commerce.clothing@gmail.com')
        ->to($email)
        ->subject('Track your order')
        ->html("WSH FREROT, ici ton suivi de commande <a href='http://" . $_SERVER['SERVER_NAME'] . "/email_act/{$tracking_number}'>Click here to track your order</a>");

        $mailer->send($SendEmailTo);

        return $this->json(['message' => 'order created', 'tracking number' => $tracking_number], 200, []);

        //at the start we check the token, if the user is logged we'll fetch the user from the database
        //find(token->user)
        //else 
    }

    /**
     * @Route("/api/checkout/shipping", name="checkout_shipping", methods="POST")
     */
    public function checkoutShipping(Request $request, SubproductRepository $subproductRepository)
    {
        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);

        if (!isset($req->region_id)) return $this->json(['message' => 'region_id missing'], 400, []);
        $region = $this->getDoctrine()->getRepository(Region::class)->find($req->region_id);
        if (!isset($region)) return $this->json(['message' => 'region not found'], 400, []);

        if (!isset($req->subproducts)) return $this->json(['message' => 'subproducts missing'], 400, []);

        $shippingPricings = $region->getShippingPricings();;
        $shippingMethods = [];
        $lowestPrice = 0;
        $lowestKey = false;
        foreach ($shippingPricings as $key => $val) {
            $method['pricing_id'] = $val->getId();
            $method['name'] = $val->getShippingMethod()->getName();
            $method['duration'] = $val->getDuration();

            $price = 0;
            foreach ($req->subproducts as $value) {
                $product = $subproductRepository->find($value->subproduct_id);
                if (!$product) return $this->json(['message' => 'subproduct with id ' . $value->subproduct_id . ' not found.']);
                $currentPrice = $product->getWeight() * $val->getPricePerKilo() * $value->quantity;
                $price += $currentPrice;
            }
            $method['price'] = $price + $val->getBasePrice();

            if ($key == 0) {
                $lowestPrice = $method['price'];
                $lowestKey = $key;
            } else if ($lowestPrice > $method['price']) {
                $lowestPrice = $method['price'];
                $lowestKey = $key;
            }
            $shippingMethods[] = $method;
        }
        return $this->json(["lowestPriceKey" => $lowestKey, "shippingMethods" => $shippingMethods], 200);
    }

    /**
     * @Route("/api/checkout/payment", name="checkout_payment")
     */
    public function checkoutPayment()
    {
        return $this->render('checkout/index.html.twig', [
            'controller_name' => 'CheckoutController',
        ]);
    }
}
