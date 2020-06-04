<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Product;
use App\Entity\SubCategory;
use App\Repository\ImageRepository;
use Symfony\Component\HttpFoundation\Response;
use App\Repository\ProductRepository;
use App\Repository\SubproductRepository;
use App\Repository\CategoryRepository;
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


use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;

class CategoryController extends AbstractController
{
//text
// text + id

    //retourner toute les category

    /**
     * @Route("/api/category", name="category_index", methods="GET")
     */
    public function index(Request $request, CategoryRepository $categoryRepository,SerializerInterface $serializer,NormalizerInterface $normalizer)
    {
        $category = $categoryRepository->findAll();
        return $this->json($category, 200, [],['groups' => 'category']);
    }

    //create a category
    /**
     * @Route("/api/category/create/{category}", name="create_category", methods="POST")
     */
    public function categoryCreate(Request $request, EntityManagerInterface $em,CategoryRepository $categoryRepository)
    {
        $newCat = $request->attributes->get('category');
        $find = $categoryRepository->findOneBy(['name' => $newCat ]);
        if($find){
            return $this->json(['message' => 'category already exist'], 400, []);
        }
        else{
            $category = new Category();
            $category->setName($newCat);
            $em->persist($category);
            $em->flush();
            return $this->json(['message' => 'category successfully created'], 200, []);
        }
    }

    /**
     * @Route("/api/category/search/{search}", name="search_category", methods="GET")
     */
    public function categorySearch(Request $request, CategoryRepository $categoryRepository)
    {
        $result = $categoryRepository->findSearchResult($request->attributes->get('search'), $request->query->get('limit'), $request->query->get('offset'));
        return $this->json($result);
    }

}