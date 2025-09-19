-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_ibfk_1`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `feedback_ibfk_1`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_ibfk_1`;

-- AlterTable
ALTER TABLE `products` MODIFY `images` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `birthday` DATETIME(3) NULL,
    ADD COLUMN `discount_rate` INTEGER NULL DEFAULT 0,
    ADD COLUMN `gender` VARCHAR(45) NULL,
    ADD COLUMN `membership` ENUM('BRONZE', 'SILVER', 'GOLD', 'DIAMOND') NULL,
    ADD COLUMN `status` ENUM('ACTIVE', 'LOCKED') NOT NULL DEFAULT 'ACTIVE',
    MODIFY `address` VARCHAR(255) NULL,
    MODIFY `avatar` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `point_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `change` INTEGER NOT NULL,
    `reason` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `point_history_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staff_detail` (
    `staff_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `position` VARCHAR(100) NOT NULL,
    `hire_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `salary` INTEGER NULL,
    `shift` VARCHAR(50) NULL,

    UNIQUE INDEX `staff_detail_user_id_key`(`user_id`),
    INDEX `staff_detail_user_id_idx`(`user_id`),
    PRIMARY KEY (`staff_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `point_history` ADD CONSTRAINT `point_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `staff_detail` ADD CONSTRAINT `staff_detail_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
