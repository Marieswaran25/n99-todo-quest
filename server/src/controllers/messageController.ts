import { Message, PrismaClient } from "@prisma/client"
import { body, validationResult } from "express-validator";
import e, { Request, Response } from "express";
import { CustomRequest } from "../types/request";


const _messageClient = new PrismaClient().message;

export class MessageController {

    async createMessage(req: CustomRequest, res: Response) {
        try {
            await Promise.all([
                body('senderEmail').notEmpty().withMessage('Sender Email is required').isEmail().withMessage('Invalid Email address').optional().run(req),
                body('receiverEmail').notEmpty().withMessage('Receiver Email is required').isEmail().withMessage('Invalid Email address').run(req),
                body('message').notEmpty().withMessage("Message is Required").run(req),
            ]);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array()[0].msg });
            }
            try {
                const { senderEmail, receiverEmail, message } = req.body;
                const payload = req.token

                const newMessage: Message = await _messageClient.create({
                    data: {
                        senderEmail: payload && typeof payload === "object" ? payload.email : senderEmail,
                        receiverEmail: receiverEmail,
                        content: message
                    }
                })
                res.status(200).json({ newMessage })
            } catch (error) {
                res.status(500).json({ message: 'Internal Server Error', error })
            }

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error })
        }

    }
    async getMessgesByEmail(req: CustomRequest, res: Response) {
        try {
            await Promise.all([
                body('receiverEmail').notEmpty().withMessage('Receiver Email is required').isEmail().withMessage('Invalid Email address').run(req),
            ]);
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array()[0].msg });
            }
            const { receiverEmail } = req.body
            const payload = req.token;
            if (payload && typeof payload === "object") {
                const messages: Message[] = await _messageClient.findMany({
                    where: {
                        receiverEmail: receiverEmail,
                        senderEmail: payload.email
                    }
                })
                const sortedMessages = messages.sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp));
                res.status(200).json({ sortedMessages })
            }
            else {
                res.send(401).json({ message: 'Authorization failed' })
            }
        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error })
        }
    }
    async updateMessageById(req: CustomRequest, res: Response) {
        try {
            await Promise.all([
                body('message').notEmpty().withMessage("Message is Required").run(req),
            ]);
            const { id } = req.params;
            const { message } = req.body;
            console.log(id,message)

            if (id) {
                if (typeof req.token === "object" && req.token.email) {
                    const updatedMessage = await _messageClient.update({
                        where: {
                            id: id
                        },
                        data: {
                            content: message,
                            updatedTimestamp: new Date().toISOString()
                        }
                    })
                    res.status(200).json({ updatedMessage })
                }
                else {
                    res.status(401).json({ message: 'Authorization failed' })
                }
            }
            else {
                res.status(404).json({ message: `message id ${id} not found` })
            }

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error })
        }

    }
    async getMessageById(req: CustomRequest, res: Response) {
        try {
            const { id } = req.params;

            if (typeof req.token === "object" && req.token.email) {
                const message = await _messageClient.findUnique({
                    where: {
                        id: id
                    }
                })
                res.status(200).json({ message })
            }
            else {
                res.status(401).json({ message: 'Authorization failed' })
            }


        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error })

        }

    }


}