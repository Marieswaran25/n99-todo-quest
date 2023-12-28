import { NextFunction, Request,Response } from "express";

export function setCache(req:Request,res:Response,next:NextFunction){
    const period =60*5 //in seconds
    if(req.method==='GET'){
        res.set('cache-control',`public, max-age=${period}`)
    }
    else{
        res.set('cache-control','no-store');
    }
    next();
}