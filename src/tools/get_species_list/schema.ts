import { z } from "zod";
import { BaseSchema, CollectionSchema, EnhancedListResourceSchema } from "../common/schema.js";

export const SpeciesSchema = BaseSchema.extend({
  name: z.string(),
  classification: z.string(),
  designation: z.string(),
  average_height: z.string(),
  skin_colors: z.string(),
  hair_colors: z.string(),
  eye_colors: z.string(),
  average_lifespan: z.string(),
  homeworld: z.string().url().nullable(),
  language: z.string(),
  people: z.array(z.string().url()),
  films: z.array(z.string().url()),
});

export type Species = z.infer<typeof SpeciesSchema>;

export const SpeciesCollectionSchema = CollectionSchema(SpeciesSchema);

// Schema for this tool
export const schema = EnhancedListResourceSchema;
