<?php

namespace App\Entity;

// use App\Repository\SupplierOrderRepository;
// use Doctrine\Common\Collections\ArrayCollection;
// use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="supplier_order_subproduct")
 */
class SupplierOrderSubproduct
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="Subproduct")
     * @ORM\JoinColumn(nullable=false)
     */
    private $subproduct;

    /**
     * @ORM\ManyToOne(targetEntity="SupplierOrder",inversedBy="subproducts")
     * @ORM\JoinColumn(nullable=false)
     */
    private $supplier_order;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"supplier_order_details"})
     */
    private $stock;


    public function getId()
    {
        return $this->id;
    }

    public function getSubproduct()
    {
        return $this->subproduct;
    }

    public function setSubproduct($subproduct)
    {
        $this->subproduct = $subproduct;
    }

    public function getSupplierOrder()
    {
        return $this->supplier_order;
    }

    public function setSupplierOrder($supplier_order)
    {
        $this->supplier_order = $supplier_order;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(int $stock): self
    {
        $this->stock = $stock;

        return $this;
    }

}