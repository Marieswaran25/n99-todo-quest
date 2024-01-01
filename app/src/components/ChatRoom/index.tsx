import * as React from 'react';
import './chatroom.scss';
import { ChatRoomProps } from '../../types/user';
import { MessageProps } from '../../api/message';
import { MessageCarrier } from '../MessageCarrier';
import { useNavigate } from 'react-router-dom';
import { ChatRoomFallBack } from './fallback';

interface UpdateProps {
    message: string
    id: string
}

export const ChatRoom: React.FC<{ 
    res: (receiver: string) => Promise<any>, 
    currentUser: string, sendMessage: (data: MessageProps) => Promise<any>, 
    updateMessage: (id: string, message: string) => Promise<any>,
    deleteMessage: (id: string) => Promise<any> ,
    loading:boolean,
    handleLoading:(bool:boolean)=>void
}
    > = 
    ({ res, currentUser, sendMessage, updateMessage, deleteMessage ,loading ,handleLoading}) => {

    const [inputmessage, SetMessage] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [data, setData] = React.useState<ChatRoomProps | null>(null);
    const inputRef = React.useRef<null | HTMLTextAreaElement>(null)
    const scrolldivRef = React.useRef<null | HTMLDivElement>(null)
    const [isEditData, SetEdit] = React.useState<boolean | UpdateProps>(false);
    const navigate = useNavigate();


    function handleMessage(e: React.FormEvent<HTMLTextAreaElement>) {
        SetMessage(e.currentTarget.value)
    }
    function handleEditMessage(val: UpdateProps) {
        SetEdit(val)
    }
    async function handleDeleteMessage(val: { id: string }) {
        try {
            if (val) {
                setData((prev) => {
                    if (prev) {
                        const { senderToReceivermessages } = { ...prev }
                        if (senderToReceivermessages) {
                            const deletedArray = senderToReceivermessages.filter(msg => val.id !== msg.id)
                            return { ...prev, senderToReceivermessages: deletedArray }
                        }
                    }
                    return prev || null
                })
                const res = await deleteMessage(val.id)
                if (res.status === 401 || res.status === 403) {
                    alert('Session Expired');
                    navigate('/')
                }
            }
        } catch (error) {
            console.error(error)
        }


    }
    async function handleSubmit(e: React.FormEvent) {
        setIsLoading(true)
        e.preventDefault();

        if (!isEditData) {
            try {
                const res = await sendMessage({ receiverEmail: currentUser, message: inputmessage })
                if (res && res.status < 400) {

                    setIsLoading(false);
                    setData((prev) => {
                        if (prev) {
                            const { senderToReceivermessages } = { ...prev };

                            if (senderToReceivermessages) {
                                const updatedMessages = [...senderToReceivermessages, res.data.newMessage];

                                return { ...prev, senderToReceivermessages: updatedMessages };
                            }
                        }
                        return prev || null
                    })
                    if (scrolldivRef.current) {
                        scrolldivRef.current.scrollTo({ behavior: "smooth", top: scrolldivRef.current.scrollHeight })
                    }
                }
                else if (res.status === 401 || res.status === 403) {
                    alert('Session Expired');
                    navigate('/')
                }
            } catch (error) {
                console.error(error)
            }
        }
        else if (typeof isEditData === "object") {
            try {
                const res = await updateMessage(isEditData.id, inputmessage);
                if (res && res.status < 400) {
                    setIsLoading(false)
                    setData((prev) => {
                        if (prev) {
                            const { senderToReceivermessages } = { ...prev };

                            if (senderToReceivermessages) {
                                const updatedMessages = senderToReceivermessages.map((message) => {
                                    if (message.id === isEditData.id) {
                                        return { ...message, content: inputmessage };
                                    }
                                    return message;
                                });
                                return { ...prev, senderToReceivermessages: updatedMessages };
                            }
                        }
                        return prev || null;
                    });

                }
                else if (res.status === 401 || res.status === 403) {
                    alert('Session Expired');
                    navigate('/')
                }
            } catch (error) {
                console.error(error)
            }
            finally {
                SetEdit(false);
                SetMessage("")
            }
        }
        setIsLoading(false);
        if (inputRef.current && inputRef.current.value) {
            inputRef.current.value = "";
        }


    }
    React.useEffect(() => {
        if (inputRef.current && typeof isEditData !== "boolean") {
            inputRef.current.focus()
            inputRef.current.value = isEditData.message
        }
    }, [isEditData])

    React.useEffect(() => {
        if (scrolldivRef.current) {
            scrolldivRef.current.scrollTo({ behavior: "smooth", top: scrolldivRef.current.scrollHeight })
        }
    })


    React.useEffect(() => {
        if (currentUser) {
            const fetch = async () => {
                const response = await res(currentUser);
                setData(response)
                handleLoading(false)
            }
            fetch()
        }
    }, [currentUser,handleLoading,res])

    const { receiverInfo, senderToReceivermessages, receiverToSenderMessage } = { ...data }

    const messages = senderToReceivermessages && receiverToSenderMessage && senderToReceivermessages.concat(receiverToSenderMessage);

    if (!data && loading) {
        return (<ChatRoomFallBack />)
    }

    return (
        <main>
            <div className='receiver-panel'>
                <div style={{ backgroundColor: receiverInfo?.avatar }} className='avatar'>
                    <h1 style={{ color: 'white' }}>{receiverInfo?.username[0].toUpperCase()}</h1>
                </div>
                <div>
                    <h5>{receiverInfo?.username}</h5>
                    <small>{receiverInfo?.email}</small>
                </div>
            </div>
            <div className="message-section" ref={scrolldivRef}>
                {
                    messages && messages.slice().sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((val, index) => {
                        return (<MessageCarrier id={val.id} message={val.content} datetime={val.timestamp} type={receiverInfo?.email === val.receiverEmail ? "sender" : "receiver"} key={index} handleEdit={handleEditMessage} handleDelete={handleDeleteMessage} />)
                    })
                }
            </div>
            <form className="message-bar" onSubmit={handleSubmit}>
               { data && <textarea placeholder='Enter the message' id='email' onChange={handleMessage} readOnly={data ? false : true} ref={inputRef} />}
                <button disabled={!data || !inputmessage ? true : false}>{isLoading ? <div className="loader"></div> : <>{"Send"}</>}</button>
            </form>
        </main >
    );
};

