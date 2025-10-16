/*
  Warnings:

  - A unique constraint covering the columns `[staff_id,day_of_week]` on the table `staff_schedules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `staff_schedules_staff_id_day_of_week_key` ON `staff_schedules`(`staff_id`, `day_of_week`);
