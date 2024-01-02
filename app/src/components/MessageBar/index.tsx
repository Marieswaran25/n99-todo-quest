import * as React from 'react';
import './messageBar.scss';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { messageSchema } from '../../helpers/form-schema';
import { MessageProps } from '../../api/message';
import { useNavigate } from 'react-router-dom';


interface InputProps {
    email: string,
    message: string
}


export const MessageBar = ({ createMessage }: { createMessage: (data: MessageProps) => Promise<any> }) => {
    const [isOpen, setOpen] = React.useState(false);
    const [error, setError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [color, setColor] = React.useState("none");

    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<InputProps>(
        {
            resolver: yupResolver(messageSchema)
        })

    async function handleFormSubmit(data: InputProps) {
        setError("")
        setIsLoading(true)
        const msgInfo = {
            receiverEmail: data.email,
            message: data.message
        }
        const res = await createMessage({ ...msgInfo })
        if (res && res.status < 400) {
            setColor("#3cae2a")
            setTimeout(() => setColor("none"), 1000)
            setIsLoading(false);
            reset()
            window.location.reload();
        }
        else if (res.status === 403) {
            setError(res.data.message);
            alert('Session Expired');
            navigate('/')
        }
        else {
            if (res.data.message) {
                setError(res.data.message);
            }
        }
        setIsLoading(false)
    }
    return (
        <div className='message-bar'>
            {
                <form onSubmit={handleSubmit(handleFormSubmit)} className='form'>
                    {
                        isOpen && <>
                            <input type='email' placeholder='Enter the Email' id='email' {...register("email")} />
                            {errors.email && <small>{errors.email.message}</small>}
                            <textarea placeholder='Enter the message' id='email' {...register("message")} />
                            {errors.message && <small>{errors.message.message}</small>}
                            {error && <small>{error}</small>}
                            <button style={{ backgroundColor: color === "none" ? "#049fda" : color }}>{isLoading ? <div className="loader"></div> : <>{color === "none" ? "Send Message" : "Sent"}</>}</button>
                        </>
                    }
                </form>
            }
            {!isOpen && <button onClick={() => setOpen(true)}>Send Message</button>}
        </div>
    )
};

