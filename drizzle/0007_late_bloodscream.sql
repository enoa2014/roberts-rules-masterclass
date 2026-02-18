CREATE INDEX `idx_assignments_user_id` ON `assignments` (`user_id`,`id`);--> statement-breakpoint
CREATE INDEX `idx_assignments_status_id` ON `assignments` (`status`,`id`);--> statement-breakpoint
CREATE INDEX `idx_class_sessions_status_id` ON `class_sessions` (`status`,`id`);--> statement-breakpoint
CREATE INDEX `idx_class_sessions_creator_id` ON `class_sessions` (`created_by`,`id`);--> statement-breakpoint
CREATE INDEX `idx_discussion_comments_post_status_id` ON `discussion_comments` (`post_id`,`status`,`id`);--> statement-breakpoint
CREATE INDEX `idx_discussion_posts_status_id` ON `discussion_posts` (`status`,`id`);--> statement-breakpoint
CREATE INDEX `idx_feedbacks_session_id` ON `feedbacks` (`class_session_id`,`id`);--> statement-breakpoint
CREATE INDEX `idx_hand_raises_session_status_raised` ON `hand_raises` (`class_session_id`,`status`,`raised_at`);--> statement-breakpoint
CREATE INDEX `idx_hand_raises_session_user_status` ON `hand_raises` (`class_session_id`,`user_id`,`status`);--> statement-breakpoint
CREATE INDEX `idx_moderation_logs_target_action_id` ON `moderation_logs` (`target_type`,`action`,`id`);--> statement-breakpoint
CREATE INDEX `idx_polls_session_status_id` ON `polls` (`class_session_id`,`status`,`id`);--> statement-breakpoint
CREATE INDEX `idx_speech_timers_session_ended_id` ON `speech_timers` (`class_session_id`,`ended_at`,`id`);