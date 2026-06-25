require("dotenv").config();

function getEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente ${name} não configurada.`);
  }

  return value;
}

module.exports = {
  development: {
    username: getEnv("DB_USER"),
    password: getEnv("DB_PASS"),
    database: getEnv("DB_NAME"),
    host: getEnv("DB_HOST"),
    port: Number(getEnv("DB_PORT")),
    dialect: "mysql",
  },
};