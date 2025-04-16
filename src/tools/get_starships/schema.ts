import { z } from "zod";
import { BaseSchema, CollectionSchema, EnhancedListResourceSchema } from "../common/schema.js";
import { VehicleSchema } from "../get_vehicles/schema.js";

// Starships Schema extends Vehicle with additional starship-specific fields
export const StarshipSchema = VehicleSchema.extend({
  hyperdrive_rating: z.string(),
  MGLT: z.string(),
  starship_class: z.string(),
});

export type Starship = z.infer<typeof StarshipSchema>;

export const StarshipCollectionSchema = CollectionSchema(StarshipSchema);

// Schema for this tool
export const schema = EnhancedListResourceSchema;
