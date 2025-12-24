/*
  Warnings:

  - The values [BRONZE,SILVER,GOLD,DIAMOND] on the enum `users_membership` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `membership` ENUM('bronze', 'silver', 'gold', 'platinum') NULL;
