CREATE TABLE `coach_training_plans` (
	`id` text PRIMARY KEY NOT NULL,
	`coach_id` text NOT NULL,
	`tester_id` text NOT NULL,
	`title` text NOT NULL,
	`focus` text NOT NULL,
	`scheduled_date` text NOT NULL,
	`training_type` text NOT NULL,
	`duration` integer NOT NULL,
	`exercises` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_coach_training_plans_coach_tester` ON `coach_training_plans` (`coach_id`,`tester_id`);--> statement-breakpoint
CREATE INDEX `idx_coach_training_plans_tester_status_date` ON `coach_training_plans` (`tester_id`,`status`,`scheduled_date`);