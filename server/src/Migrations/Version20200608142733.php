<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200608142733 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE product (id INT AUTO_INCREMENT NOT NULL, sub_category_id INT NOT NULL, title VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, promo INT DEFAULT NULL, created_at DATETIME NOT NULL, clicks INT DEFAULT NULL, sex VARCHAR(255) DEFAULT NULL, status TINYINT(1) DEFAULT NULL, INDEX IDX_D34A04ADF7BFE87C (sub_category_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE card_credentials (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, card_numbers INT NOT NULL, expiration_date VARCHAR(255) NOT NULL, INDEX IDX_1DD17794A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE supplier (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE supplier_order (id INT AUTO_INCREMENT NOT NULL, supplier_id INT NOT NULL, our_address VARCHAR(255) NOT NULL, status TINYINT(1) DEFAULT NULL, price DOUBLE PRECISION NOT NULL, arrival_date DATE NOT NULL, created_at DATETIME NOT NULL, INDEX IDX_2C3291B22ADD6D8C (supplier_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE supplier_order_subproduct (supplier_order_id INT NOT NULL, subproduct_id INT NOT NULL, INDEX IDX_7CF3E7C21605B9 (supplier_order_id), INDEX IDX_7CF3E7C21A1581F9 (subproduct_id), PRIMARY KEY(supplier_order_id, subproduct_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, firstname VARCHAR(180) DEFAULT NULL, lastname VARCHAR(180) DEFAULT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE color (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE subproduct (id INT AUTO_INCREMENT NOT NULL, product_id INT NOT NULL, color_id INT NOT NULL, price DOUBLE PRECISION NOT NULL, size VARCHAR(255) NOT NULL, weight DOUBLE PRECISION NOT NULL, promo INT DEFAULT NULL, created_at DATETIME NOT NULL, stock INT DEFAULT NULL, INDEX IDX_9828AC624584665A (product_id), INDEX IDX_9828AC627ADA1FB5 (color_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE commande (id INT AUTO_INCREMENT NOT NULL, subproduct_id INT NOT NULL, address_id INT NOT NULL, status VARCHAR(255) NOT NULL, tracking_number INT NOT NULL, packaging TINYINT(1) DEFAULT NULL, created_at DATETIME NOT NULL, INDEX IDX_6EEAA67D1A1581F9 (subproduct_id), INDEX IDX_6EEAA67DF5B7AF75 (address_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE address (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, country VARCHAR(255) NOT NULL, city VARCHAR(255) NOT NULL, postcode VARCHAR(255) NOT NULL, address VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, INDEX IDX_D4E6F81A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE sub_category (id INT AUTO_INCREMENT NOT NULL, category_id INT NOT NULL, name VARCHAR(255) NOT NULL, INDEX IDX_BCE3F79812469DE2 (category_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04ADF7BFE87C FOREIGN KEY (sub_category_id) REFERENCES sub_category (id)');
        $this->addSql('ALTER TABLE card_credentials ADD CONSTRAINT FK_1DD17794A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE supplier_order ADD CONSTRAINT FK_2C3291B22ADD6D8C FOREIGN KEY (supplier_id) REFERENCES supplier (id)');
        $this->addSql('ALTER TABLE supplier_order_subproduct ADD CONSTRAINT FK_7CF3E7C21605B9 FOREIGN KEY (supplier_order_id) REFERENCES supplier_order (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE supplier_order_subproduct ADD CONSTRAINT FK_7CF3E7C21A1581F9 FOREIGN KEY (subproduct_id) REFERENCES subproduct (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE subproduct ADD CONSTRAINT FK_9828AC624584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE subproduct ADD CONSTRAINT FK_9828AC627ADA1FB5 FOREIGN KEY (color_id) REFERENCES color (id)');
        $this->addSql('ALTER TABLE commande ADD CONSTRAINT FK_6EEAA67D1A1581F9 FOREIGN KEY (subproduct_id) REFERENCES subproduct (id)');
        $this->addSql('ALTER TABLE commande ADD CONSTRAINT FK_6EEAA67DF5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id)');
        $this->addSql('ALTER TABLE address ADD CONSTRAINT FK_D4E6F81A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE sub_category ADD CONSTRAINT FK_BCE3F79812469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE subproduct DROP FOREIGN KEY FK_9828AC624584665A');
        $this->addSql('ALTER TABLE supplier_order DROP FOREIGN KEY FK_2C3291B22ADD6D8C');
        $this->addSql('ALTER TABLE supplier_order_subproduct DROP FOREIGN KEY FK_7CF3E7C21605B9');
        $this->addSql('ALTER TABLE card_credentials DROP FOREIGN KEY FK_1DD17794A76ED395');
        $this->addSql('ALTER TABLE address DROP FOREIGN KEY FK_D4E6F81A76ED395');
        $this->addSql('ALTER TABLE subproduct DROP FOREIGN KEY FK_9828AC627ADA1FB5');
        $this->addSql('ALTER TABLE sub_category DROP FOREIGN KEY FK_BCE3F79812469DE2');
        $this->addSql('ALTER TABLE supplier_order_subproduct DROP FOREIGN KEY FK_7CF3E7C21A1581F9');
        $this->addSql('ALTER TABLE commande DROP FOREIGN KEY FK_6EEAA67D1A1581F9');
        $this->addSql('ALTER TABLE commande DROP FOREIGN KEY FK_6EEAA67DF5B7AF75');
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04ADF7BFE87C');
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE card_credentials');
        $this->addSql('DROP TABLE supplier');
        $this->addSql('DROP TABLE supplier_order');
        $this->addSql('DROP TABLE supplier_order_subproduct');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE color');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE subproduct');
        $this->addSql('DROP TABLE commande');
        $this->addSql('DROP TABLE address');
        $this->addSql('DROP TABLE sub_category');
    }
}
