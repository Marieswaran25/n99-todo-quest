import * as React from 'react';
import './connection.scss';
import { useNavigate } from 'react-router-dom';
import { ConnectionsFallBack } from './fallback';
import { UserProps } from '../../types/user';



export const Connections = ({ getReceivers, onClick: handleClick }: { getReceivers: () => Promise<any>, onClick: (receiver: string) => void }) => {
    const [data, setData] = React.useState<UserProps[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getReceivers();

                if (res && res.status >= 200 && res.status < 300) {
                    setData(res.data);
                } else {
                    if (res.status === 403 || res.status === 401) {
                        alert('Session Expired');
                        navigate('/');
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoading) {
            fetchData();
        }
    }, [getReceivers, navigate, isLoading]);

    if (isLoading) {
        return <ConnectionsFallBack />
    }
    function handleReceiver(receiver: string) {
        handleClick(receiver)
    }
    if (data.length === 0) {
        return <>Nothing to show</>
    }

    return (
        <div className='connections'>
            <h2>{`Hello ${data[0].sender}!`}</h2>
            <div className='connection-list'>
                {data.sort().map((user, index) => {
                    const { username, email, avatar } = { ...user };
                    return (
                        <>
                            <div className='connection' key={index} onClick={() => handleReceiver(user.email)}>
                                <div style={{ backgroundColor: avatar ? avatar : 'cadetblue' }}>
                                    <h1>{username[0].toUpperCase()}</h1>
                                </div>
                                <div>
                                    <h5>{username}</h5>
                                    <small>{email}</small>
                                </div>
                            </div>
                            <hr style={{ width: '90%' }} />
                        </>
                    );
                })}
            </div>
        </div>
    );
};
