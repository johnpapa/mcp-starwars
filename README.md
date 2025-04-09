<div align="center">
# Star Wars MCP Server

[![Open project in GitHub Codespaces](https://img.shields.io/badge/Codespaces-Open-blue?style=flat-square&logo=github)](https://codespaces.new/johnpapa/mcp-starwars?hide_repo_select=true&ref=main&quickstart=true)
[![smithery badge](https://smithery.ai/badge/@johnpapa/mcp-starwars)](https://smithery.ai/server/@johnpapa/mcp-starwars)![Node version](https://img.shields.io/badge/Node.js->=20-3c873a?style=flat-square)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

[![Install with NPM in VS Code](https://img.shields.io/badge/VS_Code-NPM-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode:mcp/install?%7B%22name%22%3A%22starwars%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40johnpapa%2Fmcp-starwars%22%5D%2C%22env%22%3A%7B%7D%7D)
[![Install with NPM in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-NPM-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders:mcp/install?%7B%22name%22%3A%22starwars%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40johnpapa%2Fmcp-starwars%22%5D%2C%22env%22%3A%7B%7D%7D)

[![Install with Docker in VS Code](https://img.shields.io/badge/VS_Code-Docker-0098FF?style=flat-square&logo=visualstudiocode&logoColor=white)](https://vscode.dev/redirect?url=vscode:mcp/install?%7B%22name%22%3A%22starwars%22%2C%22command%22%3A%22docker%22%2C%22args%22%3A%5B%22run%22%2C%22-i%22%2C%22--rm%22%2C%22mcp%2Fstarwars%22%5D%2C%22env%22%3A%7B%7D%7D)
[![Install with Docker in VS Code Insiders](https://img.shields.io/badge/VS_Code_Insiders-Docker-24bfa5?style=flat-square&logo=visualstudiocode&logoColor=white)](https://insiders.vscode.dev/redirect?url=vscode-insiders:mcp/install?%7B%22name%22%3A%22starwars%22%2C%22command%22%3A%22docker%22%2C%22args%22%3A%5B%22run%22%2C%22-i%22%2C%22--rm%22%2C%22mcp%2Fstarwars%22%5D%2C%22env%22%3A%7B%7D%7D)

[Features](#features) • [Tools](#tools) • [Setup](#setup) • [Configuring an MCP Host](#configuring-an-mcp-host)

</div>

MCP Server for the [SWAPI Star Wars API](https://swapi.dev). _The main goal of the project is to show how an MCP server can be used to interact with APIs._

> **Note**: All data used by this MCP server is fetched from the SWAPI documentation](https://swapi.dev).

<a name="features"></a>

## 🔧 Features

- **List Star Wars Characters**: Get character data with optional search filters and automatic pagination
- **List Planets, Films, Species, Vehicles, and Starships**: Access all Star Wars entity collections with search capabilities
- **Fetch Entity Details by ID**: Get detailed information about specific characters, planets, films, species, vehicles, or starships
- **Automatic Pagination**: Seamlessly retrieve all pages of data with a single API call
- **Built-in Caching**: Optimize performance with intelligent API response caching
- **Cache Management**: Clear cache and view cache statistics to monitor performance
- **Tool-based MCP Integration**: Register this server with Model Context Protocol (MCP) tools (VS Code, Claude, etc.)

<a name="tools"></a>

## 🧰 Tools

### 1. `get_people` 🧑‍🤝‍🧑

- **Description**: List Star Wars characters with automatic pagination and optional search
- **Inputs**:
  - `page` (optional number): The page number to retrieve (defaults to 1)
  - `search` (optional string): Name or partial name to search for
  - `fetchAllPages` (optional boolean): Whether to automatically fetch all pages of results (defaults to true)
- **Returns**: Collection of Star Wars character data including name, physical attributes, homeworld, and related entities

### 2. `get_person_by_id` 👤

- **Description**: Get details about a specific Star Wars character by ID
- **Input**:
  - `id` (string or number): The unique identifier of the character
- **Returns**: Complete data for the requested character including name, physical attributes, homeworld, and related entities

### 3. `get_planets` 🪐

- **Description**: List Star Wars planets with automatic pagination and optional search
- **Inputs**:
  - `page` (optional number): The page number to retrieve (defaults to 1)
  - `search` (optional string): Planet name or partial name to search for
  - `fetchAllPages` (optional boolean): Whether to automatically fetch all pages of results (defaults to true)
- **Returns**: Collection of Star Wars planet data including climate, terrain, population, and related entities

### 4. `get_planet_by_id` 🌍

- **Description**: Get details about a specific Star Wars planet by ID
- **Input**:
  - `id` (string or number): The unique identifier of the planet
- **Returns**: Complete data for the requested planet including climate, terrain, population, and related entities

### 5. `get_films` 🎬

- **Description**: List Star Wars films with automatic pagination and optional search
- **Inputs**:
  - `page` (optional number): The page number to retrieve (defaults to 1)
  - `search` (optional string): Film title or partial title to search for
  - `fetchAllPages` (optional boolean): Whether to automatically fetch all pages of results (defaults to true)
- **Returns**: Collection of Star Wars film data including title, episode ID, director, and related entities

### 6. `get_film_by_id` 📽️

- **Description**: Get details about a specific Star Wars film by ID
- **Input**:
  - `id` (string or number): The unique identifier of the film
- **Returns**: Complete data for the requested film including title, episode ID, director, and related entities

### 7. `get_species_list` 👽

- **Description**: List Star Wars species with automatic pagination and optional search
- **Inputs**:
  - `page` (optional number): The page number to retrieve (defaults to 1)
  - `search` (optional string): Species name or partial name to search for
  - `fetchAllPages` (optional boolean): Whether to automatically fetch all pages of results (defaults to true)
- **Returns**: Collection of Star Wars species data including classification, physical attributes, and related entities

### 8. `get_species_by_id` 🧬

- **Description**: Get details about a specific Star Wars species by ID
- **Input**:
  - `id` (string or number): The unique identifier of the species
- **Returns**: Complete data for the requested species including classification, physical attributes, and related entities

### 9. `get_vehicles` 🚗

- **Description**: List Star Wars vehicles with automatic pagination and optional search
- **Inputs**:
  - `page` (optional number): The page number to retrieve (defaults to 1)
  - `search` (optional string): Vehicle name or partial name to search for
  - `fetchAllPages` (optional boolean): Whether to automatically fetch all pages of results (defaults to true)
- **Returns**: Collection of Star Wars vehicle data including model, manufacturer, and specifications

### 10. `get_vehicle_by_id` 🚙

- **Description**: Get details about a specific Star Wars vehicle by ID
- **Input**:
  - `id` (string or number): The unique identifier of the vehicle
- **Returns**: Complete data for the requested vehicle including model, manufacturer, and specifications

### 11. `get_starships` 🚀

- **Description**: List Star Wars starships with automatic pagination and optional search
- **Inputs**:
  - `page` (optional number): The page number to retrieve (defaults to 1)
  - `search` (optional string): Starship name or partial name to search for
  - `fetchAllPages` (optional boolean): Whether to automatically fetch all pages of results (defaults to true)
- **Returns**: Collection of Star Wars starship data including model, manufacturer, and specifications

### 12. `get_starship_by_id` 🛸

- **Description**: Get details about a specific Star Wars starship by ID
- **Input**:
  - `id` (string or number): The unique identifier of the starship
- **Returns**: Complete data for the requested starship including model, manufacturer, and specifications

### 13. `clear_cache` 🧹

- **Description**: Clear the Star Wars API cache (partially or completely)
- **Input**:
  - `endpoint` (optional string): Specific endpoint to clear from cache. Leave empty to clear all.
- **Returns**: Confirmation message indicating which cache was cleared

### 14. `get_cache_stats` 📊

- **Description**: Get statistics about the Star Wars API cache usage
- **Inputs**: None
- **Returns**: Cache hit/miss statistics, size, and performance metrics

<a name="setup"></a>

## 🛠️ Setup

### Quick Installation in VS Code

For the quickest installation, click on one of the VS Code installation buttons at the top of this README.

### Manual Installation in VS Code

#### Using the Command Line

You can install the Star Wars MCP server manually using the following commands:

**For VS Code Stable:**

```bash
code --add-mcp '{"name":"starwars","command":"npx","args":["-y","@johnpapa/mcp-starwars"],"env":{}}'
```

**For VS Code Insiders:**

```bash
code-insiders --add-mcp '{"name":"starwars","command":"npx","args":["-y","@johnpapa/mcp-starwars"],"env":{}}'
```

#### Using VS Code Settings

1. Open VS Code Settings (File > Preferences > Settings)
2. Click on the "Open Settings (JSON)" icon in the top right corner
3. Add the following configuration to your settings.json file:

```json
"mcp": {
  "servers": {
    "starwars": {
      "command": "npx",
      "args": ["-y", "@johnpapa/mcp-starwars"],
      "env": {}
    }
  }
},
"chat.mcp.discovery.enabled": true
```

### Installing via Smithery

To install Star Wars MCP Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@johnpapa/mcp-starwars):

```bash
npx -y @smithery/cli install @johnpapa/mcp-starwars --client claude
```

### Run the MCP Server Locally with MCP Inspector

If you'd like to run MCP Inspector locally to test the server, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/johnpapa/-mcp-starwars
   ```

1. Install the required dependencies and build the project.

   ```bash
   npm install
   npm run build
   ```

1. (Optional) To try out the server using MCP Inspector run the following command:

   ```bash
   # Start the MCP Inspector
   npx @modelcontextprotocol/inspector node build/index.js
   ```

   Visit the MCP Inspector URL shown in the console in your browser. Change `Arguments` to `dist/index.js` and select `Connect`. Select `List Tools` to see the available tools.

<a name="configuring-an-mcp-host"></a>

## Running the MCP Server hosted in GitHub Copilot with VS Code Insiders

> **Note**: If you already have the MCP server enabled with Claude Desktop, add `chat.mcp.discovery.enabled: true` in your VS Code settings and it will discover existing MCP server lists.

If you want to associate the MCP server with a specific repo, create a `.vscode/mcp.json` file with this content:

```json
{
  "inputs": [],
  "servers": {
    "mcp-starwars": {
      "command": "npx",
      // "command": "node",
      "args": [
        "-y",
        "@johnpapa/mcp-starwars"
        // "_git/mcp-starwars/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

If you want to associate the MCP server with all repos, add the following to your VS Code User Settings JSON:

```json
"mcp": {
  "servers": {
    "mcp-starwars": {
      "command": "npx",
      // "command": "node",
      "args": [
        "-y",
        "@johnpapa/mcp-starwars"
        // "/Users/papa/_git/mcp-starwars/dist/index.js"
        // "_git/mcp-starwars/dist/index.js"
      ],
      "env": {}
    }
  }
}
"chat.mcp.discovery.enabled": true,
```

### Using Tools in GitHub Copilot

1. Now that the mcp server is discoverable, open GitHub Copilot and select the `Agent` mode (not `Chat` or `Edits`).
2. Select the "refresh" button in the Copilot chat text field to refresh the server list.
3. Select the "🛠️" button to see all the possible tools, including the ones from this repo.
4. Put a question in the chat that would naturally invoke one of the tools, for example:

   ```
   How do I set my VS Code accent colors?
   ```

   > **Note**: If you see "Sorry, the response was filtered by the Responsible AI Service. Please rephrase your prompt and try again.", try running it again or rephrasing the prompt.
