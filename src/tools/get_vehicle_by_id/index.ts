import { z } from "zod";
import { SwapiTool } from "../common/schema.js";
import { schema, VehicleSchema } from "./schema.js";
import { fetchWithCache } from "../../swapiService.js";

const get_vehicle_by_id: SwapiTool<typeof schema> = {
  description: "Get details about a specific Star Wars vehicle by ID",
  schema,
  handler: async (args: z.infer<typeof schema>) => {
    return await fetchWithCache<z.infer<typeof VehicleSchema>>(`/vehicles/${args.id}/`);
  },
};

export default get_vehicle_by_id;
