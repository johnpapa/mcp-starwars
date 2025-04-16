import { z } from "zod";
import { SwapiTool } from "../common/schema.js";
import { schema, PeopleSchema } from "./schema.js";
import { fetchWithCache } from "../../swapiService.js";

const get_person_by_id: SwapiTool<typeof schema> = {
  description: "Get details about a specific Star Wars character by ID",
  schema,
  handler: async (args: z.infer<typeof schema>) => {
    return await fetchWithCache<z.infer<typeof PeopleSchema>>(`/people/${args.id}/`);
  },
};

export default get_person_by_id;
