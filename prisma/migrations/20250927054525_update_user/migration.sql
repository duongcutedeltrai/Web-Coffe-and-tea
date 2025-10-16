/*
  Warnings:

  - Added the required column `staff_id` to the `order_status_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staff_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order_status_history` ADD COLUMN `staff_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `orders` ADD COLUMN `staff_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `staff_id` ON `orders`(`staff_id`);

-- AddForeignKey
ALTER TABLE `order_status_history` ADD CONSTRAINT `order_status_history_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staff_detail`(`staff_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
