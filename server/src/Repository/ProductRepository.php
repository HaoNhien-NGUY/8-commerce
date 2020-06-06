<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Product;
use App\Entity\SubCategory;
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
     * @Route("/api/product/{id}", name="product_update", methods="PUT", requirements={"id":"\d+"})
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
            return $this->json($e->getMessage(), 400);
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
    
    public function filterProducts($data, $limit, $offset)
    {
        $query = "SELECT * FROM product LEFT JOIN subproduct ON product.id = subproduct.product_id LEFT JOIN color ON subproduct.color_id = color.id WHERE ";
        $arrayExecute = [];
        if ($data['price']) {
            $query .= ' (subproduct.price > ? AND subproduct.price < ?) AND ';
            array_push($arrayExecute, $data['price']['start'], $data['price']['end']);
        }
        if ($data['sex']) {
            $query .= ' product.sex = ? AND ';
            array_push($arrayExecute, $data['sex']);
        }
        if ($data['size']) {
            $query .= '(';
            foreach ($data['size'] as $key => $value) {
                $query .= ' subproduct.size = ? OR ';
                array_push($arrayExecute, $value);
            }
            $query = substr($query, 0, -3);
            $query .= ') AND ';
        }
        if ($data['color']) {
            $query .= '(';
            foreach ($data['color'] as $key => $value) {
                $query .= ' color.name = ? OR ';
                array_push($arrayExecute, $value);
            }
            $query = substr($query, 0, -3);
            $query .= ') AND ';
        }
        if ($data['subcategory']) {
            $query .= ' product.sub_category_id = ? ';
            array_push($arrayExecute, $data['subcategory']);
        }
        if ($data['order_by']) {
            switch ($data['order_by']) {
                case 'popularity':
                    $query .= ' ORDER BY product.clicks ';
                    break;
                case 'price':
                    $query .= ' ORDER BY subproduct.price ';
                    break;
                case 'name':
                    $query .= ' ORDER BY product.title ';
                    break;
            }
        }
        if ($data['order_by_sort'] == "desc") {
            $query .= ' DESC ';
        } else {
            $query .= ' ASC ';
        }
        array_push($arrayExecute, intval($limit), intval($offset));
        $query .= " LIMIT ? OFFSET ?";

        $conn = $this->getEntityManager()
            ->getConnection();
        $stmt = $conn->prepare($query);
        for ($i = 1; $i <= sizeof($arrayExecute); $i++) {
            if (gettype($arrayExecute[$i - 1]) == 'integer') {
                $stmt->bindParam($i, $arrayExecute[$i - 1], PDO::PARAM_INT);
            } else {
                $stmt->bindParam($i, $arrayExecute[$i - 1]);
            }
        }
        $stmt->execute();
        return $stmt->fetchAll();
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
     * @Route("/api/product/{id}/image", name="subproduct_add_image", methods="POST",requirements={"id":"\d+"})
     */
    public function AddImage(Request $request, SubproductRepository $subrepo,ColorRepository $colorRepo)
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
        if(isset($colorId) && isset($uploadedFile) && isset($productId)){
            $filename = str_replace(':', '-', $value->format('Y-m-dH:i:s')) . '.' . $ext;
            if($colorId == 'default'){
                $file = $uploadedFile->move('../../client/images/'.$productId.'/default', $filename);
            }else{
                $file = $uploadedFile->move('../../client/images/'.$productId.'/'.$colorId, $filename);
            }
            
            return $this->json([
                'message' => 'Picture correctly added'
            ], 200);

        }
        else{
            return $this->json([
                'message' => 'Not found'
            ], 404);
        }
    }
}
