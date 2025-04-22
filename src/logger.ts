/**
 * Custom logger for MCP server that avoids stdout interference
 * with the MCP transport protocol
 */

// Dedicated safe logging for MCP servers that won't interfere with transport
export const logger = {
  info(message: string): void {
    // Write directly to stderr without prefixes to work better with VS Code's MCP logging
    process.stderr.write(`${message}\n`);
  },

  warn(message: string): void {
    process.stderr.write(`WARNING: ${message}\n`);
  },

  error(message: string | Error): void {
    const errorMsg = message instanceof Error ? message.message : message;
    process.stderr.write(`ERROR: ${errorMsg}\n`);

    if (message instanceof Error && message.stack) {
      process.stderr.write(`${message.stack}\n`);
    }
  },
};
