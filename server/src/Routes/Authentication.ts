import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validateJWT } from "../middlewares/verifyJwt";

const {createUser,validateUser,getUserByToken}=new AuthController();

export default (router:Router)=>{
    router.get('/authentication',validateJWT,getUserByToken);
    router.post('/authentication',createUser);
    router.post('/authentication/validate',validateUser);
}
