const app = require("./src/app");
const config = require("./src/config");

/**
 * DocuMind AI Backend Entry Point
 * -----------------------------------
 * Starts the server on the configured port.
 */
app.listen(config.port, () => {
  console.log(`DocuMind AI Server running on port ${config.port}`);
});
