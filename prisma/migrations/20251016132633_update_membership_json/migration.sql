/*
  Warnings:

  - You are about to alter the column `applicable_membership` on the `promotions` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(9))` to `Json`.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `promotions` MODIFY `applicable_membership` JSON NULL;

-- CreateIndex
CREATE UNIQUE INDEX `phone` ON `users`(`phone`);
