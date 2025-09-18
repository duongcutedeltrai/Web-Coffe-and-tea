import express from "express";
import webRouter from "./routers/web";

import { initDatabase } from "./config/seed";

import cookieParser from "cookie-parser";
import { connectionDB } from "./config/database";

const app = express();

const PORT = process.env.PORT || 3000;

//CONFIG req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//config view enginee
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//static files
app.use(express.static("public"));

//config routers
webRouter(app);

initDatabase();

connectionDB();

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
