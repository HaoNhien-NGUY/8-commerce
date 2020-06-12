<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200612130532 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE user_order (id INT AUTO_INCREMENT NOT NULL, address_id INT NOT NULL, status VARCHAR(255) NOT NULL, tracking_number VARCHAR(255) NOT NULL, packaging TINYINT(1) NOT NULL, created_at DATETIME NOT NULL, INDEX IDX_17EB68C0F5B7AF75 (address_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user_order_subproduct (user_order_id INT NOT NULL, subproduct_id INT NOT NULL, INDEX IDX_56E713EA6D128938 (user_order_id), INDEX IDX_56E713EA1A1581F9 (subproduct_id), PRIMARY KEY(user_order_id, subproduct_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_order ADD CONSTRAINT FK_17EB68C0F5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id)');
        $this->addSql('ALTER TABLE user_order_subproduct ADD CONSTRAINT FK_56E713EA6D128938 FOREIGN KEY (user_order_id) REFERENCES user_order (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_order_subproduct ADD CONSTRAINT FK_56E713EA1A1581F9 FOREIGN KEY (subproduct_id) REFERENCES subproduct (id) ON DELETE CASCADE');
        $this->addSql('DROP TABLE commande');
        $this->addSql('ALTER TABLE product CHANGE promo promo INT DEFAULT NULL, CHANGE clicks clicks INT DEFAULT NULL, CHANGE sex sex VARCHAR(255) DEFAULT NULL, CHANGE status status TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE supplier_order CHANGE status status TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) DEFAULT NULL, CHANGE lastname lastname VARCHAR(180) DEFAULT NULL, CHANGE roles roles JSON NOT NULL');
        $this->addSql('ALTER TABLE subproduct CHANGE promo promo INT DEFAULT NULL, CHANGE stock stock INT DEFAULT NULL');
        $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_order_subproduct DROP FOREIGN KEY FK_56E713EA6D128938');
        $this->addSql('CREATE TABLE commande (id INT AUTO_INCREMENT NOT NULL, subproduct_id INT NOT NULL, address_id INT NOT NULL, status VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, tracking_number INT NOT NULL, packaging TINYINT(1) DEFAULT \'NULL\', created_at DATETIME NOT NULL, INDEX IDX_6EEAA67DF5B7AF75 (address_id), INDEX IDX_6EEAA67D1A1581F9 (subproduct_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE `utf8_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE commande ADD CONSTRAINT FK_6EEAA67D1A1581F9 FOREIGN KEY (subproduct_id) REFERENCES subproduct (id)');
        $this->addSql('ALTER TABLE commande ADD CONSTRAINT FK_6EEAA67DF5B7AF75 FOREIGN KEY (address_id) REFERENCES address (id)');
        $this->addSql('DROP TABLE user_order');
        $this->addSql('DROP TABLE user_order_subproduct');
        $this->addSql('ALTER TABLE product CHANGE promo promo INT DEFAULT NULL, CHANGE clicks clicks INT DEFAULT NULL, CHANGE sex sex VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE status status TINYINT(1) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE subproduct CHANGE promo promo INT DEFAULT NULL, CHANGE stock stock INT DEFAULT NULL');
        $this->addSql('ALTER TABLE supplier_order CHANGE status status TINYINT(1) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE lastname lastname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE roles roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
    }
}
