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
import { fetchWithCache, fetchAllPages, getCacheStats, clearCache } from "./swapiService.js";

// Define the tool interface
export interface SwapiTool<T extends z.ZodType<any, any>> {
  description: string;
  schema: T;
  handler: (args: z.infer<T>) => Promise<any>;
}

// Enhanced schema that adds a toggle for automatic pagination
export const EnhancedListResourceSchema = ListResourceSchema.extend({
  fetchAllPages: z
    .boolean()
    .optional()
    .default(true)
    .describe("Whether to automatically fetch all pages of results (defaults to true)"),
});

// New schema for character details search
export const CharacterDetailsSchema = z.object({
  name: z.string().describe("The name of the character to search for"),
});

// Schema for cache management
export const CacheControlSchema = z.object({
  endpoint: z.string().optional().describe("Optional specific endpoint to clear from cache. Leave empty to clear all."),
});

// Define all SWAPI tools
export const starwarsTools = {
  get_people: {
    description: "List Star Wars characters with automatic pagination and optional search",
    schema: EnhancedListResourceSchema,
    handler: async (args: z.infer<typeof EnhancedListResourceSchema>) => {
      const params: Record<string, string | number> = { page: args.page };
      if (args.search) params.search = args.search;

      return args.fetchAllPages
        ? await fetchAllPages<z.infer<typeof PeopleCollectionSchema>>("/people/", params)
        : await fetchWithCache<z.infer<typeof PeopleCollectionSchema>>("/people/", params);
    },
  } as SwapiTool<typeof EnhancedListResourceSchema>,

  get_person_by_id: {
    description: "Get details about a specific Star Wars character by ID",
    schema: GetPeopleByIdSchema,
    handler: async (args: z.infer<typeof GetPeopleByIdSchema>) => {
      return await fetchWithCache<z.infer<typeof PeopleSchema>>(`/people/${args.id}/`);
    },
  } as SwapiTool<typeof GetPeopleByIdSchema>,

  get_planets: {
    description: "List Star Wars planets with automatic pagination and optional search",
    schema: EnhancedListResourceSchema,
    handler: async (args: z.infer<typeof EnhancedListResourceSchema>) => {
      const params: Record<string, string | number> = { page: args.page };
      if (args.search) params.search = args.search;

      return args.fetchAllPages
        ? await fetchAllPages<z.infer<typeof PlanetCollectionSchema>>("/planets/", params)
        : await fetchWithCache<z.infer<typeof PlanetCollectionSchema>>("/planets/", params);
    },
  } as SwapiTool<typeof EnhancedListResourceSchema>,

  get_planet_by_id: {
    description: "Get details about a specific Star Wars planet by ID",
    schema: GetPlanetByIdSchema,
    handler: async (args: z.infer<typeof GetPlanetByIdSchema>) => {
      return await fetchWithCache<z.infer<typeof PlanetSchema>>(`/planets/${args.id}/`);
    },
  } as SwapiTool<typeof GetPlanetByIdSchema>,

  get_films: {
    description: "List Star Wars films with automatic pagination and optional search",
    schema: EnhancedListResourceSchema,
    handler: async (args: z.infer<typeof EnhancedListResourceSchema>) => {
      const params: Record<string, string | number> = { page: args.page };
      if (args.search) params.search = args.search;

      return args.fetchAllPages
        ? await fetchAllPages<z.infer<typeof FilmCollectionSchema>>("/films/", params)
        : await fetchWithCache<z.infer<typeof FilmCollectionSchema>>("/films/", params);
    },
  } as SwapiTool<typeof EnhancedListResourceSchema>,

  get_film_by_id: {
    description: "Get details about a specific Star Wars film by ID",
    schema: GetFilmByIdSchema,
    handler: async (args: z.infer<typeof GetFilmByIdSchema>) => {
      return await fetchWithCache<z.infer<typeof FilmSchema>>(`/films/${args.id}/`);
    },
  } as SwapiTool<typeof GetFilmByIdSchema>,

  get_species_list: {
    description: "List Star Wars species with automatic pagination and optional search",
    schema: EnhancedListResourceSchema,
    handler: async (args: z.infer<typeof EnhancedListResourceSchema>) => {
      const params: Record<string, string | number> = { page: args.page };
      if (args.search) params.search = args.search;

      return args.fetchAllPages
        ? await fetchAllPages<z.infer<typeof SpeciesCollectionSchema>>("/species/", params)
        : await fetchWithCache<z.infer<typeof SpeciesCollectionSchema>>("/species/", params);
    },
  } as SwapiTool<typeof EnhancedListResourceSchema>,

  get_species_by_id: {
    description: "Get details about a specific Star Wars species by ID",
    schema: GetSpeciesByIdSchema,
    handler: async (args: z.infer<typeof GetSpeciesByIdSchema>) => {
      return await fetchWithCache<z.infer<typeof SpeciesSchema>>(`/species/${args.id}/`);
    },
  } as SwapiTool<typeof GetSpeciesByIdSchema>,

  get_vehicles: {
    description: "List Star Wars vehicles with automatic pagination and optional search",
    schema: EnhancedListResourceSchema,
    handler: async (args: z.infer<typeof EnhancedListResourceSchema>) => {
      const params: Record<string, string | number> = { page: args.page };
      if (args.search) params.search = args.search;

      return args.fetchAllPages
        ? await fetchAllPages<z.infer<typeof VehicleCollectionSchema>>("/vehicles/", params)
        : await fetchWithCache<z.infer<typeof VehicleCollectionSchema>>("/vehicles/", params);
    },
  } as SwapiTool<typeof EnhancedListResourceSchema>,

  get_vehicle_by_id: {
    description: "Get details about a specific Star Wars vehicle by ID",
    schema: GetVehicleByIdSchema,
    handler: async (args: z.infer<typeof GetVehicleByIdSchema>) => {
      return await fetchWithCache<z.infer<typeof VehicleSchema>>(`/vehicles/${args.id}/`);
    },
  } as SwapiTool<typeof GetVehicleByIdSchema>,

  get_starships: {
    description: "List Star Wars starships with automatic pagination and optional search",
    schema: EnhancedListResourceSchema,
    handler: async (args: z.infer<typeof EnhancedListResourceSchema>) => {
      const params: Record<string, string | number> = { page: args.page };
      if (args.search) params.search = args.search;

      return args.fetchAllPages
        ? await fetchAllPages<z.infer<typeof StarshipCollectionSchema>>("/starships/", params)
        : await fetchWithCache<z.infer<typeof StarshipCollectionSchema>>("/starships/", params);
    },
  } as SwapiTool<typeof EnhancedListResourceSchema>,

  get_starship_by_id: {
    description: "Get details about a specific Star Wars starship by ID",
    schema: GetStarshipByIdSchema,
    handler: async (args: z.infer<typeof GetStarshipByIdSchema>) => {
      return await fetchWithCache<z.infer<typeof StarshipSchema>>(`/starships/${args.id}/`);
    },
  } as SwapiTool<typeof GetStarshipByIdSchema>,

  clear_cache: {
    description: "Clear the Star Wars API cache (partially or completely)",
    schema: CacheControlSchema,
    handler: async (args: z.infer<typeof CacheControlSchema>) => {
      clearCache(args.endpoint);
      return {
        message: args.endpoint ? `Cache cleared for endpoint: ${args.endpoint}` : "Complete cache cleared successfully",
      };
    },
  } as SwapiTool<typeof CacheControlSchema>,

  get_cache_stats: {
    description: "Get statistics about the Star Wars API cache usage",
    schema: z.object({}),
    handler: async () => {
      return getCacheStats();
    },
  } as SwapiTool<z.ZodObject<{}>>,
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
