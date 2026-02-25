import React from 'react';

const Badge = ({ type = 'gray', children, className = '' }) => (
    <span className={`badge badge-${type} ${className}`}>{children}</span>
);

export default Badge;
