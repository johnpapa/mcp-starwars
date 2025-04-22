import { z } from "zod";
import { FilmSchema } from "../get_films/schema.js";

// Schema for get_film_by_id tool
export const schema = z.object({
  id: z.string().or(z.number()),
});

export { FilmSchema };
