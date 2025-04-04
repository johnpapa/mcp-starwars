import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import {
  PeopleSchema,
  PlanetSchema,
  FilmSchema,
  SpeciesSchema,
  VehicleSchema,
  StarshipSchema,
  PeopleCollectionSchema,
  PlanetCollectionSchema,
  FilmCollectionSchema,
  SpeciesCollectionSchema,
  VehicleCollectionSchema,
  StarshipCollectionSchema,
  GetPeopleByIdSchema,
  GetPlanetByIdSchema,
  GetFilmByIdSchema,
  GetSpeciesByIdSchema,
  GetVehicleByIdSchema,
  GetStarshipByIdSchema,
  ListResourceSchema,
} from "./schemas.js";
import { fetchFromSwapi } from "./utils.js";

// Define the tool interface
export interface SwapiTool<T extends z.ZodType<any, any>> {
  description: string;
  schema: T;
  handler: (args: z.infer<T>) => Promise<any>;
}

// New schema for character details search
export const CharacterDetailsSchema = z.object({
  name: z.string().describe("The name of the character to search for"),
});

// Define all SWAPI tools
export const starwarsTools = {
  // People (Characters) tools
  get_people: {
    description: "List all Star Wars characters with optional pagination and search",
    schema: ListResourceSchema,
    handler: async (args: z.infer<typeof ListResourceSchema>) => {
      const params: Record<string, string | number> = { page: args.page };
      if (args.search) params.search = args.search;
      return await fetchFromSwapi<z.infer<typeof PeopleCollectionSchema>>("/people/", params);
    },
  } as SwapiTool<typeof ListResourceSchema>,

  get_person_by_id: {
    description: "Get details about a specific Star Wars character by ID",
    schema: GetPeopleByIdSchema,
    handler: async (args: z.infer<typeof GetPeopleByIdSchema>) => {
      return await fetchFromSwapi<z.infer<typeof PeopleSchema>>(`/people/${args.id}/`);
    },
  } as SwapiTool<typeof GetPeopleByIdSchema>,

  // Planets tools
  get_planets: {
    description: "List all Star Wars planets with optional pagination and search",
    schema: ListResourceSchema,
    handler: async (args: z.infer<typeof ListResourceSchema>) => {
      const params: Record<string, string | number> = { page: args.page };
      if (args.search) params.search = args.search;
      return await fetchFromSwapi<z.infer<typeof PlanetCollectionSchema>>("/planets/", params);
    },
  } as SwapiTool<typeof ListResourceSchema>,

  get_planet_by_id: {
    description: "Get details about a specific Star Wars planet by ID",
    schema: GetPlanetByIdSchema,
    handler: async (args: z.infer<typeof GetPlanetByIdSchema>) => {
      return await fetchFromSwapi<z.infer<typeof PlanetSchema>>(`/planets/${args.id}/`);
    },
  } as SwapiTool<typeof GetPlanetByIdSchema>,

  // Films tools
  get_films: {
    description: "List all Star Wars films with optional pagination and search",
    schema: ListResourceSchema,
    handler: async (args: z.infer<typeof ListResourceSchema>) => {
      const params: Record<string, string | number> = { page: args.page };
      if (args.search) params.search = args.search;
      return await fetchFromSwapi<z.infer<typeof FilmCollectionSchema>>("/films/", params);
    },
  } as SwapiTool<typeof ListResourceSchema>,

  get_film_by_id: {
    description: "Get details about a specific Star Wars film by ID",
    schema: GetFilmByIdSchema,
    handler: async (args: z.infer<typeof GetFilmByIdSchema>) => {
      return await fetchFromSwapi<z.infer<typeof FilmSchema>>(`/films/${args.id}/`);
    },
  } as SwapiTool<typeof GetFilmByIdSchema>,

  // Species tools
  get_species_list: {
    description: "List all Star Wars species with optional pagination and search",
    schema: ListResourceSchema,
    handler: async (args: z.infer<typeof ListResourceSchema>) => {
      const params: Record<string, string | number> = { page: args.page };
      if (args.search) params.search = args.search;
      return await fetchFromSwapi<z.infer<typeof SpeciesCollectionSchema>>("/species/", params);
    },
  } as SwapiTool<typeof ListResourceSchema>,

  get_species_by_id: {
    description: "Get details about a specific Star Wars species by ID",
    schema: GetSpeciesByIdSchema,
    handler: async (args: z.infer<typeof GetSpeciesByIdSchema>) => {
      return await fetchFromSwapi<z.infer<typeof SpeciesSchema>>(`/species/${args.id}/`);
    },
  } as SwapiTool<typeof GetSpeciesByIdSchema>,

  // Vehicles tools
  get_vehicles: {
    description: "List all Star Wars vehicles with optional pagination and search",
    schema: ListResourceSchema,
    handler: async (args: z.infer<typeof ListResourceSchema>) => {
      const params: Record<string, string | number> = { page: args.page };
      if (args.search) params.search = args.search;
      return await fetchFromSwapi<z.infer<typeof VehicleCollectionSchema>>("/vehicles/", params);
    },
  } as SwapiTool<typeof ListResourceSchema>,

  get_vehicle_by_id: {
    description: "Get details about a specific Star Wars vehicle by ID",
    schema: GetVehicleByIdSchema,
    handler: async (args: z.infer<typeof GetVehicleByIdSchema>) => {
      return await fetchFromSwapi<z.infer<typeof VehicleSchema>>(`/vehicles/${args.id}/`);
    },
  } as SwapiTool<typeof GetVehicleByIdSchema>,

  // Starships tools
  get_starships: {
    description: "List all Star Wars starships with optional pagination and search",
    schema: ListResourceSchema,
    handler: async (args: z.infer<typeof ListResourceSchema>) => {
      const params: Record<string, string | number> = { page: args.page };
      if (args.search) params.search = args.search;
      return await fetchFromSwapi<z.infer<typeof StarshipCollectionSchema>>("/starships/", params);
    },
  } as SwapiTool<typeof ListResourceSchema>,

  get_starship_by_id: {
    description: "Get details about a specific Star Wars starship by ID",
    schema: GetStarshipByIdSchema,
    handler: async (args: z.infer<typeof GetStarshipByIdSchema>) => {
      return await fetchFromSwapi<z.infer<typeof StarshipSchema>>(`/starships/${args.id}/`);
    },
  } as SwapiTool<typeof GetStarshipByIdSchema>,
};

// Type for the starwarsTools object keys
export type ToolName = keyof typeof starwarsTools;

/**
 * MCP-compatible tool definitions with proper formatting for the MCP server
 */
export const mcpToolDefinitions = Object.entries(starwarsTools).reduce(
  (acc, [name, tool]) => {
    acc[name] = {
      description: tool.description,
      inputSchema: zodToJsonSchema(tool.schema),
      handler: async (args: any) => {
        try {
          const result = await tool.handler(args);
          console.log(`Completed tool request: ${name}`);
          return {
            content: [{ type: "text", text: JSON.stringify(result) }],
          };
        } catch (error) {
          console.error(`Error processing ${name}:`, error);
          if (error instanceof Error) {
            throw new Error(`Error processing ${name}: ${error.message}`);
          }
          throw error;
        }
      },
    };
    return acc;
  },
  {} as Record<
    string,
    {
      description: string;
      inputSchema: ReturnType<typeof zodToJsonSchema>;
      handler: (args: any) => Promise<{ content: Array<{ type: string; text: string }> }>;
    }
  >
);

/**
 * MCP tool listing function for the server capabilities
 */
export const listTools = async () => {
  return Object.entries(mcpToolDefinitions).map(([name, tool]) => ({
    name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  }));
};

/**
 * MCP tool call function for the server capabilities
 */
export const callTool = async (name: string, args: any) => {
  console.log(`Processing tool request: ${name}`);

  if (!(name in mcpToolDefinitions)) {
    throw new Error(`Unknown tool: ${name}`);
  }

  return await mcpToolDefinitions[name].handler(args);
};
