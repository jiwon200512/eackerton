ALTER TABLE `projects` ADD `status` text DEFAULT 'ACTIVE' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `completed_at` integer;