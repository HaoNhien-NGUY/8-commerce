<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    public function findStockSum($product)
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.subproducts', 'sp')
            ->select('SUM(sp.stock) as totalStock')
            ->andWhere('p.id = :id')
            ->setParameter('id', $product->getId())
            ->getQuery()
            ->getResult();
    }

    public function findSearchResult($searchString, $limit, $offset)
    {
        $conn = $this->getEntityManager()
            ->getConnection();
        $sql = '
        SELECT * FROM product
        WHERE title REGEXP :search OR description REGEXP :search LIMIT :limit OFFSET :offset
        ';
        $stmt = $conn->prepare($sql);
        $stmt->execute(array('search' => $searchString, 'limit' => $limit, 'offset' => $offset));
        return $stmt->fetchAll();
    }

    // /**
    //  * @return Product[] Returns an array of Product objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Product
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
