-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_ibfk_1`;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;
