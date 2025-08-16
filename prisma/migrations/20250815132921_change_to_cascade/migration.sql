-- DropForeignKey
ALTER TABLE `transaction_validator` DROP FOREIGN KEY `transaction_validator_transaction_id_fkey`;

-- AddForeignKey
ALTER TABLE `transaction_validator` ADD CONSTRAINT `transaction_validator_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
