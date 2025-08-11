/*
  Warnings:

  - The values [SVP] on the enum `user_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('ADMIN', 'SPV', 'MANDOR') NOT NULL DEFAULT 'ADMIN';
