/*
  Warnings:

  - You are about to drop the column `promotion_id` on the `orders` table. All the data in the column will be lost.
  - The values [banking] on the enum `payment_method` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `promotion_id`;

-- AlterTable
ALTER TABLE `payment` MODIFY `method` ENUM('cod', 'vnpay', 'momo', 'paypal') NOT NULL;
