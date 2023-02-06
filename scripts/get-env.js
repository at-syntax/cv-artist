const { join } = require("path");
const { config } = require("dotenv");

let data;
try {
  let result;
  if (process.env.NODE_ENV === "production") {
    result = config({
      path: join(__dirname, `../.env`),
    });
  } else {
    result = config({
      path: join(__dirname, "../.env.local"),
    });
  }
  data = result.parsed[process.argv[2]]; // Reads the specified environment variable from .env file
} catch {
  data = process.env[process.argv[2]]; // Reads the specified environment variable from process.env
} finally {
  console.log(data); // Used in CLI via command substitution
}
