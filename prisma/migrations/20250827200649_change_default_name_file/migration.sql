/*
  Warnings:

  - You are about to drop the column `wood_pieces_cost_price` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `wood_pieces_cost_price`,
    ADD COLUMN `total_cost` DECIMAL(18, 2) NULL,
    MODIFY `nama_file` VARCHAR(150) NOT NULL DEFAULT 'default_transaction.jpg';
