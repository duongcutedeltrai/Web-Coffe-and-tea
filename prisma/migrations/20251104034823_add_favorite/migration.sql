/*
  Warnings:

  - The primary key for the `promotion_products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `promotions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `applicable_membership` on the `promotions` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(8))` to `Json`.

*/
-- DropForeignKey
ALTER TABLE `promotion_products` DROP FOREIGN KEY `promotion_products_ibfk_1`;

-- DropForeignKey
ALTER TABLE `promotion_usage` DROP FOREIGN KEY `promotion_usage_promotion_id_fkey`;

-- AlterTable
ALTER TABLE `promotion_products` DROP PRIMARY KEY,
    ADD COLUMN `size` VARCHAR(10) NULL,
    MODIFY `promotion_product_id` VARCHAR(191) NOT NULL,
    MODIFY `promotion_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`promotion_product_id`);

-- AlterTable
ALTER TABLE `promotion_usage` MODIFY `promotion_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `promotions` DROP PRIMARY KEY,
    MODIFY `promotion_id` VARCHAR(191) NOT NULL,
    MODIFY `applicable_membership` JSON NULL,
    ADD PRIMARY KEY (`promotion_id`);

-- CreateTable
CREATE TABLE `favorite` (
    `favorite_id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `favorite_userId_productId_key`(`userId`, `productId`),
    PRIMARY KEY (`favorite_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `promotion_products` ADD CONSTRAINT `promotion_products_ibfk_1` FOREIGN KEY (`promotion_id`) REFERENCES `promotions`(`promotion_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `promotion_usage` ADD CONSTRAINT `promotion_usage_promotion_id_fkey` FOREIGN KEY (`promotion_id`) REFERENCES `promotions`(`promotion_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
