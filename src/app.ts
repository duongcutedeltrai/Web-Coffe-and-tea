import express from "express"
import webRouter from "./routers/web";


const app = express()
const PORT = process.env.PORT || 3000;

//config view enginee
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


//static files
app.use(express.static('public'))

//config routers
webRouter(app)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
})