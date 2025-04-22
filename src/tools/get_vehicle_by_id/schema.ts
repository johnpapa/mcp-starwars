import { z } from "zod";
import { VehicleSchema } from "../get_vehicles/schema.js";

// Schema for get_vehicle_by_id tool
export const schema = z.object({
  id: z.string().or(z.number()),
});

export { VehicleSchema };
