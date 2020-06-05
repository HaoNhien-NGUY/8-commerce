<?php

namespace App\Controller;

use App\Entity\Subproduct;
use App\Repository\ProductRepository;
use App\Repository\SubproductRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Image;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SubProductController extends AbstractController
{
    /**
     * @Route("/api/subproduct/{id}", name="subproduct_get",methods="GET", requirements={"id":"\d+"})
     */
    public function subProductDetails(Request $request, SubproductRepository $subproductRepository)
    {
        $subProduct = $subproductRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($subProduct) {
            return $this->json($subProduct, 200, [], ['groups' => 'products']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/subproduct", name="subproduct_create", methods="POST")
     */
    public function subProductCreate(Request $request, SerializerInterface $serializer, ProductRepository $productRepository, EntityManagerInterface $em, ValidatorInterface $validator)
    {
        try {
            $jsonContent = $request->getContent();
            $data = json_decode($jsonContent);
            if (!isset($data->product_id)) return $this->json(['message' => 'product id missing.'], 400);

            $product = $productRepository->findOneBy(['id' => $data->product_id]);

            $subproduct = $serializer->deserialize($jsonContent, Subproduct::class, 'json', [ObjectNormalizer::DISABLE_TYPE_ENFORCEMENT => true]);
            $subproduct->setCreatedAt(new \DateTime());
            $subproduct->setProduct($product);

            $error = $validator->validate($subproduct);
            if (count($error) > 0) return $this->json($error, 400);

            $em->persist($subproduct);
            $em->flush();

            return $this->json([
                'message' => 'created',
                'subProduct' => $subproduct
            ], 201, [], ['groups' => 'products']);
        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }

    /**
     * @Route("/api/subproduct/{id}", name="subproduct_update", methods="PUT", requirements={"id":"\d+"})
     */
    public function subProductUpdate(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, SubproductRepository $subproductRepository)
    {
        try {
            $subProduct = $subproductRepository->findOneBy(['id' => $request->attributes->get('id')]);
            if ($subProduct) {
                $jsonContent = $request->getContent();
                $req = json_decode($jsonContent);
                if (isset($req->color)) $subProduct->setColor($req->color);
                if (isset($req->size)) $subProduct->setSize($req->size);
                if (isset($req->price)) $subProduct->setPrice($req->price);
                if (isset($req->weight)) $subProduct->setWeight($req->weight);
                if (isset($req->promo)) $subProduct->setPromo($req->promo);
                if (isset($req->stock)) $subProduct->setStock($req->stock);

                $error = $validator->validate($subProduct);
                if (count($error) > 0) return $this->json($error, 400);

                $em->persist($subProduct);
                $em->flush();

                return $this->json(['subProduct' => $subProduct], 200, [], ['groups' => 'products']);
            } else {
                return $this->json(['message' => 'product not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }

    /**
     * @Route("/api/subproduct/{id}", name="subproduct_remove", methods="DELETE", requirements={"id":"\d+"})
     */
    public function subProductRemove(Request $request, SubproductRepository $subproductRepository, EntityManagerInterface $em)
    {
        $subproduct = $subproductRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($subproduct) {
            $em->remove($subproduct);
            $em->flush();

            return $this->json([
                'message' => 'subProduct removed',
                'subProduct' => $subproduct
            ], 200, [], ['groups' => 'products']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/subproduct/{id}/image", name="subproduct_add_image", methods="POST",requirements={"id":"\d+"})
     */
    public function subProductAddImage(Request $request, SubproductRepository $subrepo)
    {

        $entityManager = $this->getDoctrine()->getManager();

        $id = $request->attributes->get('id');
        $uploadedFile = $request->files->get('image');
        $ext = $uploadedFile->getClientOriginalExtension();

        if (!in_array($ext, ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG'])) {
            return $this->json([
                'message' => 'Wrong extension'
            ], 400);
        }
        $value = new \DateTime('now');
        $filename = str_replace(':', '-', $value->format('Y-m-dH:i:s')) . '.' . $ext;
        $file = $uploadedFile->move('../../client/images/' . $id, $filename);

        $image = new Image();
        $image->setImage($filename);
        $image->setSubproduct($subrepo->findOneBy(['id' => $id]));
        $entityManager->persist($image);
        $entityManager->flush();

        return $this->json([
            'message' => 'Picture correctly added'
        ], 200);
    }
}
