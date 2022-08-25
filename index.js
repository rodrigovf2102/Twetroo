import express from "express";
import cors from 'cors';

const server = express();
server.use(cors());

server.get('/',(req,res)=>{res.send("lalala")});


server.listen(5000);