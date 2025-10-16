/*
  Warnings:

  - You are about to drop the column `shift` on the `staff_detail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `staff_detail` DROP COLUMN `shift`;

-- CreateTable
CREATE TABLE `work_shifts` (
    `shift_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,

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
    PRIMARY KEY (`staff_schedule_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `staff_schedules` ADD CONSTRAINT `staff_schedules_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staff_detail`(`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `staff_schedules` ADD CONSTRAINT `staff_schedules_shift_id_fkey` FOREIGN KEY (`shift_id`) REFERENCES `work_shifts`(`shift_id`) ON DELETE SET NULL ON UPDATE CASCADE;
