CREATE TABLE `wearable_connections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tester_id` text NOT NULL,
	`provider` text NOT NULL,
	`device_family` text NOT NULL,
	`device_model` text NOT NULL,
	`consent_status` text NOT NULL,
	`consented_at` text NOT NULL,
	`revoked_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wearable_connections_tester_provider_unique` ON `wearable_connections` (`tester_id`,`provider`);--> statement-breakpoint
CREATE TABLE `wearable_daily_metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`connection_id` integer NOT NULL,
	`local_date` text NOT NULL,
	`sleep_duration_minutes` integer,
	`sleep_quality_score` integer,
	`sleep_quality_source` text,
	`resting_heart_rate_bpm` integer,
	`hrv_ms` integer,
	`hrv_metric` text,
	`hrv_status` text,
	`worn_overnight` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`connection_id`) REFERENCES `wearable_connections`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wearable_daily_metrics_connection_date_unique` ON `wearable_daily_metrics` (`connection_id`,`local_date`);--> statement-breakpoint
CREATE INDEX `wearable_daily_metrics_date_idx` ON `wearable_daily_metrics` (`local_date`);