import { z } from "zod";
import { SwapiTool } from "../common/schema.js";
import { schema, StarshipSchema } from "./schema.js";
import { fetchWithCache } from "../../swapiService.js";

const get_starship_by_id: SwapiTool<typeof schema> = {
  description: "Get details about a specific Star Wars starship by ID",
  schema,
  handler: async (args: z.infer<typeof schema>) => {
    return await fetchWithCache<z.infer<typeof StarshipSchema>>(`/starships/${args.id}/`);
  },
};

export default get_starship_by_id;
