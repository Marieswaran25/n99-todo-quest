import { Router } from "express";
import Authentication from "./Authentication";
import Message from "./Message";

const router=Router();

export default ()=>{
    Authentication(router);
    Message(router);
    return router;
}