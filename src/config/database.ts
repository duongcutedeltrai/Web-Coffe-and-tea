//import database o day
// Get the client
import mysql from "mysql2/promise";

// Create the connection to database

const getConection = async () => {
  const connection = await mysql.createConnection({
    port: 3306,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  return connection;
};

export default getConection;
