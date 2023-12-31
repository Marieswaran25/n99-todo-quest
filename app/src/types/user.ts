export interface UserProps {
    id: string;
    username: string;
    email: string;
    avatar: string;
    sender:string
}

export interface MessageProps{
    id: string;
    content: string;
    senderEmail: string;
    receiverEmail: string;
    timestamp: Date;
    updatedTimestamp: Date | null;
}

export interface ChatRoomProps{
    receiverInfo:Omit<UserProps,"sender">,
    receiverToSenderMessage:MessageProps[],
    senderToReceivermessages:MessageProps[]
}