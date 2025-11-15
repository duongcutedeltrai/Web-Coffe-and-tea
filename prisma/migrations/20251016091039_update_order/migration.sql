/*
  Warnings:

  - The values [paid] on the enum `order_status_history_status` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `total_amount` on the `orders` table. All the data in the column will be lost.
  - The values [paid] on the enum `orders_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to alter the column `discount_percent` on the `promotions` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(5,2)`.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `final_amount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `original_amount` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `order_details` DROP FOREIGN KEY `order_details_ibfk_1`;

-- DropForeignKey
ALTER TABLE `order_status_history` DROP FOREIGN KEY `order_status_history_ibfk_1`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `payment_ibfk_1`;

-- AlterTable
ALTER TABLE `order_details` ADD COLUMN `size` VARCHAR(20) NULL,
    MODIFY `order_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `order_status_history` MODIFY `order_id` VARCHAR(50) NOT NULL,
    MODIFY `status` ENUM('pending', 'ready', 'shipped', 'completed', 'canceled') NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP PRIMARY KEY,
    DROP COLUMN `total_amount`,
    ADD COLUMN `discount_amount` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `final_amount` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `original_amount` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `promotion_id` INTEGER NULL,
    MODIFY `order_id` VARCHAR(50) NOT NULL,
    MODIFY `user_id` INTEGER NULL,
    MODIFY `status` ENUM('pending', 'ready', 'shipped', 'completed', 'canceled') NOT NULL DEFAULT 'pending',
    MODIFY `order_type` ENUM('DINE_IN', 'TAKE_AWAY', 'DELIVERY') NOT NULL DEFAULT 'DINE_IN',
    ADD PRIMARY KEY (`order_id`);

-- AlterTable
ALTER TABLE `payment` MODIFY `order_id` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `promotions` ADD COLUMN `applicable_membership` ENUM('BRONZE', 'SILVER', 'GOLD', 'DIAMOND') NULL,
    ADD COLUMN `current_usage` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `is_for_new_user` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `max_usage_count` INTEGER NULL,
    ADD COLUMN `min_order_amount` DECIMAL(10, 2) NULL,
    MODIFY `discount_percent` DECIMAL(5, 2) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `phone` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `promotion_usage` (
    `usage_id` INTEGER NOT NULL AUTO_INCREMENT,
    `promotion_id` INTEGER NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NULL,
    `user_phone` VARCHAR(20) NULL,
    `used_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `promotion_usage_promotion_id_idx`(`promotion_id`),
    INDEX `promotion_usage_order_id_idx`(`order_id`),
    INDEX `promotion_usage_user_id_idx`(`user_id`),
    UNIQUE INDEX `promotion_usage_promotion_id_user_id_key`(`promotion_id`, `user_id`),
    PRIMARY KEY (`usage_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `phone` ON `users`(`phone`);

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_status_history` ADD CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `promotion_usage` ADD CONSTRAINT `promotion_usage_promotion_id_fkey` FOREIGN KEY (`promotion_id`) REFERENCES `promotions`(`promotion_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotion_usage` ADD CONSTRAINT `promotion_usage_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `promotion_usage` ADD CONSTRAINT `promotion_usage_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE CASCADE;
