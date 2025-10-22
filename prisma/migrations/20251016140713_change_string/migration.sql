/*
  Warnings:

  - The primary key for the `promotion_products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `promotions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `promotion_products` DROP FOREIGN KEY `promotion_products_ibfk_1`;

-- DropForeignKey
ALTER TABLE `promotion_usage` DROP FOREIGN KEY `promotion_usage_promotion_id_fkey`;

-- AlterTable
ALTER TABLE `promotion_products` DROP PRIMARY KEY,
    MODIFY `promotion_product_id` VARCHAR(191) NOT NULL,
    MODIFY `promotion_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`promotion_product_id`);

-- AlterTable
ALTER TABLE `promotion_usage` MODIFY `promotion_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `promotions` DROP PRIMARY KEY,
    MODIFY `promotion_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`promotion_id`);

-- AddForeignKey
ALTER TABLE `promotion_products` ADD CONSTRAINT `promotion_products_ibfk_1` FOREIGN KEY (`promotion_id`) REFERENCES `promotions`(`promotion_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `promotion_usage` ADD CONSTRAINT `promotion_usage_promotion_id_fkey` FOREIGN KEY (`promotion_id`) REFERENCES `promotions`(`promotion_id`) ON DELETE NO ACTION ON UPDATE CASCADE;
