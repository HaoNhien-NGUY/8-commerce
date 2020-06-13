<?php

namespace App\Entity;

use App\Repository\UserOrderRepository;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Mapping\ClassMetadata;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=UserOrderRepository::class)
 */
class UserOrder
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"user_address", "user_orders"})
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="userOrders")
     * @ORM\JoinColumn(nullable=true)
     */
    private $user;

    /**
     * @ORM\ManyToMany(targetEntity=Subproduct::class, inversedBy="userOrders")
     */
    private $subproduct;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"user_address", "user_orders"})
     */
    private $status;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user_address", "user_orders"})
     */
    private $trackingNumber;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"user_address", "user_orders"})
     */
    private $packaging;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"user_address", "user_orders"})
     */
    private $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity=AddressShipping::class, inversedBy="userOrders")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user_address"})
     */
    private $addressShipping;

    /**
     * @ORM\ManyToOne(targetEntity=AddressBilling::class, inversedBy="userOrders")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"user_address"})
     */
    private $addressBilling;

    /**
     * @ORM\Column(type="float")
     * @Groups({"user_orders"})
     */
    private $cost;


    public function __construct()
    {
        $this->subproduct = new ArrayCollection();
    }

    public static function loadValidatorMetadata(ClassMetadata $metadata)
    {
        $metadata->addPropertyConstraint('status', new Assert\NotBlank());
        $metadata->addPropertyConstraint('trackingNumber', new Assert\NotBlank());
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getTrackingNumber(): ?string
    {
        return $this->trackingNumber;
    }

    public function setTrackingNumber(string $trackingNumber): self
    {
        $this->trackingNumber = $trackingNumber;

        return $this;
    }

    public function getPackaging(): ?bool
    {
        return $this->packaging;
    }

    public function setPackaging(bool $packaging): self
    {
        $this->packaging = $packaging;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Collection|Subproduct[]
     */
    public function getSubproduct(): Collection
    {
        return $this->subproduct;
    }

    public function addSubproduct(Subproduct $subproduct): self
    {
        if (!$this->subproduct->contains($subproduct)) {
            $this->subproduct[] = $subproduct;
        }

        return $this;
    }

    public function removeSubproduct(Subproduct $subproduct): self
    {
        if ($this->subproduct->contains($subproduct)) {
            $this->subproduct->removeElement($subproduct);
        }

        return $this;
    }

    public function getAddressShipping(): ?AddressShipping
    {
        return $this->addressShipping;
    }

    public function setAddressShipping(?AddressShipping $addressShipping): self
    {
        $this->addressShipping = $addressShipping;

        return $this;
    }

    public function getAddressBilling(): ?AddressBilling
    {
        return $this->addressBilling;
    }

    public function setAddressBilling(?AddressBilling $addressBilling): self
    {
        $this->addressBilling = $addressBilling;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getCost(): ?float
    {
        return $this->cost;
    }

    public function setCost(float $cost): self
    {
        $this->cost = $cost;

        return $this;
    }
}
