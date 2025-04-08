#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getCustomInstructions } from "./instructions.js";
import { starwarsTools, listTools, callTool } from "./tools.js";

const instructions = getCustomInstructions();

// Create MCP server with enhanced Star Wars tools
const starWarsMcpServer = new McpServer(
  {
    name: "mcp-starwars",
    version: "1.1.0",
    description:
      "An MCP Server to retrieve Star Wars API usage information from SWAPI.dev with auto-pagination and caching.",
  },
  {
    capabilities: {
      tools: {
        // Register the tool listing and calling functions
        list: listTools,
        call: callTool,
      },
    },
    instructions,
  }
);

// Register individual Star Wars tools for direct access
// This ensures tools are explicitly registered with the MCP server
Object.entries(starwarsTools).forEach(([name, tool]) => {
  // Extract the schema properties directly as a raw shape object
  const schemaShape =
    tool.schema instanceof z.ZodObject
      ? tool.schema.shape
      : Object.fromEntries(Object.entries(tool.schema).map(([k, v]) => [k, z.any()]));

  // Register the tool with the MCP server
  // This allows the MCP server to validate input against the schema
  // and call the tool handler with the validated arguments.
  starWarsMcpServer.tool(name, tool.description, schemaShape, async (args, extra) => {
    try {
      console.log(`[Tool] Executing ${name} with args:`, JSON.stringify(args));
      const startTime = Date.now();

      const result = await tool.handler(args as any);

      const duration = Date.now() - startTime;
      console.log(`[Tool] ${name} completed in ${duration}ms`);

      // Return properly formatted response following MCP content format requirements
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result),
          },
        ],
      };
    } catch (error) {
      console.error(`[Error] Failed executing ${name}:`, error);
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  });
});

// Testing tool
starWarsMcpServer.tool(
  "universal-answer",
  "The secret of the universe with math tricks",
  { x: z.number(), y: z.number() },
  async ({ x, y }) => ({
    content: [{ type: "text", text: String(x * y + 42) }],
  })
);

async function main() {
  console.log("┌───────────────────────────────────────────────────┐");
  console.log("│ Enhanced Star Wars MCP Server                     │");
  console.log("├───────────────────────────────────────────────────┤");
  console.log("│ ✓ Auto-pagination for complete results            │");
  console.log("│ ✓ Smart caching (30 min TTL)                      │");
  console.log("│ ✓ Performance monitoring                          │");
  console.log("└───────────────────────────────────────────────────┘");

  const toolCount = Object.keys(starwarsTools).length;
  console.log(`Registered ${toolCount} tools`);

  const transport = new StdioServerTransport();
  console.log("Connecting to transport...");

  await starWarsMcpServer.connect(transport);
  console.log("Star Wars MCP Server running successfully!");
  console.log("Use tools like get_planets, get_people, etc. with fetchAllPages=true to get all results");
}

main().catch((err) => {
  console.error("┌───────────────────────────────────────────────────┐");
  console.error("│ ERROR: Server failed to start                     │");
  console.error("└───────────────────────────────────────────────────┘");
  console.error(err);
  process.exit(1);
});
