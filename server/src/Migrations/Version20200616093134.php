<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200616093134 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE product ADD promoted TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE user_order_subproduct DROP FOREIGN KEY FK_56E713EA1A1581F9');
        $this->addSql('ALTER TABLE user_order_subproduct DROP FOREIGN KEY FK_56E713EA6D128938');
        $this->addSql('ALTER TABLE user_order_subproduct ADD id INT AUTO_INCREMENT NOT NULL, ADD price DOUBLE PRECISION NOT NULL, ADD promo INT DEFAULT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('ALTER TABLE user_order_subproduct ADD CONSTRAINT FK_56E713EA1A1581F9 FOREIGN KEY (subproduct_id) REFERENCES subproduct (id)');
        $this->addSql('ALTER TABLE user_order_subproduct ADD CONSTRAINT FK_56E713EA6D128938 FOREIGN KEY (user_order_id) REFERENCES user_order (id)');
        $this->addSql('ALTER TABLE card_credentials ADD ccv INT DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE card_credentials DROP ccv');
        $this->addSql('ALTER TABLE product DROP promoted');
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
