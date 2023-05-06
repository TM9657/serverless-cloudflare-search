const crypto = require("crypto");
const fs = require("fs");

const config = fs.readFileSync("config.json");
const parsedConfig = JSON.parse(config);

parsedConfig.secret = crypto.randomBytes(64).toString("hex");

fs.writeFileSync("config.json", JSON.stringify(parsedConfig, null, 2));
