-- AlterTable
ALTER TABLE `promotions` ADD COLUMN `discount_price` INTEGER NULL DEFAULT 0,
    ADD COLUMN `type` ENUM('voucher', 'flashsale') NOT NULL DEFAULT 'voucher',
    MODIFY `code` VARCHAR(50) NULL,
    MODIFY `discount_percent` DECIMAL(5, 2) NULL,
    MODIFY `start_date` DATETIME(0) NOT NULL,
    MODIFY `end_date` DATETIME(0) NOT NULL;
