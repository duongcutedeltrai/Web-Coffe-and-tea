/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `work_shifts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `products_name_key` ON `products`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `roles_name_key` ON `roles`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `work_shifts_name_key` ON `work_shifts`(`name`);
