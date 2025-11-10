/*
  Warnings:

  - You are about to drop the `_blog_categoriestoblogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_blog_tagstoblogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog_tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_blog_categoriestoblogs` DROP FOREIGN KEY `_blog_categoriesToblogs_A_fkey`;

-- DropForeignKey
ALTER TABLE `_blog_categoriestoblogs` DROP FOREIGN KEY `_blog_categoriesToblogs_B_fkey`;

-- DropForeignKey
ALTER TABLE `_blog_tagstoblogs` DROP FOREIGN KEY `_blog_tagsToblogs_A_fkey`;

-- DropForeignKey
ALTER TABLE `_blog_tagstoblogs` DROP FOREIGN KEY `_blog_tagsToblogs_B_fkey`;

-- AlterTable
ALTER TABLE `blogs` MODIFY `description` VARCHAR(500) NULL;

-- DropTable
DROP TABLE `_blog_categoriestoblogs`;

-- DropTable
DROP TABLE `_blog_tagstoblogs`;

-- DropTable
DROP TABLE `blog_categories`;

-- DropTable
DROP TABLE `blog_tags`;
