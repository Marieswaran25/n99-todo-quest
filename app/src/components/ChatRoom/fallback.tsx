import * as React from 'react';
import { FallbackLine } from '../FallbackLine';
import './chatroom.scss'



export const ChatRoomFallBack: React.FunctionComponent = () => {
    return (
        <div className='chat-room-fallback'>
            <div className='chat' >
                <div className='avatar'>
                    <FallbackLine lineStyle={{ height: '40px', width: "40px", borderRadius: "50%" }} />
                </div>
                <div className='content' style={{ width: '100%' }}>
                    <FallbackLine containerStyle={{ height: '16px' }} lineStyle={{ width: "25%", height: '15px' }} />
                    <FallbackLine containerStyle={{ height: '14px' }} lineStyle={{ width: '40%', height: '14px' }} />
                </div>
            </div>
            <div className='message-wrapper'>
                {
                    Array.from({ length: 2 }).map((_, index) => {
                        return (
                            <div className="message" key={index}>
                                <FallbackLine containerStyle={{ height: '16px' }} lineStyle={{ width: "50%", height: '15px' }} />
                                <FallbackLine containerStyle={{ height: '16px' }} lineStyle={{ width: "35%", height: '15px' }} />
                                <FallbackLine containerStyle={{ height: '16px' }} lineStyle={{ width: "20%", height: '15px' }} />
                            </div>
                        )
                    })
                }
                {
                    Array.from({ length: 2 }).map((_, index) => {
                        return (
                            <div className="receiver" key={index}>
                                <FallbackLine containerStyle={{ height: '16px' }} lineStyle={{ width: "50%", height: '15px' }} />
                                <FallbackLine containerStyle={{ height: '16px' }} lineStyle={{ width: "35%", height: '15px' }} />
                                <FallbackLine containerStyle={{ height: '16px' }} lineStyle={{ width: "20%", height: '15px' }} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

