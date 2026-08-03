CREATE TABLE `outbox_events` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`event_type` text NOT NULL,
	`aggregate_id` text NOT NULL,
	`payload` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`available_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`processed_at` integer
);
--> statement-breakpoint
CREATE INDEX `idx_outbox_status_available` ON `outbox_events` (`status`,`available_at`);--> statement-breakpoint
DROP INDEX `blog_posts_created_at_idx`;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `tenant_id` text DEFAULT 'ayet-atlasi' NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `uploaded_by` text DEFAULT 'system' NOT NULL;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `idempotency_key` text;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `updated_at` integer;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `deleted_at` integer;--> statement-breakpoint
ALTER TABLE `blog_posts` ADD `archived_at` integer;--> statement-breakpoint
CREATE INDEX `idx_blog_posts_tenant_status_created` ON `blog_posts` (`tenant_id`,`status`,`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_blog_posts_tenant_idempotency` ON `blog_posts` (`tenant_id`,`idempotency_key`);