<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200618182326 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE packaging (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, starts_at DATETIME NOT NULL, ends_at DATETIME NOT NULL, min_spending INT DEFAULT NULL, price DOUBLE PRECISION DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE restricted_region (id INT AUTO_INCREMENT NOT NULL, region_id INT NOT NULL, method VARCHAR(255) DEFAULT NULL, UNIQUE INDEX UNIQ_AE329ABF98260155 (region_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE restricted_region ADD CONSTRAINT FK_AE329ABF98260155 FOREIGN KEY (region_id) REFERENCES region (id)');
        $this->addSql('ALTER TABLE address_billing CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE address_shipping CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE card_credentials CHANGE ccv ccv INT DEFAULT NULL');
        $this->addSql('ALTER TABLE product CHANGE promo promo INT DEFAULT NULL, CHANGE clicks clicks INT DEFAULT NULL, CHANGE sex sex VARCHAR(255) DEFAULT NULL, CHANGE status status TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE promo_code CHANGE date_end date_end DATETIME DEFAULT NULL, CHANGE used_limit used_limit INT DEFAULT NULL');
        $this->addSql('ALTER TABLE review CHANGE review_id review_id INT DEFAULT NULL, CHANGE rating rating INT DEFAULT NULL');
        $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE subproduct CHANGE promo promo INT DEFAULT NULL, CHANGE stock stock INT DEFAULT NULL');
        $this->addSql('ALTER TABLE supplier_order CHANGE status status TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) DEFAULT NULL, CHANGE lastname lastname VARCHAR(180) DEFAULT NULL, CHANGE roles roles JSON NOT NULL');
        $this->addSql('ALTER TABLE user_order ADD packaging_id INT DEFAULT NULL, DROP packaging, CHANGE user_id user_id INT DEFAULT NULL, CHANGE promo_code_id promo_code_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user_order ADD CONSTRAINT FK_17EB68C04E7B3801 FOREIGN KEY (packaging_id) REFERENCES packaging (id)');
        $this->addSql('CREATE INDEX IDX_17EB68C04E7B3801 ON user_order (packaging_id)');
        $this->addSql('ALTER TABLE user_order_subproduct CHANGE promo promo INT DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE user_order DROP FOREIGN KEY FK_17EB68C04E7B3801');
        $this->addSql('DROP TABLE packaging');
        $this->addSql('DROP TABLE restricted_region');
        $this->addSql('ALTER TABLE address_billing CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE address_shipping CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE card_credentials CHANGE ccv ccv INT DEFAULT NULL');
        $this->addSql('ALTER TABLE product CHANGE promo promo INT DEFAULT NULL, CHANGE clicks clicks INT DEFAULT NULL, CHANGE sex sex VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE status status TINYINT(1) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE promo_code CHANGE date_end date_end DATETIME DEFAULT \'NULL\', CHANGE used_limit used_limit INT DEFAULT NULL');
        $this->addSql('ALTER TABLE review CHANGE review_id review_id INT DEFAULT NULL, CHANGE rating rating INT DEFAULT NULL');
        $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE subproduct CHANGE promo promo INT DEFAULT NULL, CHANGE stock stock INT DEFAULT NULL');
        $this->addSql('ALTER TABLE supplier_order CHANGE status status TINYINT(1) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE lastname lastname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE roles roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('DROP INDEX IDX_17EB68C04E7B3801 ON user_order');
        $this->addSql('ALTER TABLE user_order ADD packaging TINYINT(1) NOT NULL, DROP packaging_id, CHANGE user_id user_id INT DEFAULT NULL, CHANGE promo_code_id promo_code_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user_order_subproduct CHANGE promo promo INT DEFAULT NULL');
    }
}