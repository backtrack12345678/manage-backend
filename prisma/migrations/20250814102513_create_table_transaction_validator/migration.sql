-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `paid_amount` DECIMAL(18, 2) NULL;

-- CreateTable
CREATE TABLE `transaction_validator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_id` VARCHAR(150) NOT NULL,
    `user_id` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `transaction_validator_transaction_id_key`(`transaction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transaction_validator` ADD CONSTRAINT `transaction_validator_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transaction`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_validator` ADD CONSTRAINT `transaction_validator_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
