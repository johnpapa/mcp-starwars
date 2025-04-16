import { z } from "zod";
import { BaseSchema, CollectionSchema, EnhancedListResourceSchema } from "../common/schema.js";

export const FilmSchema = BaseSchema.extend({
  title: z.string(),
  episode_id: z.number(),
  opening_crawl: z.string(),
  director: z.string(),
  producer: z.string(),
  release_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  characters: z.array(z.string().url()),
  planets: z.array(z.string().url()),
  starships: z.array(z.string().url()),
  vehicles: z.array(z.string().url()),
  species: z.array(z.string().url()),
});

export type Film = z.infer<typeof FilmSchema>;

export const FilmCollectionSchema = CollectionSchema(FilmSchema);

// Schema for this tool
export const schema = EnhancedListResourceSchema;
