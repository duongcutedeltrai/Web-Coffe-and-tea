import express, { Express } from "express"
const router = express.Router()

const webRouter = (app: Express) => {


    app.use("/", router)
}

export default webRouter