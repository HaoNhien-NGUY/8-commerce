<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Mapping\ClassMetadata;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ProductRepository::class)
 */
class Product
{
    /**
     * @Groups("products")
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups("products")
     */
    private $id;

    /**
     * @ORM\OneToOne(targetEntity=Category::class, inversedBy="product", cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=false)
     * @Groups("products")
     */
    private $Category;

    
    /**
     * @ORM\Column(type="string", length=255)
     * @Groups("products")
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups("products")
     */
    private $description;

    /**
     * @ORM\Column(type="float",nullable=true)
     * @Groups("products")
     */
    private $price;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups("products")
     */
    private $promo;

    /**
     * @ORM\Column(type="datetime")
     * @Groups("products")
     */
    private $created_at;

    /**
     * @ORM\Column(type="integer", nullable=true)
     * @Groups("products")
     */
    private $clicks;

    /**
     * @ORM\OneToMany(targetEntity=Subproduct::class, mappedBy="product")
     * @Groups("products")
     */
    private $subproducts;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups("products")
     */
    private $sex;

    /**
     * @ORM\ManyToOne(targetEntity=Category::class, inversedBy="Product")
     * @ORM\JoinColumn(nullable=false)
     */
    private $category;



    public function __construct()
    {
        $this->subproducts = new ArrayCollection();
    }

    public static function loadValidatorMetadata(ClassMetadata $metadata)
    {
        $metadata->addPropertyConstraint('title', new Assert\NotBlank());
        $metadata->addPropertyConstraint('Category', new Assert\NotBlank());
        $metadata->addPropertyConstraint('description', new Assert\NotBlank());
        $metadata->addPropertyConstraint('price', new Assert\NotBlank());
    }

    public function getId(): ?int
    {
        return $this->id;
    }


    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPrice(): ?int
    {
        return $this->price;
    }

    public function setPrice(int $price): self
    {
        $this->price = $price;

        return $this;
    }

    public function getSex(): ?string
    {
        return $this->sex;
    }

    public function setSex(string $sex): self
    {
        $this->sex = $sex;

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

    public function getClicks(): ?int
    {
        return $this->clicks;
    }

    public function setClicks(?int $clicks): self
    {
        $this->clicks = $clicks;

        return $this;
    }

    /**
     * @return Collection|Subproduct[]
     */
    public function getSubproducts(): Collection
    {
        return $this->subproducts;
    }

    public function addSubproduct(Subproduct $subproduct): self
    {
        if (!$this->subproducts->contains($subproduct)) {
            $this->subproducts[] = $subproduct;
            $subproduct->setProduct($this);
        }

        return $this;
    }

    public function removeSubproduct(Subproduct $subproduct): self
    {
        if ($this->subproducts->contains($subproduct)) {
            $this->subproducts->removeElement($subproduct);
            // set the owning side to null (unless already changed)
            if ($subproduct->getProduct() === $this) {
                $subproduct->setProduct(null);
            }
        }

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): self
    {
        $this->category = $category;

        return $this;
    }

}
