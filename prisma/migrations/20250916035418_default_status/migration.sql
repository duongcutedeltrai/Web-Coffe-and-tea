/*
  Warnings:

  - Made the column `status` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `status` ENUM('ACTIVE', 'LOCKED') NOT NULL DEFAULT 'ACTIVE';
