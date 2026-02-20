CREATE TABLE `session_bans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`class_session_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`reason` text,
	`banned_at` text DEFAULT (datetime('now')) NOT NULL,
	`banned_by` integer NOT NULL,
	FOREIGN KEY (`class_session_id`) REFERENCES `class_sessions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`banned_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_session_bans_unique` ON `session_bans` (`class_session_id`,`user_id`);--> statement-breakpoint
ALTER TABLE `class_sessions` ADD `settings` text;