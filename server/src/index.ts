import express, { Request, Response ,Express} from'express';
import {createServer} from 'http';
import {config} from 'dotenv'
import { PORT } from './config';
import cors from 'cors';
import Routes from './Routes';
import bodyParser from 'body-parser';
import { setCache } from './middlewares/cache';
import {Server} from 'socket.io';
import {PrismaClient} from '@prisma/client'
import { validateJWT } from './middlewares/verifyJwt';
import { CustomRequest } from './types/request';


const app:Express=express();
const server=createServer(app);
const io= new Server(server,{
    cors:{
        origin:'http://localhost:3000',
        methods:['GET','POST','PATCH']
    }
})

config({path:'./src/.env'})
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// app.use(validateJWT)
app.use("/api/v1",Routes())
// app.use(setCache);
app.get('/',(req:CustomRequest,res:Response)=>{
    res.send('<h1>A full-duplex Messging Application</h1>')
})
io.on('connection',(socket)=>{
    console.log(socket.id);
    socket.on('disconnect',()=>{
        console.log('user disconnected.')
    })
})

server.listen(PORT,()=>{
    console.log(`Server running at ${PORT}`)
})
