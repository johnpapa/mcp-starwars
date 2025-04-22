import { z } from "zod";
import { SwapiTool } from "../common/schema.js";
import { schema, FilmSchema } from "./schema.js";
import { fetchWithCache } from "../../swapiService.js";

const get_film_by_id: SwapiTool<typeof schema> = {
  description: "Get details about a specific Star Wars film by ID",
  schema,
  handler: async (args: z.infer<typeof schema>) => {
    return await fetchWithCache<z.infer<typeof FilmSchema>>(`/films/${args.id}/`);
  },
};

export default get_film_by_id;
