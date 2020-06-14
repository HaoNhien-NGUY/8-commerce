<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200614131223 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE promo_code (id INT AUTO_INCREMENT NOT NULL, code VARCHAR(255) NOT NULL, percentage INT NOT NULL, date_end DATETIME DEFAULT NULL, used_times INT NOT NULL, used_limit INT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user_order ADD user_id INT DEFAULT NULL, ADD cost DOUBLE PRECISION NOT NULL, CHANGE status status TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE user_order ADD CONSTRAINT FK_17EB68C0A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_17EB68C0A76ED395 ON user_order (user_id)');
        $this->addSql('ALTER TABLE address_shipping CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE supplier_order CHANGE status status TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE address_billing CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE product CHANGE promo promo INT DEFAULT NULL, CHANGE clicks clicks INT DEFAULT NULL, CHANGE sex sex VARCHAR(255) DEFAULT NULL, CHANGE status status TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE subproduct DROP FOREIGN KEY FK_9828AC624584665A');
        $this->addSql('ALTER TABLE subproduct CHANGE promo promo INT DEFAULT NULL, CHANGE stock stock INT DEFAULT NULL');
        $this->addSql('ALTER TABLE subproduct ADD CONSTRAINT FK_9828AC624584665A FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) DEFAULT NULL, CHANGE lastname lastname VARCHAR(180) DEFAULT NULL, CHANGE roles roles JSON NOT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('DROP TABLE promo_code');
        $this->addSql('ALTER TABLE address_billing CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE address_shipping CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE product CHANGE promo promo INT DEFAULT NULL, CHANGE clicks clicks INT DEFAULT NULL, CHANGE sex sex VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE status status TINYINT(1) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE subproduct DROP FOREIGN KEY FK_9828AC624584665A');
        $this->addSql('ALTER TABLE subproduct CHANGE promo promo INT DEFAULT NULL, CHANGE stock stock INT DEFAULT NULL');
        $this->addSql('ALTER TABLE subproduct ADD CONSTRAINT FK_9828AC624584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE supplier_order CHANGE status status TINYINT(1) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE lastname lastname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE roles roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE user_order DROP FOREIGN KEY FK_17EB68C0A76ED395');
        $this->addSql('DROP INDEX IDX_17EB68C0A76ED395 ON user_order');
        $this->addSql('ALTER TABLE user_order DROP user_id, DROP cost, CHANGE status status VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`');
    }
}
