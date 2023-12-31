import * as React from 'react'
import './connection.scss';
import { FallbackLine } from '../FallbackLine'


export const ConnectionsFallBack = () => {

    return (
        <>
        <FallbackLine containerStyle={{ height: '16px' ,display:'flex',justifyContent:'center'}} lineStyle={{ width: "50%", height: '15px' }} />
            <div className='connection-list-fallback'>
                {
                    Array.from({ length: 3 }).map((_, index) => {
                        return (
                            <div className='connection' key={index}>
                                <div className='avatar'>
                                    <FallbackLine lineStyle={{ height: '40px', width: "40px", borderRadius: "50%" }} />
                                </div>
                                <div className='content' style={{ width: '100%' }}>
                                    <FallbackLine containerStyle={{ height: '16px' }} lineStyle={{ width: "50%", height: '15px' }} />
                                    <FallbackLine containerStyle={{ height: '14px' }} lineStyle={{ width: '75%', height: '14px' }} />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
};

