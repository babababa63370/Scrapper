import { db } from "./db";
import { scrapedPages, type InsertScrapedPage, type ScrapedPage } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getPages(): Promise<ScrapedPage[]>;
  getPage(id: number): Promise<ScrapedPage | undefined>;
  createPage(page: InsertScrapedPage): Promise<ScrapedPage>;
  deletePage(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getPages(): Promise<ScrapedPage[]> {
    return await db.select().from(scrapedPages).orderBy(desc(scrapedPages.createdAt));
  }

  async getPage(id: number): Promise<ScrapedPage | undefined> {
    const [page] = await db.select().from(scrapedPages).where(eq(scrapedPages.id, id));
    return page;
  }

  async createPage(page: InsertScrapedPage): Promise<ScrapedPage> {
    const [newPage] = await db.insert(scrapedPages).values(page).returning();
    return newPage;
  }

  async deletePage(id: number): Promise<void> {
    await db.delete(scrapedPages).where(eq(scrapedPages.id, id));
  }
}

export const storage = new DatabaseStorage();
