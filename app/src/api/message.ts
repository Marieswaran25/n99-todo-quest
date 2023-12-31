import axios, { AxiosRequestConfig } from "axios"
import { API_BASE_URL } from "../config"

export interface MessageProps{
    receiverEmail:string,
    message:string
}
export function Message(accessToken:string){
    let config:AxiosRequestConfig={
        headers:{
            Authorization:accessToken
        }
    }
    return{
            createMessage:async function(data:MessageProps){
                try {
                    const response=await axios.post(API_BASE_URL.concat('messages'),{...data},config);
                    return response;
                } catch (error:any) {
                    return error.response
                }
            },
            getReceivers:async function(){
                try {
                    const response=await axios.get(API_BASE_URL.concat('messages'),config);
                    return response;
                } catch (error:any) {
                    return error.response
                }
            },
            getMessagesByEmail:async function(receiverEmail:string){
                try {
                    const response = await axios.get(API_BASE_URL.concat(`messages?receiverEmail=${receiverEmail}&token=${accessToken}`))                    
                    return response.data;
                } catch (error:any) {
                    return error.response
                }

            },
            updateMessageById:async function(id:string,message:string){
                try {
                    const data={
                        message:message
                    }
                    const response = await axios.patch(API_BASE_URL.concat(`messages/${id}?token=${accessToken}`),data)  
                    return response;
                } catch (error:any) {
                    return error.response
                }

            },
            deleteMessageById:async function(id:string,){
                try {
                    const response = await axios.delete(API_BASE_URL.concat(`messages/${id}?token=${accessToken}`))  
                    return response;
                } catch (error:any) {
                    return error.response
                }

            }

        }
    
}