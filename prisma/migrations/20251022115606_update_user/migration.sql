/*
  Warnings:

  - You are about to drop the column `shift` on the `staff_detail` table. All the data in the column will be lost.
  - Added the required column `staff_id` to the `order_status_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_status_history` ADD COLUMN `staff_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `staff_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `staff_detail` DROP COLUMN `shift`;

-- CreateTable
CREATE TABLE `work_shifts` (
    `shift_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `work_shifts_name_key`(`name`),
    PRIMARY KEY (`shift_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staff_schedules` (
    `staff_schedule_id` INTEGER NOT NULL AUTO_INCREMENT,
    `staff_id` INTEGER NOT NULL,
    `day_of_week` INTEGER NOT NULL,
    `shift_id` INTEGER NULL,
    `status` ENUM('WORK', 'OFF') NOT NULL DEFAULT 'WORK',

    INDEX `staff_schedules_staff_id_idx`(`staff_id`),
    INDEX `staff_schedules_shift_id_idx`(`shift_id`),
    UNIQUE INDEX `staff_schedules_staff_id_day_of_week_key`(`staff_id`, `day_of_week`),
    PRIMARY KEY (`staff_schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `staff_id` ON `orders`(`staff_id`);

-- CreateIndex
CREATE FULLTEXT INDEX `users_username_email_idx` ON `users`(`username`, `email`);

-- AddForeignKey
ALTER TABLE `order_status_history` ADD CONSTRAINT `order_status_history_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staff_detail`(`staff_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `staff_schedules` ADD CONSTRAINT `staff_schedules_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staff_detail`(`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `staff_schedules` ADD CONSTRAINT `staff_schedules_shift_id_fkey` FOREIGN KEY (`shift_id`) REFERENCES `work_shifts`(`shift_id`) ON DELETE SET NULL ON UPDATE CASCADE;
