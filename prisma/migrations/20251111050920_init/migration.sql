-- AlterTable
ALTER TABLE `orders` MODIFY `promotion_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `blogs` (
    `blog_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `description` VARCHAR(500) NULL,
    `content` TEXT NOT NULL,
    `thumbnail` VARCHAR(255) NULL,
    `type` ENUM('NEWS', 'PROMOTION', 'PRODUCT', 'EVENT', 'GUIDE') NOT NULL DEFAULT 'NEWS',
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `published_at` DATETIME(3) NULL,
    `author_id` INTEGER NOT NULL,
    `meta_title` VARCHAR(255) NULL,
    `meta_description` VARCHAR(500) NULL,
    `view_count` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `blogs_slug_key`(`slug`),
    INDEX `blogs_author_id_idx`(`author_id`),
    INDEX `blogs_type_idx`(`type`),
    INDEX `blogs_status_idx`(`status`),
    INDEX `blogs_slug_idx`(`slug`),
    PRIMARY KEY (`blog_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
