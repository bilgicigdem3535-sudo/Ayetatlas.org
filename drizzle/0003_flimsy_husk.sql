CREATE TABLE `analytics_events` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text DEFAULT 'ayet-atlasi' NOT NULL,
	`session_id` text NOT NULL,
	`event_name` text NOT NULL,
	`path` text NOT NULL,
	`variant` text DEFAULT 'control' NOT NULL,
	`properties` text DEFAULT '{}' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_analytics_event_created` ON `analytics_events` (`event_name`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_analytics_variant_created` ON `analytics_events` (`variant`,`created_at`);--> statement-breakpoint
CREATE TABLE `feature_flags` (
	`key` text PRIMARY KEY NOT NULL,
	`enabled` integer DEFAULT false NOT NULL,
	`rollout_percentage` integer DEFAULT 0 NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`updated_at` integer NOT NULL
);
