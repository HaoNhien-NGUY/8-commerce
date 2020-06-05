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


    /**
     * @Route("/api/category", name="category_index", methods="GET")
     */
    public function index(CategoryRepository $categoryRepository)
    {
        $category = $categoryRepository->findAll();
        return $this->json($category, 200, [],['groups' => 'category']);
    }


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
     * @Route("/api/category/{id}", name="remove_category", methods="DELETE")
     */
    public function categoryRemove(Request $request, EntityManagerInterface $em,CategoryRepository $categoryRepository)
    {
        $id = $request->attributes->get('id');
        $category = $categoryRepository->findOneBy(['id' => $id ]);
        if ($category) {
            $em->remove($category);
            $em->flush();

            return $this->json(['message' => 'Category successfully removed'], 200, []);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }

    /**
     * @Route("/api/category/{id}", name="category_details", methods="GET", requirements={"id":"\d+"})
     */
    public function productDetails(Request $request, CategoryRepository $CatRepository, EntityManagerInterface $em)
    {
        $Category = $CatRepository->findOneBy(['id' => $request->attributes->get('id')]);
        if ($Category) {
            return $this->json($Category, 200, [], ['groups' => 'category']);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
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