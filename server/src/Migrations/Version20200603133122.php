<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200603133122 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE subproduct (id INT AUTO_INCREMENT NOT NULL, product_id INT NOT NULL, price DOUBLE PRECISION NOT NULL, color VARCHAR(255) NOT NULL, size VARCHAR(255) NOT NULL, weight DOUBLE PRECISION NOT NULL, promo INT DEFAULT NULL, created_at DATETIME NOT NULL, stock INT DEFAULT NULL, INDEX IDX_9828AC624584665A (product_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE image (id INT AUTO_INCREMENT NOT NULL, subproduct_id INT NOT NULL, image VARCHAR(255) DEFAULT NULL, INDEX IDX_C53D045F1A1581F9 (subproduct_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE subproduct ADD CONSTRAINT FK_9828AC624584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F1A1581F9 FOREIGN KEY (subproduct_id) REFERENCES subproduct (id)');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE card_credentials ADD CONSTRAINT FK_1DD17794A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) NOT NULL, CHANGE lastname lastname VARCHAR(180) NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04AD12469DE2');
        $this->addSql('ALTER TABLE image DROP FOREIGN KEY FK_C53D045F1A1581F9');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE subproduct');
        $this->addSql('DROP TABLE image');
        $this->addSql('ALTER TABLE card_credentials DROP FOREIGN KEY FK_1DD17794A76ED395');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, CHANGE lastname lastname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`');
    }
}
