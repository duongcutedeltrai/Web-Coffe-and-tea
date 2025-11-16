/*
  Warnings:

  - A unique constraint covering the columns `[promotion_id,user_id,product_id]` on the table `promotion_usage` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `promotion_usage` DROP FOREIGN KEY `promotion_usage_promotion_id_fkey`;

-- DropIndex
DROP INDEX `promotion_usage_promotion_id_user_id_key` ON `promotion_usage`;

-- AlterTable
ALTER TABLE `promotion_usage` ADD COLUMN `product_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `promotion_usage_promotion_id_user_id_product_id_key` ON `promotion_usage`(`promotion_id`, `user_id`, `product_id`);

-- AddForeignKey
ALTER TABLE `promotion_usage` ADD CONSTRAINT `promotion_usage_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE NO ACTION ON UPDATE CASCADE;


