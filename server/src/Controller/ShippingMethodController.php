<?php

namespace App\Controller;

use App\Entity\Subproduct;
use App\Repository\ProductRepository;
use App\Repository\SubproductRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Image;
use App\Entity\Region;
use App\Entity\ShippingMethod;
use App\Repository\ShippingMethodRepository;

use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ShippingMethodController extends AbstractController
{

    /**
     * @Route("/api/shippingmethod", name="shippingmethod_index", methods="GET")
     */
    public function index(ShippingMethodRepository $shippingMethodRepository)
    {
        $shippingMethod = $shippingMethodRepository->findAll();
        return $this->json($shippingMethod, 200, [],['groups' => 'shipping']);
    }

    /**
     * @Route("/api/shippingmethod", name="shippingmethod_create", methods="POST")
     */
    public function shippingMethod_create(Request $request ,ShippingMethodRepository $shippingMethodRepository,EntityManagerInterface $em)
    {
        $req = json_decode($request->getContent());
        
        $find = $shippingMethodRepository->findOneBy(['name' => $req->name]);

        if($find){
            return $this->json(['message' => 'This shipping method already exist'], 400, []);
        }
        else{
            $shippingMethod  = new ShippingMethod();
            $shippingMethod->setName($req->name);
            $em->persist($shippingMethod);
            $em->flush();
            return $this->json(['message'=>'Region successfully created',$shippingMethod], 200,[],['groups' => 'shipping']);
        }

    }

}