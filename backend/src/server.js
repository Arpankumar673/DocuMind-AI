const app = require("./app");
const config = require("./config");

// Run server
app.listen(config.port, () => {
  console.log(`DocuMind AI Server started on port ${config.port}`);
});
