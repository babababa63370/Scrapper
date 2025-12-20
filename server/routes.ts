import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.pages.list.path, async (req, res) => {
    const pages = await storage.getPages();
    res.json(pages);
  });

  app.get(api.pages.get.path, async (req, res) => {
    const page = await storage.getPage(Number(req.params.id));
    if (!page) {
      return res.status(404).json({ message: 'Page not found' });
    }
    res.json(page);
  });

  app.post(api.pages.create.path, async (req, res) => {
    try {
      const input = api.pages.create.input.parse(req.body);
      const page = await storage.createPage(input);
      res.status(201).json(page);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.pages.delete.path, async (req, res) => {
    await storage.deletePage(Number(req.params.id));
    res.status(204).send();
  });

  return httpServer;
}
