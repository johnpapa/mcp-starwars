import { z } from "zod";

// Base schemas for common fields
export const BaseSchema = z.object({
  created: z.string().datetime(),
  edited: z.string().datetime(),
  url: z.string().url(),
});

// Collection response schema - used for list endpoints
export const CollectionSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    count: z.number(),
    next: z.string().url().nullable(),
    previous: z.string().url().nullable(),
    results: z.array(itemSchema),
  });

// Tool input schemas for list endpoints with optional pagination
export const ListResourceSchema = z.object({
  page: z.number().optional().default(1),
  search: z.string().optional(),
});

// Enhanced schema that adds a toggle for automatic pagination
export const EnhancedListResourceSchema = ListResourceSchema.extend({
  fetchAllPages: z
    .boolean()
    .optional()
    .default(true)
    .describe("Whether to automatically fetch all pages of results (defaults to true)"),
});

// Tool interface for all SWAPI tools
export interface SwapiTool<T extends z.ZodType<any, any>> {
  description: string;
  schema: T;
  handler: (args: z.infer<T>) => Promise<any>;
}
