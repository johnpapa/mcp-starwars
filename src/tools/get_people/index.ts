import { z } from "zod";
import { SwapiTool } from "../common/schema.js";
import { schema, PeopleCollectionSchema } from "./schema.js";
import { fetchWithCache, fetchAllPages } from "../../swapiService.js";

const get_people: SwapiTool<typeof schema> = {
  description: "List Star Wars characters with automatic pagination and optional search",
  schema,
  handler: async (args: z.infer<typeof schema>) => {
    const params: Record<string, string | number> = { page: args.page };
    if (args.search) params.search = args.search;

    return args.fetchAllPages
      ? await fetchAllPages<z.infer<typeof PeopleCollectionSchema>>("/people/", params)
      : await fetchWithCache<z.infer<typeof PeopleCollectionSchema>>("/people/", params);
  },
};

export default get_people;
