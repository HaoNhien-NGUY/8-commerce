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
        $productId = $request->attributes->get('id');
        $product = $productRepository->findOneBy(['id' => $productId]);
        if ($product) {
            $productResp = $normalizer->normalize($product, null, ['groups' => 'products']);
            $sum = $productRepository->findStockSum($product);
            $productResp = array_merge($productResp, $sum[0]);

            $imgArray = [];
            $colorIdArr = scandir("./images/$productId");
            $colorIdArr = array_filter($colorIdArr, function ($v) {
                return is_numeric($v);
            });

            foreach ($colorIdArr as $v) {
                $path = "/image/$productId/$v";
                $ColorImgLinks["color_id"] = $v;
                $imgLinks = array_diff(scandir("./images/$productId/$v"), [".", ".."]);
                $imgLinks = array_map(function ($v) use ($path) {
                    return "$path/$v";
                }, $imgLinks);

                $ColorImgLinks["links"] = $imgLinks;
                array_push($imgArray, $ColorImgLinks);
            }
            $productResp = array_merge($productResp, ["images" => $imgArray]);

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
                if (isset($req->title)) $product->setTitle($req->title);
                if (isset($req->description)) $product->setDescription($req->description);
                if (isset($req->sex)) $product->setSex($req->sex);
                if (isset($req->status)) $product->setStatus($req->status);

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
     * @Route("/api/image/{productid}/{colorid}/{imagename}", name="get_image", methods="GET" , requirements={"productid":"\d+","colorid":"\d+"})
     */
    public function getImage(Request $request)
    {
        $productId = $request->attributes->get('productid');
        $colorId = $request->attributes->get('colorid');
        $imageName = $request->attributes->get('imagename');

        $name = "./images/$productId/$colorId/$imageName";
        $fp = fopen($name, 'rb');

        header("Content-Type: image/jpg");
        header("Content-Length: " . filesize($name));

        fpassthru($fp);
    }


    /**
     * @Route("/api/image/{id}", name="product_add_image", methods="POST",requirements={"id":"\d+"})
     */
    public function addImage(Request $request)
    {

        $productId = $request->attributes->get('id');
        $uploadedFile = $request->files->get('image');
        $colorId = $request->request->get('color');
        $name = "./images/$productId/$colorId/";

        $ext = $uploadedFile->getClientOriginalExtension();

        if (!in_array($ext, ['jpg', 'JPG', 'png', 'PNG', 'jpeg', 'JPEG'])) {
            return $this->json([
                'message' => 'Wrong extension'
            ], 400);
        }

        if (isset($colorId) && isset($uploadedFile) && isset($productId)) {

            $filename = is_dir($name) && count(array_diff(scandir($name), array('.', '..'))) > 0 ?  (count(array_diff(scandir($name), array('.', '..'))) + 1) . '.' . $ext : "1" . '.' . $ext;

            $file = $uploadedFile->move($name, $filename);

            return $this->json([
                'message' => 'Picture correctly added'
            ], 200);
        } else {

            return $this->json([
                'message' => 'Not found'
            ], 404);
        }
    }
}