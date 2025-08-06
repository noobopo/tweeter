import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
dotenv.config({})
import userRouter from './routes/user.route.js'
import tweetRouter from './routes/tweet.route.js'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cookieParser())


app.use(cors({
    origin:true,
    credentials:true,
    methods:['GET','POST','PUT','DELETE']
}))

app.use('/api/v1/user',userRouter)
app.use('/api/v1/tweet',tweetRouter)


mongoose.connect(process.env.MONGO_URI,{
    dbName:"Twiter"
}).then(()=>{
    console.log("Database Connected");
})

const port = process.env.PORT || 3000
app.listen(port,()=>{
    console.log(`Server running on ${port}`);
})
