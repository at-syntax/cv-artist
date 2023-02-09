const { join } = require("path");
const { config } = require("dotenv");

let data;
try {
  const { parsed } = config({
    path: join(__dirname, `../.env`),
  });

  data = parsed[process.argv[2]]; // Reads the specified environment variable from .env file
} catch {
  data = process.env[process.argv[2]]; // Reads the specified environment variable from process.env
} finally {
  console.log(data); // Used in CLI via command substitution
}
