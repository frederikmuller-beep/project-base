CREATE TABLE `coach_athlete_assignments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`coach_id` text NOT NULL,
	`tester_id` text NOT NULL,
	`assigned_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_coach_athlete_assignments_coach_tester` ON `coach_athlete_assignments` (`coach_id`,`tester_id`);--> statement-breakpoint
CREATE INDEX `idx_coach_athlete_assignments_coach` ON `coach_athlete_assignments` (`coach_id`);