CREATE TABLE `daily_health_metrics` (
	`id` text PRIMARY KEY NOT NULL,
	`tester_id` text NOT NULL,
	`provider` text NOT NULL,
	`metric_date` text NOT NULL,
	`sleep_duration_minutes` integer,
	`sleep_score` integer,
	`resting_heart_rate` integer,
	`hrv_ms` integer,
	`hrv_method` text,
	`source_updated_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_daily_health_metrics_tester_provider_date` ON `daily_health_metrics` (`tester_id`,`provider`,`metric_date`);--> statement-breakpoint
CREATE INDEX `idx_daily_health_metrics_tester_date` ON `daily_health_metrics` (`tester_id`,`metric_date`);--> statement-breakpoint
CREATE TABLE `health_connections` (
	`id` text PRIMARY KEY NOT NULL,
	`tester_id` text NOT NULL,
	`provider` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`provider_user_id` text,
	`connected_at` text,
	`last_synced_at` text,
	`disconnected_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_health_connections_tester_provider` ON `health_connections` (`tester_id`,`provider`);--> statement-breakpoint
CREATE INDEX `idx_health_connections_tester` ON `health_connections` (`tester_id`);