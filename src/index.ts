#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getCustomInstructions } from "./utils/instructions.js";
import { starwarsTools } from "./utils/tools.js";

const instructions = getCustomInstructions();

// Create MCP server with Star Wars tools
const starWarsMcpServer = new McpServer(
  {
    name: "mcp-starwars",
    version: "1.0.1",
    description: "An MCP Server to retrieve Star Wars API usage information from SWAPI.dev.",
  },
  {
    capabilities: {
      tools: {
        // Register the tool listing and calling functions
        // list: listTools,
        // call: callTool,
      },
    },
    instructions,
  }
);

// Register individual Star Wars tools for direct access
// This ensures tools are explicitly registered with the MCP server
Object.entries(starwarsTools).forEach(([name, tool]) => {
  // Register all Star Wars tools from the starwarsTools object
  const schemaShape =
    tool.schema instanceof z.ZodObject
      ? tool.schema.shape
      : Object.fromEntries(Object.entries(tool.schema).map(([k, v]) => [k, z.any()]));

  starWarsMcpServer.tool(name, tool.description, async (args: any) => {
    const result = await tool.handler(args as any);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
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
  const transport = new StdioServerTransport();
  await starWarsMcpServer.connect(transport);
  console.error("Star Wars MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
