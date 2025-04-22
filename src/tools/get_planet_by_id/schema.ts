import { z } from "zod";
import { PlanetSchema } from "../get_planets/schema.js";

// Schema for get_planet_by_id tool
export const schema = z.object({
  id: z.string().or(z.number()),
});

export { PlanetSchema };
