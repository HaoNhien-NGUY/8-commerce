<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Product;
use App\Entity\SubCategory;
use App\Repository\ImageRepository;
use App\Repository\ProductRepository;
use App\Repository\SubproductRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;

class ProductController extends AbstractController
{
    /**
     * @Route("/api/product", name="product_index", methods="GET")
     */
    public function index(Request $request, ProductRepository $productRepository)
    {
        $count = $productRepository->countResults();
        $products = $productRepository->findBy([], null, $request->query->get('limit'), $request->query->get('offset'));

        return $this->json(['nbResults' => $count, 'data' => $products], 200, [], ['groups' => 'products']);
    }

    /**
     * @Route("/api/product", name="product_create", methods="POST")
     */
    public function productCreate(Request $request, SerializerInterface $serializer, EntityManagerInterface $em, ValidatorInterface $validator)
    {
        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $product = $serializer->deserialize($jsonContent, Product::class, 'json', [
                AbstractNormalizer::IGNORED_ATTRIBUTES => ['category', 'subproducts'],
                ObjectNormalizer::DISABLE_TYPE_ENFORCEMENT => true
            ]);
            $category = $this->getDoctrine()
                ->getRepository(Category::class)
                ->find($req->category);
            $product->setCategory($category);
            $product->setCreatedAt(new DateTime());
            $product->setStatus($req->status);

            $error = $validator->validate($product);
            if (count($error) > 0) return $this->json($error, 400);

            $em->persist($product);
            $em->flush();

            return $this->json(['product' => $product], 201, [], ['groups' => 'products']);
        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }

    /**
     * @Route("/api/product/{id}", name="product_details", methods="GET", requirements={"id":"\d+"})
     */
    public function productDetails(Request $request, ProductRepository $productRepository, NormalizerInterface $normalizer, EntityManagerInterface $em)
    {
        $product = $productRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($product) {
            $productResp = $normalizer->normalize($product, null, ['groups' => 'products']);
            $sum = $productRepository->findStockSum($product);
            $productResp = array_merge($productResp, $sum[0]);

            $product->setClicks($product->getClicks() + 1);
            $em->persist($product);
            $em->flush();
            return $this->json($productResp, 200, [], ['groups' => 'products']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/product/{id}", name="product_update", methods="PUT")
     */
    public function productUpdate(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, ProductRepository $productRepository)
    {
        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $product = $productRepository->findOneBy(['id' => $request->attributes->get('id')]);
            if ($product) {
                if (isset($req->subcategory)) {
                    $subcategory = $this->getDoctrine()->getRepository(SubCategory::class)->find($req->category);
                    $product->setSubCategory($subcategory);
                }
                if (isset($req->promo) && $req->promo === 0) {
                    $promoNb = $req->promo === 0 ? null : $req->promo;
                    $product->setPromo($promoNb);
                }
                if (isset($req->title)) $product->setTitle($req->title);
                if (isset($req->description)) $product->setDescription($req->description);
                if (isset($req->price)) $product->setPrice($req->price);
                if (isset($req->sex)) $product->setSex($req->sex);

                $error = $validator->validate($product);
                if (count($error) > 0) return $this->json($error, 400);

                $em->persist($product);
                $em->flush();

                return $this->json(['product' => $product], 200, [], ['groups' => 'products']);
            } else {
                return $this->json(['message' => 'product not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json($e->getMessage(), 400);
        }
    }

    /**
     * @Route("/api/product/{id}", name="product_remove", methods="DELETE")
     */
    public function productRemove(Request $request, ProductRepository $productRepository, EntityManagerInterface $em)
    {
        $product = $productRepository->findOneBy(['id' => $request->attributes->get('id')]);

        if ($product) {
            $em->remove($product);
            $em->flush();

            return $this->json([
                'message' => 'product removed',
                'product' => $product
            ], 200, [], ['groups' => 'products']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/product/search/{search}", name="product_search", methods="GET")
     */
    public function productSearch(Request $request, ProductRepository $productRepository)
    {
        $result = $productRepository->findSearchResult($request->attributes->get('search'), $request->query->get('limit'), $request->query->get('offset'));
        return $this->json($result);
    }
}
