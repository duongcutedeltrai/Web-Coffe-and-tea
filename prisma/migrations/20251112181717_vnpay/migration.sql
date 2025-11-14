-- AlterTable
ALTER TABLE `promotions` ADD COLUMN `discount_price` INTEGER NULL DEFAULT 0,
    ADD COLUMN `type` ENUM('voucher', 'flashsale') NOT NULL DEFAULT 'voucher',
    MODIFY `code` VARCHAR(50) NULL,
    MODIFY `discount_percent` DECIMAL(5, 2) NULL,
    MODIFY `start_date` DATETIME(0) NOT NULL,
    MODIFY `end_date` DATETIME(0) NOT NULL;

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
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `favorite` ADD CONSTRAINT `favorite_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
