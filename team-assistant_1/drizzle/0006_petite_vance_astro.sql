CREATE TABLE `task_contributors` (
	`id` text PRIMARY KEY NOT NULL,
	`task_id` text NOT NULL,
	`member_id` text NOT NULL,
	`share` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	`updated_at` integer DEFAULT (strftime('%s','now') * 1000) NOT NULL,
	FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`member_id`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "task_contributors_share_check" CHECK("task_contributors"."share" >= 1 AND "task_contributors"."share" <= 100)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `task_contributors_task_id_member_id_idx` ON `task_contributors` (`task_id`,`member_id`);