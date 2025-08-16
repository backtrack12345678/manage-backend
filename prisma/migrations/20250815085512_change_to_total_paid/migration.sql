/*
  Warnings:

  - You are about to drop the column `paid_amount` on the `transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `paid_amount`,
    ADD COLUMN `total_paid` DECIMAL(18, 2) NULL;
