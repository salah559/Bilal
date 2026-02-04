import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

async function seedDatabase() {
  const existingProducts = await storage.getProducts();
  if (existingProducts.length === 0) {
    console.log("Seeding database...");
    
    // Seed Categories
    await storage.createCategory({ name: "Outils", slug: "outils", imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&q=80" });
    await storage.createCategory({ name: "Sécurité", slug: "securite", imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80" });
    await storage.createCategory({ name: "Peinture", slug: "peinture", imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80" });
    await storage.createCategory({ name: "Électricité", slug: "electricite", imageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80" });

    // Seed Products
    await storage.createProduct({
      name: "Perceuse à Percussion Pro",
      description: "Perceuse sans fil haute performance avec batterie lithium-ion 18V. Idéale pour le béton et le métal.",
      price: 12500, // 125.00
      category: "outils",
      imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80",
      isFeatured: true,
      stock: 15,
      specifications: { voltage: "18V", weight: "1.5kg" }
    });

    await storage.createProduct({
      name: "Jeu de Tournevis Premium",
      description: "Set de 12 tournevis magnétiques en acier chrome-vanadium. Poignées ergonomiques antidérapantes.",
      price: 3500, // 35.00
      category: "outils",
      imageUrl: "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&q=80",
      isFeatured: true,
      stock: 50,
      specifications: { pieces: "12", material: "Chrome-Vanadium" }
    });

    await storage.createProduct({
      name: "Peinture Murale Blanche 5L",
      description: "Peinture acrylique blanc mat, haute couvrance, séchage rapide. Parfaite pour intérieur.",
      price: 4500, // 45.00
      category: "peinture",
      imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80",
      isFeatured: false,
      stock: 30,
      specifications: { volume: "5L", finish: "Mat" }
    });

    await storage.createProduct({
      name: "Cadenas Haute Sécurité",
      description: "Cadenas en acier trempé avec protection anti-perçage. Fourni avec 3 clés.",
      price: 2200, // 22.00
      category: "securite",
      imageUrl: "https://images.unsplash.com/photo-1589820296156-2454b3a89305?auto=format&fit=crop&q=80",
      isFeatured: true,
      stock: 100,
      specifications: { material: "Hardened Steel", securityLevel: "9/10" }
    });
    
    console.log("Database seeded successfully!");
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Products Routes
  app.get(api.products.list.path, async (req, res) => {
    const filters = {
      category: typeof req.query.category === 'string' ? req.query.category : undefined,
      featured: req.query.featured === 'true',
      search: typeof req.query.search === 'string' ? req.query.search : undefined,
    };
    const products = await storage.getProducts(filters);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
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

  // Categories Routes
  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  // Run seed
  seedDatabase().catch(console.error);

  return httpServer;
}
