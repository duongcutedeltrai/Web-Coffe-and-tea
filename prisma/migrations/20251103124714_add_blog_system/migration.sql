-- CreateTable
CREATE TABLE `blogs` (
    `blog_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `description` VARCHAR(500) NOT NULL,
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

-- CreateTable
CREATE TABLE `blog_categories` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blog_categories_slug_key`(`slug`),
    INDEX `blog_categories_slug_idx`(`slug`),
    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blog_tags` (
    `tag_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(50) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `blog_tags_slug_key`(`slug`),
    INDEX `blog_tags_slug_idx`(`slug`),
    PRIMARY KEY (`tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_blog_categoriesToblogs` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_blog_categoriesToblogs_AB_unique`(`A`, `B`),
    INDEX `_blog_categoriesToblogs_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_blog_tagsToblogs` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_blog_tagsToblogs_AB_unique`(`A`, `B`),
    INDEX `_blog_tagsToblogs_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_blog_categoriesToblogs` ADD CONSTRAINT `_blog_categoriesToblogs_A_fkey` FOREIGN KEY (`A`) REFERENCES `blog_categories`(`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_blog_categoriesToblogs` ADD CONSTRAINT `_blog_categoriesToblogs_B_fkey` FOREIGN KEY (`B`) REFERENCES `blogs`(`blog_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_blog_tagsToblogs` ADD CONSTRAINT `_blog_tagsToblogs_A_fkey` FOREIGN KEY (`A`) REFERENCES `blog_tags`(`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_blog_tagsToblogs` ADD CONSTRAINT `_blog_tagsToblogs_B_fkey` FOREIGN KEY (`B`) REFERENCES `blogs`(`blog_id`) ON DELETE CASCADE ON UPDATE CASCADE;
