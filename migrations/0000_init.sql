CREATE TABLE "scraped_pages" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"title" text,
	"html_content" text NOT NULL,
	"css_content" text,
	"base_url" text,
	"created_at" timestamp DEFAULT now()
);
