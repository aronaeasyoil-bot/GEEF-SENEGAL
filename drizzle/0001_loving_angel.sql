CREATE TABLE `cms_media` (
	`id` text PRIMARY KEY NOT NULL,
	`object_key` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`alt` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cms_media_object_key_unique` ON `cms_media` (`object_key`);--> statement-breakpoint
CREATE TABLE `cms_pages` (
	`path` text PRIMARY KEY NOT NULL,
	`draft_json` text DEFAULT '{}' NOT NULL,
	`published_json` text DEFAULT '{}' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`published_at` text
);
