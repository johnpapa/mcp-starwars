import { SwapiTool } from "../common/schema.js";
import { schema } from "./schema.js";
import { getCacheStats } from "../../swapiService.js";

const get_cache_stats: SwapiTool<typeof schema> = {
  description: "Get statistics about the Star Wars API cache usage",
  schema,
  handler: async () => {
    return getCacheStats();
  },
};

export default get_cache_stats;
