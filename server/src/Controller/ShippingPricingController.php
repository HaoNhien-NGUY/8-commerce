<?php

namespace App\Controller;

use App\Entity\Subproduct;
use App\Repository\ProductRepository;
use App\Repository\SubproductRepository;
use Doctrine\ORM\EntityManagerInterface;

use App\Entity\ShippingPricing;
use App\Entity\Region;
use App\Repository\RegionRepository;
use App\Repository\ShippingPricingRepository;
use App\Repository\ShippingMethodRepository;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ShippingPricingController extends AbstractController
{

    /**
     * @Route("/api/shippingpricing", name="shippingpricing_index", methods="GET")
     */
    public function index(ShippingPricingRepository $shippingPricingRepository)
    {
        $shippingPricing = $shippingPricingRepository->findAll();
        return $this->json($shippingPricing, 200, [],['groups' => 'shipping']);
    }

    /**
     * @Route("/api/shippingpricing", name="shippingpricing_create", methods="POST")
     */
    public function shippingMethod_create(Request $request ,ShippingPricingRepository $shippingPricingRepository,ShippingMethodRepository $shippingMethodRepository,RegionRepository $regionRepository,EntityManagerInterface $em)
    {
        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);
   
        if(!isset($req->region)){
            return $this->json(['Region is undefined'],400);
        }
        if(!isset($req->shippingMethod)){
            return $this->json(['Shipping Method is undefined'],400);
        }

        $find = $shippingPricingRepository->findOneBy(['shippingMethod' => $req->shippingMethod,'region'=> $req->region]);

        if($find){
            return $this->json(['message' => 'This shipping method with this method and region already exist'], 400, []);
        }
        else{

            $region = $regionRepository->findOneBy(['id' => $req->region]);
            if(!$region){
                return $this->json(['Region not found'],404);
            }
        
            $shippingMethod = $shippingMethodRepository->findOneBy(['id' => $req->shippingMethod]);
            if(!$shippingMethod){
                return $this->json(['Shipping method not found'],404);
            }

            if(!isset($req->pricePerKilo)){
                return $this->json(['Price per kilo is undefined'],400);
            }

            if(!isset($req->duration)){
                return $this->json(['Duration is undefined'],400);
            }

            if(!isset($req->basePrice)){
                return $this->json(['Base Price is undefined'],400);
            }
           

            $shippingPricing  = new ShippingPricing();
            $shippingPricing->setShippingMethod($shippingMethod);
            $shippingPricing->setRegion($region);
            $shippingPricing->setPricePerKilo($req->pricePerKilo);
            $shippingPricing->setDuration($req->duration);
            $shippingPricing->setBasePrice($req->basePrice);
            $em->persist($shippingPricing);
            $em->flush();
            return $this->json(['message'=>'Shipping Pricing successfully created',$shippingPricing], 200,[],['groups' => 'shipping']);
        }

    }
}