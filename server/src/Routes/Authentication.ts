import { Router } from "express";
import { AuthController } from "../controllers/authController";

const {createUser,validateUser,getUserByToken}=new AuthController();

export default (router:Router)=>{
    router.get('/authentication',getUserByToken);
    router.post('/authentication',createUser);
    router.post('/authentication/validate',validateUser);
}
