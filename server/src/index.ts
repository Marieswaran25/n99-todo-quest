import express, { Request, Response ,Express} from'express';
import {createServer} from 'http';
import {config} from 'dotenv'
import { PORT } from './config';
import cors from 'cors';
import Routes from './Routes';
import bodyParser from 'body-parser';
import { setCache } from './middlewares/cache';
import { CustomRequest } from './types/request';


const app:Express=express();
const server=createServer(app);


config({path:'./src/.env'})
app.use(cors({
    origin:'*'
}));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use("/api/v1",Routes())
app.get('/',(req:CustomRequest,res:Response)=>{
    res.send('<h1>A N99 Todo Application</h1>')
})


server.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`)
})
