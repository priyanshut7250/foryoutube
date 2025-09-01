import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const downloadRequests = pgTable("download_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  videoUrl: text("video_url").notNull(),
  resolution: text("resolution").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, completed, failed
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDownloadRequestSchema = createInsertSchema(downloadRequests).pick({
  videoUrl: true,
  resolution: true,
});

export const videoInfoSchema = z.object({
  title: z.string(),
  duration: z.string(),
  views: z.string(),
  thumbnail: z.string(),
  videoUrl: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDownloadRequest = z.infer<typeof insertDownloadRequestSchema>;
export type DownloadRequest = typeof downloadRequests.$inferSelect;
export type VideoInfo = z.infer<typeof videoInfoSchema>;
