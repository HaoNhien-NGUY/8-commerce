<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserController extends AbstractController
{
    /**
     * @Route("/user", name="user")
     */
    public function index()
    {
        return $this->render('user/index.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }

    /**
     * @Route("/register", name="register")
     */
    public function register(Request $request, UserRepository $userRepository, UserPasswordEncoderInterface $passwordEncoder)
    {
        // gets the json data
        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
        // checks if email and password are correctly input
        if (!isset($data['email']) || !isset($data['password'])) {
            // sends error if email or password are missing
            return new JsonResponse(['msg' => 'Email or password are missing'], 400);
        } else {
            // checks if the email is already taken
            if ($userRepository->findBy(['email' => $data['email']])) {
                // sends error if the email is already in use
                return new JsonResponse(['msg' => 'Email already in use'], 401);
            } else {
                // register the user
                $user = new User();
                $user->setEmail($data['email']);
                $encoded = $passwordEncoder->encodePassword($user, $data['password']);
                $user->setPassword($encoded);
                $entityManager = $this->getDoctrine()->getManager();
                $entityManager->persist($user);
                $entityManager->flush();
                return new JsonResponse(['msg' => 'User successfully registered'], 200);
            }
        }
    }

    /**
     * @Route("/login", name="login")
     */
    public function login(Request $request, UserRepository $userRepository, UserPasswordEncoderInterface $passwordEncoder)
    {
        // gets the json data
        if (0 === strpos($request->headers->get('Content-Type'), 'application/json')) {
            $data = json_decode($request->getContent(), true);
            $request->request->replace(is_array($data) ? $data : array());
        }
        // checks if email and password are correctly input
        if (!isset($data['email']) || !isset($data['password'])) {
            // sends error if email or password are missing
            return new JsonResponse(['msg' => 'Email or password are missing'], 400);
        } else {
            if (!$userRepository->findBy(['email' => $data['email']])) {
                return new JsonResponse(['msg' => 'Incorrect email or password'], 400);
            }
            else
            {
                $user = $userRepository->findBy(['email' => $data['email']]);
                if($passwordEncoder->isPasswordValid($user, $data['password']))
                {}
            }
        }
    }
}
