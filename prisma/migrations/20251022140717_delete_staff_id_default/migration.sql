/*
  Warnings:

  - You are about to drop the column `staff_id` on the `orders` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_staff_id_fkey`;

-- DropIndex
DROP INDEX `staff_id` ON `orders`;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `staff_id`;
