import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connectionDB = async () => {
  await mysql.createConnection({
    port: 3306,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // host:"shinkansen.proxy.rlwy.net",
    // user:"root" ,
    // password:"cqAPIvdFQlxmqaqmVSvzHgZMXROCmKbH",
    // database:"db_coffeetea",
  });
};

export { connectionDB };
