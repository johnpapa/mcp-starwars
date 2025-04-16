import { z } from "zod";
import { BaseSchema, CollectionSchema, EnhancedListResourceSchema } from "../common/schema.js";

export const VehicleSchema = BaseSchema.extend({
  name: z.string(),
  model: z.string(),
  manufacturer: z.string(),
  cost_in_credits: z.string(),
  length: z.string(),
  max_atmosphering_speed: z.string(),
  crew: z.string(),
  passengers: z.string(),
  cargo_capacity: z.string(),
  consumables: z.string(),
  vehicle_class: z.string(),
  pilots: z.array(z.string().url()),
  films: z.array(z.string().url()),
});

export type Vehicle = z.infer<typeof VehicleSchema>;

export const VehicleCollectionSchema = CollectionSchema(VehicleSchema);

// Schema for this tool
export const schema = EnhancedListResourceSchema;
