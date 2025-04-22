import { z } from "zod";

// Schema for cache management
export const schema = z.object({
  endpoint: z.string().optional().describe("Optional specific endpoint to clear from cache. Leave empty to clear all."),
});
