//import database o day
// Get the client
import mysql from "mysql2/promise";

// Create the connection to database

const getConection = async () => {
    const connection = await mysql.createConnection({
        port: 3306, // default MySQL port
        host: "localhost",
        user: "root",
        password: "123456", // replace with youactual password
        database: "coffee",
    });
    return connection;
};

export default getConection;
