<?php

namespace App\Repository;

use App\Entity\UserOrderSubproduct;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method UserOrderSubproduct|null find($id, $lockMode = null, $lockVersion = null)
 * @method UserOrderSubproduct|null findOneBy(array $criteria, array $orderBy = null)
 * @method UserOrderSubproduct[]    findAll()
 * @method UserOrderSubproduct[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserOrderSubproductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserOrderSubproduct::class);
    }

    // /**
    //  * @return UserOrderSubproduct[] Returns an array of UserOrderSubproduct objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('u.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?UserOrderSubproduct
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
