<?php

namespace App\Controller;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use App\Repository\UserRepository;
use DateTime;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Firebase\JWT\JWT;
use Symfony\Component\HttpFoundation\Cookie;
use ReallySimpleJWT\Token;

// require '../../vendor/autoload.php';

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
        // return new JsonResponse([...$request], 400);

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
                $user->setCreatedAt(new DateTime());
                // $encoded = $passwordEncoder->encodePassword($user, $data['password']);
                $user->setPassword(password_hash($data['password'], PASSWORD_ARGON2I));
                $entityManager = $this->getDoctrine()->getManager();
                $entityManager->persist($user);
                $entityManager->flush();

                $token = $this->createToken($user);
                $userInRes = (object) ['id' => $user->getId(), 'email' => $user->getEmail()];
                return new JsonResponse(['user' => $userInRes, 'token' => $token], 200);
            }

            return new JsonResponse(['msg' => "Incorrect email or password"], 400);
        }
    }

    /**
     * @Route("/login", name="login")
     */
    public function login(Request $request, UserRepository $userRepository, UserPasswordEncoderInterface $passwordEncoder)
    {
        // return new JsonResponse(['msg' => 'Incorrect email or password'], 400);
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
            } else {
                $user = $userRepository->findBy(['email' => $data['email']])[0];
                if (password_verify($data['password'], $user->getPassword())) {

                    // $response = new Response();
                    // $response->headers->set('Content-Type', 'application/json');
                    // $response->headers->set('Access-Control-Allow-Origin', '*');
                    // $key = "example_key";
                    // $payload = array(
                    //     "iss" => "http://example.org",
                    //     "aud" => "http://example.com",
                    //     "iat" => 1356999524,
                    //     "nbf" => 1357000000
                    // );
                    // // $jwt = JWT::encode($payload, $key);
                    // // $decoded = JWT::decode($jwt, $key, array('HS256'));
                    // // $cookie = Cookie::create('token')
                    // //     ->withValue(json_encode($user))
                    // //     ->withExpires(new DateTime('tomorrow'))
                    // //     ->withSecure(true);
                    // $response->headers->setCookie(
                    //     Cookie::create('token')
                    //     ->withValue("bar")
                    //     // ->withExpires(new DateTime('tomorrow'))
                    //     ->withSecure(true)
                    // );
                    // return $response;
                    // // $response->headers->setCookie(Cookie::create('token', json_encode($user)));
                    // $response->setContent(json_encode(['user' => json_encode($userInRes), 'token' => $token]));
                    // return $response;

                    $token = $this->createToken($user);
                    $userInRes = ['id' => $user->getId(), 'email' => $user->getEmail()];
                    return new JsonResponse(['user' => $userInRes, 'token' => $token], 200);
                } else {
                    return new JsonResponse(['msg' => "Incorrect email or password"], 400);
                }
            }
        }
    }

    /**
     * @Route("/checktoken", name="checktoken")
     */
    public function checkToken(Request $request, UserRepository $userRepository, UserPasswordEncoderInterface $passwordEncoder)
    {
        if ($request->headers->get('x-auth-token')) {

            $data = $request->headers->get('x-auth-token');
            $request->request->replace(is_array($data) ? $data : array());

            if (Token::validate($data, $_ENV["APP_SECRET"])) {

                $dataInToken = Token::getPayload($data, $_ENV["APP_SECRET"]);
                if (!$userRepository->findBy(['id' => $dataInToken['user_id']])) {
                    return new JsonResponse(['msg' => 'Bad token'], 400);
                } else {
                    $user = $userRepository->findBy(['id' => $dataInToken['user_id']])[0];
                    $userInRes = ['id' => $user->getId(), 'email' => $user->getEmail()];
                    return new JsonResponse(['id' => $user->getId(), 'email' => $user->getEmail()], 200);
                }
            }
            return new JsonResponse(['msg' => "the Bad token"], 400);
        }
    }

    private function createToken($user)
    {
        $userId = $user->getId();
        $secret = $_ENV["APP_SECRET"];
        $expiration = time() + 3600 * 24;
        $issuer = '8-commerce';

        return Token::create($userId, $secret, $expiration, $issuer);
    }
}
