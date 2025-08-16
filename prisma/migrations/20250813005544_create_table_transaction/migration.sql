/*
  Warnings:

  - You are about to drop the `history_Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `history_Transaction`;

-- CreateTable
CREATE TABLE `transaction` (
    `id` VARCHAR(150) NOT NULL,
    `user_id` VARCHAR(150) NOT NULL,
    `garden_id` INTEGER NOT NULL,
    `garden_name` VARCHAR(100) NOT NULL,
    `customer_id` INTEGER NOT NULL,
    `customer_name` VARCHAR(100) NOT NULL,
    `vehicle_id` INTEGER NOT NULL,
    `vehicle_name` VARCHAR(100) NOT NULL,
    `vehicle_number` VARCHAR(20) NOT NULL,
    `wood_id` INTEGER NOT NULL,
    `wood_name` VARCHAR(100) NOT NULL,
    `wood_price` DECIMAL(18, 2) NOT NULL,
    `woodUnit` ENUM('KG', 'BATANG', 'KENDARAAN') NOT NULL,
    `wood_pieces_qty` INTEGER NOT NULL,
    `wood_units_qty` INTEGER NULL,
    `total_price` DECIMAL(18, 2) NULL,
    `status` ENUM('PENDING', 'DITERIMA', 'DITOLAK') NOT NULL DEFAULT 'PENDING',
    `type` ENUM('BELUM_DIBAYAR', 'LUNAS', 'UTANG') NULL,
    `nama_file` VARCHAR(150) NOT NULL,
    `path` VARCHAR(150) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_garden_id_fkey` FOREIGN KEY (`garden_id`) REFERENCES `garden`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_vehicle_id_fkey` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_wood_id_fkey` FOREIGN KEY (`wood_id`) REFERENCES `wood`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
