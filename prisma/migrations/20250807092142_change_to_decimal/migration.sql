/*
  Warnings:

  - You are about to alter the column `old_price` on the `wood_price_log` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(18,2)`.
  - You are about to alter the column `new_price` on the `wood_price_log` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(18,2)`.

*/
-- AlterTable
ALTER TABLE `wood_price_log` MODIFY `old_price` DECIMAL(18, 2) NOT NULL,
    MODIFY `new_price` DECIMAL(18, 2) NOT NULL;
