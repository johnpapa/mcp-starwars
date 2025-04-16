import { zodToJsonSchema } from "zod-to-json-schema";
import get_people from "./get_people/index.js";
import get_person_by_id from "./get_person_by_id/index.js";
import get_planets from "./get_planets/index.js";
import get_planet_by_id from "./get_planet_by_id/index.js";
import get_films from "./get_films/index.js";
import get_film_by_id from "./get_film_by_id/index.js";
import get_species_list from "./get_species_list/index.js";
import get_species_by_id from "./get_species_by_id/index.js";
import get_vehicles from "./get_vehicles/index.js";
import get_vehicle_by_id from "./get_vehicle_by_id/index.js";
import get_starships from "./get_starships/index.js";
import get_starship_by_id from "./get_starship_by_id/index.js";
import clear_cache from "./clear_cache/index.js";
import get_cache_stats from "./get_cache_stats/index.js";

// Consolidate all SWAPI tools into a single object
export const starwarsTools = {
  get_people,
  get_person_by_id,
  get_planets,
  get_planet_by_id,
  get_films,
  get_film_by_id,
  get_species_list,
  get_species_by_id,
  get_vehicles,
  get_vehicle_by_id,
  get_starships,
  get_starship_by_id,
  clear_cache,
  get_cache_stats,
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
