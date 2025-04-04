#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getCustomInstructions } from "./utils/instructions.js";
import { z } from "zod";

const instructions = getCustomInstructions();

const server = new McpServer(
  {
    name: "mcp-starwars",
    version: "1.1.15",
    description: "An MCP Server to retrieve Star Wars API usage information from SWAPI.dev.",
  },
  {
    capabilities: {
      tools: {},
    },
    instructions,
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Peacock MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
