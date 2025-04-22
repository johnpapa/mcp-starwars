import { z } from "zod";
import { StarshipSchema } from "../get_starships/schema.js";

// Schema for get_starship_by_id tool
export const schema = z.object({
  id: z.string().or(z.number()),
});

export { StarshipSchema };
