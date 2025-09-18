/*
  Warnings:

  - The values [NONE] on the enum `price_product_size` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `price_product` MODIFY `size` ENUM('M', 'L', 'XL', 'DEFAULT') NULL;
