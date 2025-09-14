import express from "express"
import webRouter from "./routers/web";
import {connectionDB} from "./config/database";

const app = express()
const PORT = process.env.PORT || 3000;

//CONFIG req.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//config view enginee
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//static files
app.use(express.static('public'))

//config routers
webRouter(app)

connectionDB();

app.listen(PORT, () => {
 console.log(`http://localhost:${PORT}`)
})