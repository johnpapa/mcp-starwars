import { z } from "zod";
import { SwapiTool } from "../common/schema.js";
import { schema, SpeciesSchema } from "./schema.js";
import { fetchWithCache } from "../../swapiService.js";

const get_species_by_id: SwapiTool<typeof schema> = {
  description: "Get details about a specific Star Wars species by ID",
  schema,
  handler: async (args: z.infer<typeof schema>) => {
    return await fetchWithCache<z.infer<typeof SpeciesSchema>>(`/species/${args.id}/`);
  },
};

export default get_species_by_id;
