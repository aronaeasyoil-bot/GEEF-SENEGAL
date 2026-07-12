CREATE TABLE `admin_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`role` text DEFAULT 'author' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_type` text NOT NULL,
	`owner_id` text NOT NULL,
	`object_key` text NOT NULL,
	`original_name` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`status` text DEFAULT 'pending_scan' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `attachments_owner_idx` ON `attachments` (`owner_type`,`owner_id`);--> statement-breakpoint
CREATE TABLE `contact_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`receipt` text NOT NULL,
	`request_type` text NOT NULL,
	`full_name` text NOT NULL,
	`organization` text DEFAULT '' NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`email` text NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`country` text DEFAULT '' NOT NULL,
	`sector` text DEFAULT '' NOT NULL,
	`budget` text DEFAULT '' NOT NULL,
	`timeframe` text DEFAULT '' NOT NULL,
	`message` text NOT NULL,
	`attachment_key` text,
	`status` text DEFAULT 'new' NOT NULL,
	`consent` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contact_receipt_unique` ON `contact_requests` (`receipt`);--> statement-breakpoint
CREATE INDEX `contact_status_created_idx` ON `contact_requests` (`status`,`created_at`);--> statement-breakpoint
CREATE TABLE `content_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kind` text NOT NULL,
	`slug` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`confidentiality` text DEFAULT 'public' NOT NULL,
	`approved_by` text,
	`approved_at` text,
	`published_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_kind_slug_unique` ON `content_items` (`kind`,`slug`);--> statement-breakpoint
CREATE INDEX `content_status_published_idx` ON `content_items` (`kind`,`status`,`published_at`);--> statement-breakpoint
CREATE TABLE `content_translations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`content_id` integer NOT NULL,
	`locale` text NOT NULL,
	`title` text NOT NULL,
	`summary` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`seo_title` text DEFAULT '' NOT NULL,
	`seo_description` text DEFAULT '' NOT NULL,
	`translation_status` text DEFAULT 'draft' NOT NULL,
	FOREIGN KEY (`content_id`) REFERENCES `content_items`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `translation_content_locale_unique` ON `content_translations` (`content_id`,`locale`);--> statement-breakpoint
CREATE TABLE `newsletter_subscribers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text DEFAULT '' NOT NULL,
	`last_name` text DEFAULT '' NOT NULL,
	`email` text NOT NULL,
	`sector` text DEFAULT '' NOT NULL,
	`consent` integer NOT NULL,
	`status` text DEFAULT 'pending_confirmation' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `newsletter_email_unique` ON `newsletter_subscribers` (`email`);--> statement-breakpoint
CREATE TABLE `project_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`receipt` text NOT NULL,
	`full_name` text NOT NULL,
	`organization` text NOT NULL,
	`role` text NOT NULL,
	`country` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`project_title` text NOT NULL,
	`sector` text NOT NULL,
	`location` text NOT NULL,
	`maturity` text NOT NULL,
	`description` text NOT NULL,
	`needs_json` text DEFAULT '[]' NOT NULL,
	`expected_outcome` text NOT NULL,
	`estimated_amount` text DEFAULT '' NOT NULL,
	`mobilized_amount` text DEFAULT '' NOT NULL,
	`requested_amount` text DEFAULT '' NOT NULL,
	`financing_type` text DEFAULT '' NOT NULL,
	`timeframe` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`consent` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `project_receipt_unique` ON `project_submissions` (`receipt`);--> statement-breakpoint
CREATE INDEX `project_status_created_idx` ON `project_submissions` (`status`,`created_at`);