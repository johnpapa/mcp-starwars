import { z } from "zod";
import { SwapiTool } from "../common/schema.js";
import { schema, FilmCollectionSchema } from "./schema.js";
import { fetchWithCache, fetchAllPages } from "../../swapiService.js";

const get_films: SwapiTool<typeof schema> = {
  description: "List Star Wars films with automatic pagination and optional search",
  schema,
  handler: async (args: z.infer<typeof schema>) => {
    const params: Record<string, string | number> = { page: args.page };
    if (args.search) params.search = args.search;

    return args.fetchAllPages
      ? await fetchAllPages<z.infer<typeof FilmCollectionSchema>>("/films/", params)
      : await fetchWithCache<z.infer<typeof FilmCollectionSchema>>("/films/", params);
  },
};

export default get_films;
