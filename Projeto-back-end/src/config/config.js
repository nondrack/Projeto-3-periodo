require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER || process.env.MYSQL_USER,
    password: process.env.DB_PASS || process.env.MYSQL_PASSWORD,
    database: process.env.DB_NAME || process.env.MYSQL_DATABASE,
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
  },
};