import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { CustomRequest } from "../types/request";



export function validateJWT(req:CustomRequest,res:Response,next:NextFunction ){
	try {
        const token=req.headers.authorization || req.query.token;
        if(token && typeof token==="string"){
            jwt.verify(token.replace('Bearer ',''), JWT_SECRET,(err,decoded)=>{
                if(err)return res.status(403).json({message:'Invalid Authorization Token'});
                req.token=decoded;
                next();
            });
        }
        else{
            res.status(401).json({message:'Authorization is Required'})
        }

	  } catch (error) {
		return res.send(error)
	  }
}