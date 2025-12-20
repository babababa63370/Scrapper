import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const scrapedPages = pgTable("scraped_pages", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  htmlContent: text("html_content").notNull(), // The raw HTML
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertScrapedPageSchema = createInsertSchema(scrapedPages).omit({ 
  id: true, 
  createdAt: true 
});

export type ScrapedPage = typeof scrapedPages.$inferSelect;
export type InsertScrapedPage = z.infer<typeof insertScrapedPageSchema>;
