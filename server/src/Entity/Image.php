<?php

namespace App\Entity;

use App\Repository\ImageRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ImageRepository::class)
 */
class Image
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $image;

    /**
     * @ORM\ManyToOne(targetEntity=Subproduct::class, inversedBy="images")
     * @ORM\JoinColumn(nullable=false)
     */
    private $subproduct;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): self
    {
        $this->image = $image;

        return $this;
    }

    public function getSubproduct(): ?Subproduct
    {
        return $this->subproduct;
    }

    public function setSubproduct(?Subproduct $subproduct): self
    {
        $this->subproduct = $subproduct;

        return $this;
    }
}
