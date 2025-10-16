-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_staff_id_fkey`;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_staff_id_fkey` FOREIGN KEY (`staff_id`) REFERENCES `staff_detail`(`staff_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
