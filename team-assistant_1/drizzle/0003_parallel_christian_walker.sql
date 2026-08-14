ALTER TABLE `members` ADD `user_id` text REFERENCES users(id);--> statement-breakpoint
CREATE UNIQUE INDEX `members_project_id_user_id_idx` ON `members` (`project_id`,`user_id`);