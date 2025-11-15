-- AlterTable
ALTER TABLE `users` ADD COLUMN `reset_token` VARCHAR(255) NULL,
    ADD COLUMN `reset_token_expire` DATETIME(0) NULL;
