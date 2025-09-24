-- CreateIndex
CREATE FULLTEXT INDEX `users_username_email_idx` ON `users`(`username`, `email`);
