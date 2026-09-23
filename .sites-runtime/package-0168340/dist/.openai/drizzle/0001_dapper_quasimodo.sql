CREATE TABLE `training_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`tester_id` text NOT NULL,
	`program_id` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`planned_sets` integer NOT NULL,
	`completed_sets` integer DEFAULT 0 NOT NULL,
	`started_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`completed_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_training_sessions_tester_program` ON `training_sessions` (`tester_id`,`program_id`);--> statement-breakpoint
CREATE INDEX `idx_training_sessions_tester` ON `training_sessions` (`tester_id`);--> statement-breakpoint
CREATE TABLE `training_set_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` text NOT NULL,
	`exercise_index` integer NOT NULL,
	`set_index` integer NOT NULL,
	`weight` text NOT NULL,
	`reps` text NOT NULL,
	`rpe` text NOT NULL,
	`logged_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `training_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_training_set_logs_session_position` ON `training_set_logs` (`session_id`,`exercise_index`,`set_index`);--> statement-breakpoint
CREATE INDEX `idx_training_set_logs_session` ON `training_set_logs` (`session_id`);--> statement-breakpoint
PRAGMA optimize;
