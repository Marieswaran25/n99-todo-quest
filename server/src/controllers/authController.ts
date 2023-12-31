import { Authentication, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { _genJWTToken } from "../Helpers/generateJwt";
import { CustomRequest } from "../types/request";
import { genRandomColor } from "../Helpers/random";

const _authClient = new PrismaClient().authentication;


export class AuthController {

    async createUser(req: Request, res: Response) {
        try {
            await Promise.all([
                body('username').notEmpty().withMessage('Username is required').run(req),
                body('email').notEmpty().withMessage('Email address is required').isEmail().withMessage('Invalid Email address').run(req),
                body('password').notEmpty().withMessage('Password is required').isLength({ max: 8 }).withMessage('Password must be 8 characters long').run(req),
            ]);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array()[0].msg });
            }
            try {
                const { username, password, email } = req.body;
                const isExistingUser: Authentication | null = await _authClient.findFirst({
                    where: {
                        email: email
                    }
                })
                if (!isExistingUser) {
                    const encryptedPassword = await bcrypt.hash(password, 10)

                    const createdUser = await _authClient.create({
                        data: {
                            username: username,
                            email: email,
                            password: encryptedPassword,
                            avatar:genRandomColor()
                        }
                    })
                    const accesstoken = _genJWTToken({ email: createdUser.email ,username:createdUser.username })
                    if (accesstoken && createdUser) {
                        const {email,username,avatar}={...createdUser}
                        res.status(201).json({ email,username,avatar,accesstoken });
                    }
                }
                else {
                    throw { message: `user ${email} already found` }
                }

            } catch (error) {
                res.status(500).json(error)
            }

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error })
        }

    }
    async validateUser(req: Request, res: Response) {
        try {
            await Promise.all([
                body('email').notEmpty().withMessage('Email address is required').isEmail().withMessage('Invalid Email address').run(req),
                body('password').notEmpty().withMessage('Password is required').isLength({ max: 8 }).withMessage('Password must be 8 characters long').run(req),
            ]);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array()[0].msg });
            }
            try {
                const { email, password, } = req.body;
                const user = await _authClient.findFirst({
                    where: {
                        email: email
                    }
                })

                if (user) {
                    const isValidPassword = await bcrypt.compare(password, user.password);
                    if (isValidPassword) {
                        const accesstoken = _genJWTToken({ email: email ,username:user.username});
                        res.status(202).json({ success: true, accesstoken })
                    }
                    else {
                        res.status(404).json({ message: 'Invalid user or password' })
                    }

                }
                else {
                    res.status(404).json({ message: `user ${email} not found` })
                }

            } catch (error) {
                res.status(500).json(error)
            }

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error })
        }
    }
    async getUserByToken(req: CustomRequest, res: Response) {

        try {
            const payload=req.token;
            if (!payload) {
                return res.status(401).json({ error: 'Unauthorized: Token missing' });
            }
            if (typeof payload === "object") {
                    const user = await _authClient.findFirst({
                        where: {
                            email: payload.email
                        }
                    })
                   const {email,avatar,username}={...user};
                   res.status(200).json({email,avatar,username})
                }

            }
         catch (error) {
            res.status(500).json({ error })
        }
    }


}