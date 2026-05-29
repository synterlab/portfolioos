import { pgTable, text, serial, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const portfoliosTable = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  tagline: text("tagline"),
  bio: text("bio"),
  email: text("email"),
  location: text("location"),
  avatarUrl: text("avatar_url"),
  theme: text("theme").notNull().default("retro"),
  skills: text("skills").array().notNull().default([]),
  socialLinks: jsonb("social_links").$type<{
    github?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    website?: string | null;
  }>().default({}),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const portfolioItemsTable = pgTable("portfolio_items", {
  id: serial("id").primaryKey(),
  portfolioId: integer("portfolio_id").notNull().references(() => portfoliosTable.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  description: text("description"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  isCurrent: boolean("is_current").notNull().default(false),
  tags: text("tags").array().notNull().default([]),
  url: text("url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const portfoliosRelations = relations(portfoliosTable, ({ many }) => ({
  items: many(portfolioItemsTable),
}));

export const portfolioItemsRelations = relations(portfolioItemsTable, ({ one }) => ({
  portfolio: one(portfoliosTable, {
    fields: [portfolioItemsTable.portfolioId],
    references: [portfoliosTable.id],
  }),
}));

export const insertPortfolioSchema = createInsertSchema(portfoliosTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertPortfolio = z.infer<typeof insertPortfolioSchema>;
export type Portfolio = typeof portfoliosTable.$inferSelect;

export const insertPortfolioItemSchema = createInsertSchema(portfolioItemsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type PortfolioItem = typeof portfolioItemsTable.$inferSelect;
