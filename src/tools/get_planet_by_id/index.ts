import { z } from "zod";
import { SwapiTool } from "../common/schema.js";
import { schema, PlanetSchema } from "./schema.js";
import { fetchWithCache } from "../../swapiService.js";

const get_planet_by_id: SwapiTool<typeof schema> = {
  description: "Get details about a specific Star Wars planet by ID",
  schema,
  handler: async (args: z.infer<typeof schema>) => {
    return await fetchWithCache<z.infer<typeof PlanetSchema>>(`/planets/${args.id}/`);
  },
};

export default get_planet_by_id;
