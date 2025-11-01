/*
  Warnings:

  - Added the required column `product_size` to the `cart_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cart_details` ADD COLUMN `product_size` ENUM('M', 'L', 'XL', 'DEFAULT') NOT NULL;
