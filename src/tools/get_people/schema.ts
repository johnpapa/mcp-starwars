import { z } from "zod";
import { BaseSchema, CollectionSchema, EnhancedListResourceSchema } from "../common/schema.js";

// People (Characters) Schema
export const PeopleSchema = BaseSchema.extend({
  name: z.string(),
  height: z.string(),
  mass: z.string(),
  hair_color: z.string(),
  skin_color: z.string(),
  eye_color: z.string(),
  birth_year: z.string(),
  gender: z.string(),
  homeworld: z.string().url(),
  films: z.array(z.string().url()),
  species: z.array(z.string().url()),
  vehicles: z.array(z.string().url()),
  starships: z.array(z.string().url()),
});

export type People = z.infer<typeof PeopleSchema>;

export const PeopleCollectionSchema = CollectionSchema(PeopleSchema);

// Schema for this tool
export const schema = EnhancedListResourceSchema;
