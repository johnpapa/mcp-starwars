import { z } from "zod";
import { BaseSchema, CollectionSchema, EnhancedListResourceSchema } from "../common/schema.js";

export const PlanetSchema = BaseSchema.extend({
  name: z.string(),
  rotation_period: z.string(),
  orbital_period: z.string(),
  diameter: z.string(),
  climate: z.string(),
  gravity: z.string(),
  terrain: z.string(),
  surface_water: z.string(),
  population: z.string(),
  residents: z.array(z.string().url()),
  films: z.array(z.string().url()),
});

export type Planet = z.infer<typeof PlanetSchema>;

export const PlanetCollectionSchema = CollectionSchema(PlanetSchema);

// Schema for this tool
export const schema = EnhancedListResourceSchema;
