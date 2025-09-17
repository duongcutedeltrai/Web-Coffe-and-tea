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
ALTER TABLE `staff_detail` ADD CONSTRAINT `staff_detail_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
