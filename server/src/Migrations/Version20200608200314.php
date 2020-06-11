<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200608200314 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE supplier (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE supplier_order (id INT AUTO_INCREMENT NOT NULL, supplier_id INT NOT NULL, our_address VARCHAR(255) NOT NULL, status TINYINT(1) DEFAULT NULL, price DOUBLE PRECISION NOT NULL, arrival_date DATE NOT NULL, created_at DATETIME NOT NULL, INDEX IDX_2C3291B22ADD6D8C (supplier_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE supplier_order_subproduct (id INT AUTO_INCREMENT NOT NULL, subproduct_id INT NOT NULL, supplier_order_id INT NOT NULL, stock INT NOT NULL, INDEX IDX_7CF3E7C21A1581F9 (subproduct_id), INDEX IDX_7CF3E7C21605B9 (supplier_order_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE supplier_order ADD CONSTRAINT FK_2C3291B22ADD6D8C FOREIGN KEY (supplier_id) REFERENCES supplier (id)');
        $this->addSql('ALTER TABLE supplier_order_subproduct ADD CONSTRAINT FK_7CF3E7C21A1581F9 FOREIGN KEY (subproduct_id) REFERENCES subproduct (id)');
        $this->addSql('ALTER TABLE supplier_order_subproduct ADD CONSTRAINT FK_7CF3E7C21605B9 FOREIGN KEY (supplier_order_id) REFERENCES supplier_order (id)');
        $this->addSql('ALTER TABLE product DROP price, CHANGE promo promo INT DEFAULT NULL, CHANGE clicks clicks INT DEFAULT NULL, CHANGE sex sex VARCHAR(255) DEFAULT NULL, CHANGE status status TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE subproduct CHANGE promo promo INT DEFAULT NULL, CHANGE stock stock INT DEFAULT NULL');
        $this->addSql('ALTER TABLE commande CHANGE packaging packaging TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) DEFAULT NULL, CHANGE lastname lastname VARCHAR(180) DEFAULT NULL, CHANGE roles roles JSON NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE supplier_order DROP FOREIGN KEY FK_2C3291B22ADD6D8C');
        $this->addSql('ALTER TABLE supplier_order_subproduct DROP FOREIGN KEY FK_7CF3E7C21605B9');
        $this->addSql('DROP TABLE supplier');
        $this->addSql('DROP TABLE supplier_order');
        $this->addSql('DROP TABLE supplier_order_subproduct');
        $this->addSql('ALTER TABLE commande CHANGE packaging packaging TINYINT(1) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE product ADD price DOUBLE PRECISION DEFAULT \'NULL\', CHANGE promo promo INT DEFAULT NULL, CHANGE clicks clicks INT DEFAULT NULL, CHANGE sex sex VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE status status TINYINT(1) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE subproduct CHANGE promo promo INT DEFAULT NULL, CHANGE stock stock INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE lastname lastname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE roles roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
    }
}
