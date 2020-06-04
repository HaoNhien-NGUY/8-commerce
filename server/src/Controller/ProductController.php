<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Product;
use App\Entity\Image;
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
use Symfony\Component\HttpFoundation\Response;

class ProductController extends AbstractController
{
    /**
     * @Route("/api/product", name="product_index", methods="GET")
     */
    public function index(ProductRepository $productRepository, SerializerInterface $serializer)
    {
        $json = $serializer->serialize($productRepository->findAll(), 'json', ['groups' => 'products']);

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
            $product = $serializer->deserialize($jsonContent, Product::class, 'json', [AbstractNormalizer::IGNORED_ATTRIBUTES => ['category', 'subproducts']]);
            $category = $this->getDoctrine()
                ->getRepository(Category::class)
                ->find($req->category);
            $product->setCategory($category);
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
    public function productDetails(Request $request, ProductRepository $productRepository)
    {  
        // dd($request->attributes->get('id'));
        $product = $productRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if($product){
            return $this->json($product, 200, [], ['groups' => 'products']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
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

    /**
     * @Route("/api/picture/{id}", name="add_picture", methods="POST",requirements={"id":"\d+"})
     */
    public function addPicture(Request $request,SubproductRepository $subrepo)
    {

        $entityManager = $this->getDoctrine()->getManager();

        $id = $request->attributes->get('id');
        $uploadedFile = $request->files->get('image');
        $ext = $uploadedFile->getClientOriginalExtension();

        if(!in_array($ext,['jpg', 'JPG', 'png' ,'PNG' ,'jpeg' ,'JPEG'])){
            return $this->json([
                'message' => 'Wrong extension'
            ],400);
        }
        $value = new \DateTime('now');
        $filename = $value->format('Y-m-dH:i:s').'.'.$ext;
        $file = $uploadedFile->move('../../client/images/'.$id, $filename);

        $image = new Image();
        $image->setImage($filename);
        $image->setSubproduct($subrepo->findOneBy(['id' => $id]));
        $entityManager->persist($image);
        $entityManager->flush();
    
        return $this->json([
            'message' => 'Picture correctly added'
        ], 200);
    }
    // public function 
}
