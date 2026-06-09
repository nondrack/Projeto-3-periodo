import { Sequelize } from 'sequelize';
import "dotenv/config";

// Define the database connection configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || process.env.MYSQL_DATABASE || 'music_app', // Database name
  process.env.DB_USER || process.env.MYSQL_USER || 'root',             // Database user
  process.env.DB_PASS || process.env.MYSQL_PASSWORD || '123456',     // Database password
  {
    host: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',         // Use the service name 'mysql' as the host
    port: parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306'), // Default MySQL port (parsed as a number)
    dialect: 'mysql',                                // Database dialect
    logging: console.log,                            // Enable logging (optional)
    dialectOptions: {
      ssl: false, // Disable SSL
    },
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((error: Error) => {
    console.error('Unable to connect to the database:', error);
  });

export default sequelize;

// import { Sequelize } from "sequelize";
// import "dotenv/config";

// const sequelize = new Sequelize(
//     "cinema_db",
//     "root",
//     "1234",
//     {
//         host: 'localhost',
//         port: 3306,
//         dialect: 'mysql', // ou mysql
//         logging: true
//     }
// );

// export default sequelize;