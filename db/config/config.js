const path = require("path");

try {
	process.loadEnvFile(path.join(__dirname, "../../.env"));
} catch {}

const config = {
	dialect: "postgres",
	use_env_variable: "DATABASE_URL",
};

module.exports = config;
