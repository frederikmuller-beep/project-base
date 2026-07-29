CREATE TABLE `feedback_responses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text NOT NULL,
	`tester_id` text NOT NULL,
	`role` text NOT NULL,
	`answers` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
