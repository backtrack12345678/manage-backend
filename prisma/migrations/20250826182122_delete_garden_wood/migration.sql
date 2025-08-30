/*
  Warnings:

  - You are about to drop the `garden_wood` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `garden_wood` DROP FOREIGN KEY `garden_wood_gardenId_fkey`;

-- DropForeignKey
ALTER TABLE `garden_wood` DROP FOREIGN KEY `garden_wood_woodId_fkey`;

-- AlterTable
ALTER TABLE `garden` ADD COLUMN `wood_pieces_qty_actual` INTEGER NULL,
    ADD COLUMN `wood_pieces_qty_target` INTEGER NULL;

-- DropTable
DROP TABLE `garden_wood`;
