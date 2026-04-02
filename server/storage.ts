import { db } from "./db";
import { products, categories, type Product, type InsertProduct, type Category, type InsertCategory } from "@shared/schema";
import { eq, like, or } from "drizzle-orm";

export interface IStorage {
  getProducts(filters?: { category?: string; profession?: string; featured?: boolean; search?: string }): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
}

export class DatabaseStorage implements IStorage {
  async getProducts(filters?: { category?: string; profession?: string; featured?: boolean; search?: string }): Promise<Product[]> {
    let query = db.select().from(products);
    const conditions = [];

    if (filters?.category) {
      conditions.push(eq(products.category, filters.category));
    }
    if (filters?.profession) {
      conditions.push(eq(products.profession, filters.profession));
    }
    if (filters?.featured) {
      conditions.push(eq(products.isFeatured, true));
    }
    if (filters?.search) {
      conditions.push(or(
        like(products.name, `%${filters.search}%`),
        like(products.description, `%${filters.search}%`)
      ));
    }

    if (conditions.length > 0) {
      // @ts-ignore - Drizzle's 'and' expects 2+ args or specific spread behavior, but with one arg it might be tricky. 
      // Actually with one condition we can just use .where(condition). 
      // If multiple, .where(and(...conditions)).
      // For simplicity in this specific generic implementation:
      return await db.select().from(products).where(
        conditions.length === 1 ? conditions[0] : (require("drizzle-orm").and(...conditions))
      );
    }

    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }
}

export const storage = new DatabaseStorage();
