import express from "express";
import webRouter from "./routers/web";

// import getConection from "./config/database";
import { initDatabase } from "./config/seed";

const app = express();
const PORT = process.env.PORT || 3000;

//config view enginee
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static files
app.use(express.static("public"));

//seeding data
initDatabase()

//config routers
webRouter(app);
// getConection();

initDatabase();
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
