<?php

namespace App\Entity;

use App\Repository\SubproductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Mapping\ClassMetadata;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=SubproductRepository::class)
 */
class Subproduct
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"products", "subproduct", "supplier_order_details", "supplier_products"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=Product::class, inversedBy="subproducts")
     * @ORM\JoinColumn(nullable=false, onDelete="CASCADE")
     * @Groups({"subproduct", "supplier_order_details"})
     */
    private $product;

    /**
     * @ORM\Column(type="float")
     * @Groups({"products", "subproduct", "supplier_order_details", "supplier_products"})
     */
    private $price;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"products", "subproduct", "supplier_order_details", "supplier_products"})
     */
    private $size;

    /**
     * @ORM\Column(type="float", length=255)
     * @Groups({"products", "subproduct", "supplier_order_details", "supplier_products"})
     */
    private $weight;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"products", "subproduct", "supplier_order_details"})
     */
    private $promo;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"products", "subproduct", "supplier_order_details"})
     */
    private $created_at;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups({"products", "subproduct", "supplier_order_details", "supplier_products"})
     */
    private $stock;

    /**
     * @ORM\ManyToOne(targetEntity=Color::class, inversedBy="subproduct")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"subproduct","products", "supplier_order_details", "supplier_products"})
     */
    private $color;

    /**
     * @ORM\OneToMany(targetEntity=SupplierOrderSubproduct::class, mappedBy="subproduct", orphanRemoval=true, cascade={"remove"}, cascade={"persist"})
     */
    private $supplierOrderSubproducts;

    /**
     * @ORM\ManyToMany(targetEntity=UserOrder::class, mappedBy="subproduct")
     */
    private $userOrders;

    public function __construct()
    {
        $this->supplierOrderSubproducts = new ArrayCollection();
        $this->userOrders = new ArrayCollection();
    }

    public static function loadValidatorMetadata(ClassMetadata $metadata)
    {
        $metadata->addPropertyConstraint('price', new Assert\NotBlank());
        $metadata->addPropertyConstraint('price', new Assert\Type(['type' => ['integer', 'double', 'numeric']]));
        $metadata->addPropertyConstraint('size', new Assert\NotBlank());
        $metadata->addPropertyConstraint('weight', new Assert\NotBlank());
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProduct(): ?Product
    {
        return $this->product;
    }

    public function setProduct(?Product $product): self
    {
        $this->product = $product;

        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): self
    {
        $this->price = $price;

        return $this;
    }


    public function getSize(): ?string
    {
        return $this->size;
    }

    public function setSize(string $size): self
    {
        $this->size = $size;

        return $this;
    }

    public function getWeight(): ?string
    {
        return $this->weight;
    }

    public function setWeight(string $weight): self
    {
        $this->weight = $weight;

        return $this;
    }

    public function getPromo(): ?int
    {
        return $this->promo;
    }

    public function setPromo(?int $promo): self
    {
        $this->promo = $promo;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): self
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getStock(): ?int
    {
        return $this->stock;
    }

    public function setStock(?int $stock): self
    {
        $this->stock = $stock;

        return $this;
    }

    public function getColor(): ?Color
    {
        return $this->color;
    }

    public function setColor(?Color $color): self
    {
        $this->color = $color;

        return $this;
    }

    /**
     * @return Collection|SupplierOrderSubproduct[]
     */
    public function getSupplierOrderSubproducts(): Collection
    {
        return $this->supplierOrderSubproducts;
    }

    public function addSupplierOrderSubproduct(SupplierOrderSubproduct $supplierOrderSubproduct): self
    {
        if (!$this->supplierOrderSubproducts->contains($supplierOrderSubproduct)) {
            $this->supplierOrderSubproducts[] = $supplierOrderSubproduct;
            $supplierOrderSubproduct->setSubproduct($this);
        }

        return $this;
    }

    public function removeSupplierOrderSubproduct(SupplierOrderSubproduct $supplierOrderSubproduct): self
    {
        if ($this->supplierOrderSubproducts->contains($supplierOrderSubproduct)) {
            $this->supplierOrderSubproducts->removeElement($supplierOrderSubproduct);
            // set the owning side to null (unless already changed)
            if ($supplierOrderSubproduct->getSubproduct() === $this) {
                $supplierOrderSubproduct->setSubproduct(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|UserOrder[]
     */
    public function getUserOrders(): Collection
    {
        return $this->userOrders;
    }

    public function addUserOrder(UserOrder $userOrder): self
    {
        if (!$this->userOrders->contains($userOrder)) {
            $this->userOrders[] = $userOrder;
            $userOrder->addSubproduct($this);
        }

        return $this;
    }

    public function removeUserOrder(UserOrder $userOrder): self
    {
        if ($this->userOrders->contains($userOrder)) {
            $this->userOrders->removeElement($userOrder);
            $userOrder->removeSubproduct($this);
        }

        return $this;
    }
}
