import './fallbackLine.scss';

import React from 'react';

export const FallbackLine = ({ lineStyle, containerStyle, className }: { lineStyle?: React.CSSProperties; containerStyle?: React.CSSProperties; className?: string }) => {
    return (
        <div className={`fall-back-wrapper ${className ?? ''}`} style={containerStyle}>
            <div className="fall-back-line" style={lineStyle}></div>
        </div>
    );
};
