import { Router } from "express";
import { MessageController } from "../controllers/messageController";
import { validateJWT } from "../middlewares/verifyJwt";

const {createMessage,getMessgesByEmail,updateMessageById,getMessageById,deleteMessageById}=new MessageController();

export default function Message(router:Router){
    router.get('/messages',validateJWT,getMessgesByEmail);
    router.post('/messages',validateJWT,createMessage);
    router.get('/messages/:id',validateJWT,getMessageById);
    router.patch('/messages/:id',validateJWT,updateMessageById);
    router.delete('/messages/:id',validateJWT,deleteMessageById);
}
