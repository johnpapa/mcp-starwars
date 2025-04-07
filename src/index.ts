#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getCustomInstructions } from "./utils/instructions.js";
import { listTools, callTool } from "./utils/tools.js";

// Get custom instructions for the MCP server
const instructions = getCustomInstructions();

// Create MCP server with Star Wars tools
const starWarsMcpServer = new McpServer(
  {
    name: "mcp-starwars",
    version: "1.0.0",
    description: "An MCP Server to retrieve Star Wars API usage information from SWAPI.dev.",
  },
  {
    capabilities: {
      tools: {
        list: listTools,
        call: callTool,
      },
    },
    instructions,
  }
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
