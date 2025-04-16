import { z } from "zod";
import { SwapiTool } from "../common/schema.js";
import { schema } from "./schema.js";
import { clearCache } from "../../swapiService.js";

const clear_cache: SwapiTool<typeof schema> = {
  description: "Clear the Star Wars API cache (partially or completely)",
  schema,
  handler: async (args: z.infer<typeof schema>) => {
    clearCache(args.endpoint);
    return {
      message: args.endpoint ? `Cache cleared for endpoint: ${args.endpoint}` : "Complete cache cleared successfully",
    };
  },
};

export default clear_cache;
