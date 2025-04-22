import { z } from "zod";
import { SpeciesSchema } from "../get_species_list/schema.js";

// Schema for get_species_by_id tool
export const schema = z.object({
  id: z.string().or(z.number()),
});

export { SpeciesSchema };
