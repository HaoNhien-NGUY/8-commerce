<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200615185204 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE address_billing CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE subproduct CHANGE promo promo INT DEFAULT NULL, CHANGE stock stock INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) DEFAULT NULL, CHANGE lastname lastname VARCHAR(180) DEFAULT NULL, CHANGE roles roles JSON NOT NULL');
        $this->addSql('ALTER TABLE user_order_subproduct DROP FOREIGN KEY FK_56E713EA1A1581F9');
        $this->addSql('ALTER TABLE user_order_subproduct DROP FOREIGN KEY FK_56E713EA6D128938');
        $this->addSql('ALTER TABLE user_order_subproduct ADD id INT AUTO_INCREMENT NOT NULL, ADD price DOUBLE PRECISION NOT NULL, ADD promo INT DEFAULT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('ALTER TABLE user_order_subproduct ADD CONSTRAINT FK_56E713EA1A1581F9 FOREIGN KEY (subproduct_id) REFERENCES subproduct (id)');
        $this->addSql('ALTER TABLE user_order_subproduct ADD CONSTRAINT FK_56E713EA6D128938 FOREIGN KEY (user_order_id) REFERENCES user_order (id)');
        $this->addSql('ALTER TABLE promo_code CHANGE date_end date_end DATETIME DEFAULT NULL, CHANGE used_limit used_limit INT DEFAULT NULL');
        $this->addSql('ALTER TABLE address_shipping CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE supplier_order CHANGE status status TINYINT(1) DEFAULT NULL');
        $this->addSql('ALTER TABLE user_order CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE product ADD promoted TINYINT(1) NOT NULL, CHANGE promo promo INT DEFAULT NULL, CHANGE clicks clicks INT DEFAULT NULL, CHANGE sex sex VARCHAR(255) DEFAULT NULL, CHANGE status status TINYINT(1) DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE address_billing CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE address_shipping CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE product DROP promoted, CHANGE promo promo INT DEFAULT NULL, CHANGE clicks clicks INT DEFAULT NULL, CHANGE sex sex VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE status status TINYINT(1) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE promo_code CHANGE date_end date_end DATETIME DEFAULT \'NULL\', CHANGE used_limit used_limit INT DEFAULT NULL');
        $this->addSql('ALTER TABLE sub_category CHANGE category_id category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE subproduct CHANGE promo promo INT DEFAULT NULL, CHANGE stock stock INT DEFAULT NULL');
        $this->addSql('ALTER TABLE supplier_order CHANGE status status TINYINT(1) DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE user CHANGE firstname firstname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE lastname lastname VARCHAR(180) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE roles roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE user_order CHANGE user_id user_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user_order_subproduct MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE user_order_subproduct DROP FOREIGN KEY FK_56E713EA6D128938');
        $this->addSql('ALTER TABLE user_order_subproduct DROP FOREIGN KEY FK_56E713EA1A1581F9');
        $this->addSql('ALTER TABLE user_order_subproduct DROP PRIMARY KEY');
        $this->addSql('ALTER TABLE user_order_subproduct DROP id, DROP price, DROP promo');
        $this->addSql('ALTER TABLE user_order_subproduct ADD CONSTRAINT FK_56E713EA6D128938 FOREIGN KEY (user_order_id) REFERENCES user_order (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_order_subproduct ADD CONSTRAINT FK_56E713EA1A1581F9 FOREIGN KEY (subproduct_id) REFERENCES subproduct (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_order_subproduct ADD PRIMARY KEY (user_order_id, subproduct_id)');
    }
}
