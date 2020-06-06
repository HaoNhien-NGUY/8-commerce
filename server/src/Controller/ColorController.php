<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\Product;
use App\Entity\Color;
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


class ColorController extends AbstractController
{


    /**
     * @Route("/api/color/", name="color_index", methods="GET")
     */
    public function colorIndex(ColorRepository $colorRepository)
    {
        $colors = $colorRepository->findAll();

        return $this->json($colors, 200, [],['groups' => 'color']);
    }

    /**
     * @Route("/api/color/{color}", name="color_create", methods="POST")
     */
    public function colorCreate(Request $request,EntityManagerInterface $em, ValidatorInterface $validator)
    {
        $newColor = $request->attributes->get('color');

        $color = new Color();
        $color->setName($newColor);

        $error = $validator->validate($color);
        if (count($error) > 0) return $this->json($error, 400);

        $em->persist($color);
        $em->flush();

        return $this->json(['message' => 'Color correctly added'], 200, []);
    }

    /**
     * @Route("/api/color/{id}", name="color_delete", methods="DELETE")
     */
    public function colorRemove(Request $request,EntityManagerInterface $em,ColorRepository $colorRepository)
    {
        $id = $request->attributes->get('id');
        $color = $colorRepository->findOneBy(['id' => $id ]);

        if ($color) {
            $em->remove($color);
            $em->flush();

            return $this->json(['message' => 'Color successfully removed'], 200, []);
        } else {
            return $this->json(['message' => 'not found'], 404, []);
        }
    }
}