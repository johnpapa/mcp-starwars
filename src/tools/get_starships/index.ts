import { z } from "zod";
import { SwapiTool } from "../common/schema.js";
import { schema, StarshipCollectionSchema } from "./schema.js";
import { fetchWithCache, fetchAllPages } from "../../swapiService.js";

const get_starships: SwapiTool<typeof schema> = {
  description: "List Star Wars starships with automatic pagination and optional search",
  schema,
  handler: async (args: z.infer<typeof schema>) => {
    const params: Record<string, string | number> = { page: args.page };
    if (args.search) params.search = args.search;

    return args.fetchAllPages
      ? await fetchAllPages<z.infer<typeof StarshipCollectionSchema>>("/starships/", params)
      : await fetchWithCache<z.infer<typeof StarshipCollectionSchema>>("/starships/", params);
  },
};

export default get_starships;
