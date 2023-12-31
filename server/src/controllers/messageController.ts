import { Authentication, Message, PrismaClient } from "@prisma/client"
import { body, param, validationResult } from "express-validator";
import  { Response } from "express";
import { CustomRequest } from "../types/request";


const _messageClient = new PrismaClient().message;
const _authClient = new PrismaClient().authentication;


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
                const payload = req.token;
                const sender = payload && typeof payload === "object" ? payload.email : senderEmail
                if (sender !== receiverEmail) {
                    const newMessage: Message = await _messageClient.create({
                        data: {
                            senderEmail: sender,
                            receiverEmail: receiverEmail,
                            content: message
                        }
                    })
                    res.status(200).json({ newMessage })
                }
                else {
                    res.status(400).json({ message: 'Sender and receiver cannot be same' })

                }
            } catch (error) {
                res.status(500).json({ message: 'Internal Server Error', error })
            }

        } catch (error) {
            res.status(500).json({ message: 'Internal Server Error', error })
        }

    }
    async getMessgesByEmail(req: CustomRequest, res: Response) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array()[0].msg });
            }
            const { receiverEmail } = req.query
            const payload = req.token;
            if (payload && typeof payload === "object") {
                let senderToReceivermessages: Message[] = [];
                let receiverToSenderMessage:Message[]=[]
                senderToReceivermessages = await _messageClient.findMany({
                    where: {
                        senderEmail: payload.email
                    }
                })
                receiverToSenderMessage= await _messageClient.findMany({
                    where: {
                        senderEmail: String(receiverEmail)
                    }
                })
                if (receiverEmail) {
                    senderToReceivermessages = senderToReceivermessages.filter((msg) => {
                        return msg.receiverEmail === receiverEmail
                    }).sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp))
                    receiverToSenderMessage = receiverToSenderMessage.filter((msg) => {
                        return msg.receiverEmail === payload.email
                    }).sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp))
                    const data = await _authClient.findFirst({
                        where: {
                            email: String(receiverEmail),
                        },
                    });
                    if(data){
                        const {password,createdAt,id,...rest}={...data}
                        res.status(200).json({ senderToReceivermessages,receiverInfo:rest,receiverToSenderMessage})
                    }
                }
                else {
                    let receivers: string[] = [];
                    senderToReceivermessages.map((receiver) => {
                        if (!receivers.includes(receiver.receiverEmail)) {
                            receivers.push(receiver.receiverEmail)
                        }
                    })
                    let receiversData: Authentication[] = [];
                    await Promise.all(
                        receivers.map(async (receiver) => {
                            const data = await _authClient.findFirst({
                                where: {
                                    email: receiver,
                                },
                            });

                            if (data) {
                                receiversData.push(data);
                            }
                        })
                    );
                    const result=receiversData.map(val=>{
                        const {avatar,id,email,username}= {...val}
                        return {avatar,id,email,username,sender:payload.username}
                    })
                    res.status(200).json(result);
                }

            }
            else {
                res.send(401).json({ message: 'Authorization failed' })
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
    async updateMessageById(req: CustomRequest, res: Response) {
        try {
            await Promise.all([
                body('message').notEmpty().withMessage("Message is Required").run(req),
            ]);
            const { id } = req.params;
            const { message } = req.body;
            const {token}=req.query;

            if (id) {
                if (req.token ||token) {
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
    async deleteMessageById(req: CustomRequest, res: Response) {
        try {
            const { id } = req.params;
            const {token}=req.query;
            if (id) {
                if (typeof req.token ||token) {
                    const deletedMessage = await _messageClient.delete({
                        where: {
                            id: id
                        },
                    })
                    res.status(200).json({ message: 'Message Deleted', deletedMessage})
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

}