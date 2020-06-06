<?php

namespace App\Controller;


use App\Entity\Category;
use App\Entity\Product;
use App\Entity\SubCategory;
use App\Kernel;
use App\Repository\ImageRepository;
use App\Repository\ColorRepository;
use App\Repository\SubproductRepository;
use App\Repository\ProductRepository;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Exception\NotNormalizableValueException;
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
                AbstractNormalizer::IGNORED_ATTRIBUTES => ['subcategory', 'subproducts'],
                ObjectNormalizer::DISABLE_TYPE_ENFORCEMENT => true
            ]);
            if (!isset($req->subcategory)) return $this->json(['message' => 'subcategory missing'], 400, []);
            $subCategory = $this->getDoctrine()
                ->getRepository(SubCategory::class)
                ->find($req->subcategory);
            $product->setSubCategory($subCategory);
            $product->setCreatedAt(new DateTime());

            $error = $validator->validate($product);
            if (count($error) > 0) return $this->json($error, 400);

            $em->persist($product);
            $em->flush();

            return $this->json(['product' => $product], 201, [], ['groups' => 'products']);
        } catch (NotEncodableValueException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
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
     * @Route("/api/product/{id}", name="product_update", methods="PUT", requirements={"id":"\d+"})
     */
    public function productUpdate(Request $request, EntityManagerInterface $em, ValidatorInterface $validator, SerializerInterface $serializer, ProductRepository $productRepository)
    {
        try {
            $jsonContent = $request->getContent();
            $req = json_decode($jsonContent);
            $product = $productRepository->findOneBy(['id' => $request->attributes->get('id')]);;
            if ($product) {
                try {
                    $product = $serializer->deserialize($jsonContent, Product::class, 'json', [
                        AbstractNormalizer::IGNORED_ATTRIBUTES => ['subcategory', 'subproducts', 'promo'],
                        AbstractNormalizer::OBJECT_TO_POPULATE => $product
                    ]);
                } catch (NotNormalizableValueException $e) {
                    return $this->json(['message' => $e->getMessage()], 400, []);
                }
                if (isset($req->subcategory)) {
                    $subcategory = $this->getDoctrine()->getRepository(SubCategory::class)->find($req->category);
                    $product->setSubCategory($subcategory);
                }
                if (isset($req->promo)) {
                    $promoNb = $req->promo === 0 ? null : $req->promo;
                    $product->setPromo($promoNb);
                }

                $error = $validator->validate($product);
                if (count($error) > 0) return $this->json($error, 400);

                $em->persist($product);
                $em->flush();

                return $this->json(['product' => $product], 200, [], ['groups' => 'products', AbstractNormalizer::IGNORED_ATTRIBUTES => ['subproducts']]);
            } else {
                return $this->json(['message' => 'product not found'], 404, []);
            }
        } catch (NotEncodableValueException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }
    }

    /**
     * @Route("/api/product/{id}", name="product_remove", methods="DELETE", requirements={"id":"\d+"})
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

    /**
     * @Route("/api/product/filter", name="product_filter", methods="POST")
     */
    public function filterProducts(Request $request, ProductRepository $productRepository)
    {
        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }

        $result = $productRepository->filterProducts($data, $request->query->get('limit'), $request->query->get('offset'));

        return $this->json($result, 200);
    }


    /**
     * @Route("/api/product/{id}/image", name="subproduct_add_image", methods="POST",requirements={"id":"\d+"})
     */
    public function addImage(Request $request, SubproductRepository $subrepo, ColorRepository $colorRepo)
    {

        $entityManager = $this->getDoctrine()->getManager();

        $productId = $request->attributes->get('id');
        $uploadedFile = $request->files->get('image');
        $colorId = $request->request->get('color');

        $ext = $uploadedFile->getClientOriginalExtension();

        if (!in_array($ext, ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG'])) {
            return $this->json([
                'message' => 'Wrong extension'
            ], 400);
        }
        //product id / color / img 
        $value = new \DateTime('now');
        if (isset($colorId) && isset($uploadedFile) && isset($productId)) {
            $filename = str_replace(':', '-', $value->format('Y-m-dH:i:s')) . '.' . $ext;
            if ($colorId == 'default') {
                $file = $uploadedFile->move('../../client/images/' . $productId . '/default', $filename);
            } else {
                $file = $uploadedFile->move('../../client/images/' . $productId . '/' . $colorId, $filename);
            }

            return $this->json([
                'message' => 'Picture correctly added'
            ], 200);
        } else {
            return $this->json([
                'message' => 'Not found'
            ], 404);
        }
    }

    /**
     * @Route("/api/product/{id}/image", name="get_images", methods="GET",requirements={"id":"\d+"})
     */
    public function getImage(Request $request)
    {
        $jsonContent = $request->getContent();
        $req = json_decode($jsonContent);

        $productId = $request->attributes->get('id');
        $colorId = $req->color;
        $path = '../../client/images/' . $productId . '/' . $colorId;

        if (isset($colorId) && isset($productId) && is_dir($path)) {
            $images = array_diff(scandir($path), array('.', '..'));
            return $this->json($images, 200);
        } else {
            return $this->json([
                'message' => 'Not found'
            ], 400);
        }
    }
}
