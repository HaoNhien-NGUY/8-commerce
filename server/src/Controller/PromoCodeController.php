<?php

namespace App\Controller;

use DateTime;
use App\Entity\PromoCode;
use App\Repository\PromoCodeRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;

class PromoCodeController extends AbstractController
{
    /**
     * @Route("/api/promocode", name="get_promocodes", methods="GET")
     */
    public function index(Request $request, PromoCodeRepository $promoCodeRepository, NormalizerInterface $normalizer)
    {
        $promoCodes = $promoCodeRepository->findBy([], null, $request->query->get('limit'), $request->query->get('offset'));

        return $this->json(['promo_codes' => $promoCodes], 200);
    }

    /**
     * @Route("/api/promocode", name="check_promocodes", methods="POST")
     */
    public function checkPromoCode(Request $request)
    {
        try {
            $jsonContent = $request->getContent();
            $data = json_decode($jsonContent);

            if (!isset($data->promocode)) return $this->json(['message' => 'The promo code is missing.'], 400);

            $promoCode = $this->getDoctrine()->getRepository(PromoCode::class)->findBy(['code' => $data->promocode])[0];
            if (!$promoCode) return $this->json(['message' => 'Promo Code doesn\'t exist.'], 404);
            if ($promoCode->getDateEnd() < new DateTime() && !$promoCode->getUsedLimit()) return $this->json(['message' => 'Promo Code has expired.'], 404);
            if ($promoCode->getUsedLimit()) {
                if ($promoCode->getUsedLimit() <= $promoCode->getUsedTimes()) return $this->json(['message' => 'Promo Code has been used to its limit.'], 404);
                if ($promoCode->getDateEnd() < new DateTime() && $promoCode->getDateEnd()) return $this->json(['message' => 'Promo Code has expired.'], 404);
            }

            return $this->json([
                'id' => $promoCode->getId(),
                'code' => $promoCode->getCode(),
                "percentage" => $promoCode->getPercentage()
            ], 200);
        } catch (NotEncodableValueException $e) {
            return $this->json(['message' => $e->getMessage()], 400);
        }
    }
}
