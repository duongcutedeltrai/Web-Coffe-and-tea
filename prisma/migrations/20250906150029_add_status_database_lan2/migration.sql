/*
  Warnings:

  - Made the column `user_id` on table `cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total` on table `cart` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cart_id` on table `cart_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `cart_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `feedback` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `feedback` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `feedback` required. This step will fail if there are existing NULL values in that column.
  - Made the column `rating` on table `feedback` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `inventory` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order_id` on table `order_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `order_details` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order_id` on table `order_status_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `order_status_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `changed_at` on table `order_status_history` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `orderDate` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `delivery_address` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receiver_name` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receiver_phone` on table `orders` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order_id` on table `payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `method` on table `payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `transaction_date` on table `payment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sold` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category_id` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `promotion_id` on table `promotion_products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `promotion_products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `discount_percent` on table `promotions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_date` on table `promotions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_date` on table `promotions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `roles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_ibfk_1`;

-- DropForeignKey
ALTER TABLE `cart_details` DROP FOREIGN KEY `cart_details_ibfk_1`;

-- DropForeignKey
ALTER TABLE `cart_details` DROP FOREIGN KEY `cart_details_ibfk_2`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `feedback_ibfk_1`;

-- DropForeignKey
ALTER TABLE `feedback` DROP FOREIGN KEY `feedback_ibfk_2`;

-- DropForeignKey
ALTER TABLE `order_details` DROP FOREIGN KEY `order_details_ibfk_1`;

-- DropForeignKey
ALTER TABLE `order_details` DROP FOREIGN KEY `order_details_ibfk_2`;

-- DropForeignKey
ALTER TABLE `order_status_history` DROP FOREIGN KEY `order_status_history_ibfk_1`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_ibfk_1`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `payment_ibfk_1`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_ibfk_1`;

-- DropForeignKey
ALTER TABLE `promotion_products` DROP FOREIGN KEY `promotion_products_ibfk_1`;

-- DropForeignKey
ALTER TABLE `promotion_products` DROP FOREIGN KEY `promotion_products_ibfk_2`;

-- AlterTable
ALTER TABLE `cart` MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `total` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `cart_details` MODIFY `cart_id` INTEGER NOT NULL,
    MODIFY `product_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `feedback` MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `product_id` INTEGER NOT NULL,
    MODIFY `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `rating` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `inventory` MODIFY `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `order_details` MODIFY `order_id` INTEGER NOT NULL,
    MODIFY `product_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `order_status_history` MODIFY `order_id` INTEGER NOT NULL,
    MODIFY `status` ENUM('pending', 'paid', 'shipped', 'completed', 'canceled') NOT NULL,
    MODIFY `changed_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `orders` MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `orderDate` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    MODIFY `status` ENUM('pending', 'paid', 'shipped', 'completed', 'canceled') NOT NULL DEFAULT 'pending',
    MODIFY `delivery_address` VARCHAR(255) NOT NULL,
    MODIFY `receiver_name` VARCHAR(100) NOT NULL,
    MODIFY `receiver_phone` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `payment` MODIFY `order_id` INTEGER NOT NULL,
    MODIFY `method` ENUM('cod', 'banking', 'momo', 'paypal') NOT NULL,
    MODIFY `status` ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending',
    MODIFY `transaction_date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `products` MODIFY `sold` INTEGER NOT NULL,
    MODIFY `category_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `promotion_products` MODIFY `promotion_id` INTEGER NOT NULL,
    MODIFY `product_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `promotions` MODIFY `discount_percent` INTEGER NOT NULL,
    MODIFY `start_date` DATE NOT NULL,
    MODIFY `end_date` DATE NOT NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `description` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `email` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `cart` ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cart_details` ADD CONSTRAINT `cart_details_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart`(`cart_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `cart_details` ADD CONSTRAINT `cart_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `feedback` ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_details` ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `order_status_history` ADD CONSTRAINT `order_status_history_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `promotion_products` ADD CONSTRAINT `promotion_products_ibfk_1` FOREIGN KEY (`promotion_id`) REFERENCES `promotions`(`promotion_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `promotion_products` ADD CONSTRAINT `promotion_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
