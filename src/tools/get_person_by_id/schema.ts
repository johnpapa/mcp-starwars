import { z } from "zod";
import { PeopleSchema } from "../get_people/schema.js";

// Schema for get_person_by_id tool
export const schema = z.object({
  id: z.string().or(z.number()),
});

export { PeopleSchema };
