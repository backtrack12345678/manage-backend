/*
  Warnings:

  - Added the required column `oldName` to the `wood_price_log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oldUnit` to the `wood_price_log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `wood_price_log` ADD COLUMN `oldName` VARCHAR(100) NOT NULL,
    ADD COLUMN `oldUnit` ENUM('KG', 'BATANG', 'KENDARAAN') NOT NULL;
