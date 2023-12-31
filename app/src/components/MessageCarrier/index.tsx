import * as React from 'react';
import './messageCarrier.scss';

export interface MessageCarrierProps{
    id:string,
    message:string,
    datetime:Date,
    type:'sender'|'receiver',
    handleEdit:({message,id}:{message:string,id:string})=>void
    handleDelete:({id}:{id:string})=>void

}

export const MessageCarrier: React.FunctionComponent<MessageCarrierProps> = ({id,message,datetime,type,handleEdit,handleDelete}) => {
    return(
        <div className={`message-carrier ${type}`} style={{backgroundColor:type==="sender"?"#f0ffd6":"#e9e9e9"}} >
            <p>{message}</p>
            <div className="options" >
                <div>
                   {type==="sender" && <small onClick={()=>handleEdit({message:message,id:id})}>Edit</small>}
                   {type==="sender" && <small onClick={()=>handleDelete({id:id})}>Delete</small>}
                </div>
                <small>{new  Date(datetime).toLocaleString().split(',').reverse().join(',')}</small>
            </div>
        </div>
    )
};
