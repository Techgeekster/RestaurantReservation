const path = require("path");
const fs = require("fs");
const { parse } = require("pg-connection-string");

const environment = process.env.NODE_ENV || "development";
const config = require("../../knexfile")[environment];

// Parse the connection string into an object
const connectionConfig = parse(config.connection);

// Add SSL configuration if in production
if (environment === "production") {
  connectionConfig.ssl = {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(__dirname, "..", "..", "ca.crt")).toString(),
  };
}

// Update the config connection property
config.connection = connectionConfig;

if (typeof TextEncoder === "undefined") {
  const { TextEncoder } = require("text-encoding");
  global.TextEncoder = TextEncoder;
}

const knex = require("knex")(config);

// Add a cleanup function to close the connection
process.on("SIGINT", () => {
  knex.destroy(() => {
    console.log("Database connection closed.");
    process.exit(0);
  });
});

module.exports = knex;