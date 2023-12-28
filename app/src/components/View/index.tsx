import './view.scss';

import React, { CSSProperties, ReactNode } from 'react';

interface ViewProps {
    children: ReactNode;
    className?: string;
    id?: string;
    style?: CSSProperties;
}

export const View: React.FC<ViewProps> = ({ children, className, id, style }) => {
    return (
        <div id={id} className={`view-wrapper ${className ?? ''}`} style={style}>
            {children}
        </div>
    );
};
