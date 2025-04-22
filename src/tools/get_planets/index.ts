import { z } from "zod";
import { SwapiTool } from "../common/schema.js";
import { schema, PlanetCollectionSchema } from "./schema.js";
import { fetchWithCache, fetchAllPages } from "../../swapiService.js";

const get_planets: SwapiTool<typeof schema> = {
  description: "List Star Wars planets with automatic pagination and optional search",
  schema,
  handler: async (args: z.infer<typeof schema>) => {
    const params: Record<string, string | number> = { page: args.page };
    if (args.search) params.search = args.search;

    return args.fetchAllPages
      ? await fetchAllPages<z.infer<typeof PlanetCollectionSchema>>("/planets/", params)
      : await fetchWithCache<z.infer<typeof PlanetCollectionSchema>>("/planets/", params);
  },
};

export default get_planets;
