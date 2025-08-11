/*
  Warnings:

  - You are about to drop the column `price_unit` on the `wood` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `wood` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(18,2)`.
  - Added the required column `unit` to the `wood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `wood` DROP COLUMN `price_unit`,
    ADD COLUMN `unit` ENUM('KG', 'BATANG', 'KENDARAAN') NOT NULL,
    MODIFY `price` DECIMAL(18, 2) NOT NULL;
