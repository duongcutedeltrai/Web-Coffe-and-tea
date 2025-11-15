-- DropForeignKey
ALTER TABLE `order_status_history` DROP FOREIGN KEY `order_status_history_staff_id_fkey`;

-- DropIndex
DROP INDEX `order_status_history_staff_id_fkey` ON `order_status_history`;
