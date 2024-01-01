import * as React from 'react';
import { MessageBar } from '../MessageBar';
import './chat.scss';
import { Connections } from '../Connection';
import { useNavigate } from 'react-router-dom';
import { LocalStorage } from '../../types/localstorage';
import { Message } from '../../api/message';
import { ChatRoom } from '../ChatRoom';



export const Chat = () => {
  const [token, SetToken] = React.useState(localStorage.getItem(LocalStorage.ACCESS_TOKEN) || "");
  const [curentReceiver, setCurrentReceiver] = React.useState("")
  const [isLoading,setIsLoading]=React.useState(false)
  const navigate = useNavigate();
  React.useEffect(() => {
    const accessToken = localStorage.getItem(LocalStorage.ACCESS_TOKEN);
    if (accessToken) {
      SetToken(accessToken)
    }
    else {
      navigate('/')
    }
  }, [navigate])
  function handleReceiver(receiver: string) {
    setCurrentReceiver(receiver);
    setIsLoading(true);
  }
  function handleLoading(bool:boolean){
    setIsLoading(bool)
  }
  const { getReceivers, createMessage, getMessagesByEmail,updateMessageById ,deleteMessageById} = { ...Message(token) }
  return (
    <div className='chat-room'>
      <aside>
        <Connections getReceivers={getReceivers} onClick={handleReceiver} />
        <MessageBar createMessage={createMessage} />
      </aside>
      <ChatRoom res={getMessagesByEmail} currentUser={curentReceiver} sendMessage={createMessage} updateMessage={updateMessageById} deleteMessage={deleteMessageById} loading={isLoading} handleLoading={handleLoading}/>
    </div>
  );
};