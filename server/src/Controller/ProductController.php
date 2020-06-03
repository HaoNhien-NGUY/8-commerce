<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Product;
use App\Repository\ProductRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Entity\Category as EntityCategory;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

class ProductController extends AbstractController
{
    /**
     * @Route("/api/product", name="product_index", methods="GET")
     */
    public function index(ProductRepository $productRepository, SerializerInterface $serializer)
    {
        // dd($productRepository->findAll());

        // return $this->json($productRepository->findAll(), 200, [], ['groups' => 'products']);

        $json = $serializer->serialize($productRepository->findAll(), 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['category', 'subproducts']]);
        // $json = $serializer->serialize($productRepository->findAll(), 'json', ['groups' => 'products']);

        return new JsonResponse($json, 200, [], true);
    }

    /**
     * @Route("/api/product", name="product_create", methods="POST")
     */
    public function productCreate(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator)
    {
        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);

        try {
            $product = $serializer->deserialize($jsonContent, Product::class, 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['Category', 'subproducts']]);
            // $product = new Product();
            // $product->setTitle($req->title);
            // $product->setDescription($req->description);
            // $product->setPrice($req->price);
            $category = $this->getDoctrine()
                ->getRepository(Category::class)
                ->find($req->category);
            $product->setCategory($category);
            $product->setCreatedAt(new DateTime());


            $error = $validator->validate($product);
            if (count($error) > 0) return $this->json($error, 400);

            $em->persist($product);
            $em->flush();

            // return $this->json($product, 201);
            return $this->json(['message' => 'product created'], 201);

        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }

    /**
     * @Route("/api/product/{id}", name="product_details", methods="GET", requirements={"id":"\d+"})
     */
    public function productDetails(Product $product, SerializerInterface $serializer)
    {
        $json = $serializer->serialize($product, 'json', ['groups' => 'products']);

        return $this->json($product, 200, []);

        // return new JsonResponse($json, 200, [], true);
    }

    /**
     * @Route("/api/product/{id}", name="product_remove", methods="DELETE")
     */
    public function productRemove(Product $product, EntityManagerInterface $em)
    {
        $em->remove($product);
        return $this->json([
            'message' => 'product removed'
        ], 200);
    }
}
