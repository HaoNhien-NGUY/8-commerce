<?php

namespace App\Controller;

use App\Entity\Subproduct;
use App\Repository\ProductRepository;
use App\Repository\SubproductRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Image;
use App\Entity\SubCategory;
use App\Repository\SubCategoryRepository;
use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class SubCategoryController extends AbstractController
{
    /**
     * @Route("/api/subcategory", name="subcategory_index", methods="GET")
     */
    public function index(Request $request, SubCategoryRepository $sCategoryRepository,SerializerInterface $serializer)
    {
        $category = $sCategoryRepository->findAll();
        return $this->json($category, 200, [],['groups' => 'category']);
    }

    /**
     * @Route("/api/subcategory/create/{Category}/{subCategory}", name="create_subcategory", methods="POST")
     */
    public function subCategoryCreate(Request $request, EntityManagerInterface $em,SubCategoryRepository $sCategoryRepository,CategoryRepository $CategoryRepository)
    {
        
        $Cat = $request->attributes->get('Category');
        $category = $CategoryRepository->findOneBy(['name' => $Cat]);

        if(!$category){
            return $this->json(['message' => 'Category dosen\'t exist'], 400, []);
        }
        $subCat = $request->attributes->get('subCategory');
        $find = $sCategoryRepository->findOneBy(['name' => $subCat ]);
        if($find){
            return $this->json(['message' => 'sub_Category already exist'], 400, []);
        }
        else{
            $subCategory = new SubCategory();
            $subCategory->setCategory($category);
            $subCategory->setName($subCat);
            $em->persist($subCategory);
            $em->flush();
            return $this->json(['message' => 'sub_Category successfully created'], 200, []);
        }
    }
}