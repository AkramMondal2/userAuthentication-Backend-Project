import express from "express"  
import dotenv from  "dotenv/config" 
import { dbConnect } from "./src/config/dbConnect.js"
import userRouter from "./src/routers/userRouter.js"

const app = express()
const port = process.env.PORT

dbConnect()
app.use(express.json())
app.use('/',userRouter)

app.listen(port, ()=>{
    console.log(`app listen on http://localhost:${port}/`)
})