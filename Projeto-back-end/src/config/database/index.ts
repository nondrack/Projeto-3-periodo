import { Sequelize } from "sequelize";
import "dotenv/config";

function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Variável de ambiente ${name} não configurada.`);
  }

  return value;
}

const sequelize = new Sequelize(
  getEnv("DB_NAME"),
  getEnv("DB_USER"),
  getEnv("DB_PASS"),
  {
    host: getEnv("DB_HOST"),
    port: Number(getEnv("DB_PORT")),
    dialect: "mysql",
    logging: console.log,
    dialectOptions: {
      ssl: false,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados realizada com sucesso.");
  })
  .catch((error: Error) => {
    console.error("Erro ao conectar no banco de dados:", error);
  });

export default sequelize;