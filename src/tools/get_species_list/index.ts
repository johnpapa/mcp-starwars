import { z } from "zod";
import { SwapiTool } from "../common/schema.js";
import { schema, SpeciesCollectionSchema } from "./schema.js";
import { fetchWithCache, fetchAllPages } from "../../swapiService.js";

const get_species_list: SwapiTool<typeof schema> = {
  description: "List Star Wars species with automatic pagination and optional search",
  schema,
  handler: async (args: z.infer<typeof schema>) => {
    const params: Record<string, string | number> = { page: args.page };
    if (args.search) params.search = args.search;

    return args.fetchAllPages
      ? await fetchAllPages<z.infer<typeof SpeciesCollectionSchema>>("/species/", params)
      : await fetchWithCache<z.infer<typeof SpeciesCollectionSchema>>("/species/", params);
  },
};

export default get_species_list;
