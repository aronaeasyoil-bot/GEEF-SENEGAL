import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  role: text("role", { enum: ["super_admin", "admin", "editor", "author", "requests_manager", "translator"] }).notNull().default("author"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("admin_users_email_unique").on(table.email)]);

export const contactRequests = sqliteTable("contact_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  receipt: text("receipt").notNull(),
  requestType: text("request_type").notNull(),
  fullName: text("full_name").notNull(),
  organization: text("organization").notNull().default(""),
  role: text("role").notNull().default(""),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  country: text("country").notNull().default(""),
  sector: text("sector").notNull().default(""),
  budget: text("budget").notNull().default(""),
  timeframe: text("timeframe").notNull().default(""),
  message: text("message").notNull(),
  attachmentKey: text("attachment_key"),
  status: text("status").notNull().default("new"),
  consent: integer("consent", { mode: "boolean" }).notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("contact_receipt_unique").on(table.receipt), index("contact_status_created_idx").on(table.status, table.createdAt)]);

export const projectSubmissions = sqliteTable("project_submissions", {
  id: text("id").primaryKey(),
  receipt: text("receipt").notNull(),
  fullName: text("full_name").notNull(),
  organization: text("organization").notNull(),
  role: text("role").notNull(),
  country: text("country").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  projectTitle: text("project_title").notNull(),
  sector: text("sector").notNull(),
  location: text("location").notNull(),
  maturity: text("maturity").notNull(),
  description: text("description").notNull(),
  needsJson: text("needs_json").notNull().default("[]"),
  expectedOutcome: text("expected_outcome").notNull(),
  estimatedAmount: text("estimated_amount").notNull().default(""),
  mobilizedAmount: text("mobilized_amount").notNull().default(""),
  requestedAmount: text("requested_amount").notNull().default(""),
  financingType: text("financing_type").notNull().default(""),
  timeframe: text("timeframe").notNull().default(""),
  status: text("status").notNull().default("submitted"),
  consent: integer("consent", { mode: "boolean" }).notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("project_receipt_unique").on(table.receipt), index("project_status_created_idx").on(table.status, table.createdAt)]);

export const attachments = sqliteTable("attachments", {
  id: text("id").primaryKey(),
  ownerType: text("owner_type").notNull(),
  ownerId: text("owner_id").notNull(),
  objectKey: text("object_key").notNull(),
  originalName: text("original_name").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  status: text("status").notNull().default("pending_scan"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [index("attachments_owner_idx").on(table.ownerType, table.ownerId)]);

export const newsletterSubscribers = sqliteTable("newsletter_subscribers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull().default(""),
  lastName: text("last_name").notNull().default(""),
  email: text("email").notNull(),
  sector: text("sector").notNull().default(""),
  consent: integer("consent", { mode: "boolean" }).notNull(),
  status: text("status").notNull().default("pending_confirmation"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("newsletter_email_unique").on(table.email)]);

export const contentItems = sqliteTable("content_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  kind: text("kind").notNull(),
  slug: text("slug").notNull(),
  status: text("status").notNull().default("draft"),
  confidentiality: text("confidentiality").notNull().default("public"),
  approvedBy: text("approved_by"),
  approvedAt: text("approved_at"),
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("content_kind_slug_unique").on(table.kind, table.slug), index("content_status_published_idx").on(table.kind, table.status, table.publishedAt)]);

export const contentTranslations = sqliteTable("content_translations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  contentId: integer("content_id").notNull().references(() => contentItems.id, { onDelete: "cascade" }),
  locale: text("locale", { enum: ["fr", "en"] }).notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull().default(""),
  body: text("body").notNull().default(""),
  seoTitle: text("seo_title").notNull().default(""),
  seoDescription: text("seo_description").notNull().default(""),
  translationStatus: text("translation_status").notNull().default("draft"),
}, (table) => [uniqueIndex("translation_content_locale_unique").on(table.contentId, table.locale)]);

export const cmsPages = sqliteTable("cms_pages", {
  path: text("path").primaryKey(),
  draftJson: text("draft_json").notNull().default("{}"),
  publishedJson: text("published_json").notNull().default("{}"),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  publishedAt: text("published_at"),
});

export const cmsMedia = sqliteTable("cms_media", {
  id: text("id").primaryKey(),
  objectKey: text("object_key").notNull(),
  contentType: text("content_type").notNull(),
  size: integer("size").notNull(),
  alt: text("alt").notNull().default(""),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => [uniqueIndex("cms_media_object_key_unique").on(table.objectKey)]);
