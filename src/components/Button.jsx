import React from 'react';

const Button = ({ variant = 'primary', size = 'md', children, className = '', ...props }) => (
    <button className={`btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''} ${className}`} {...props}>
        {children}
    </button>
);

export default Button;
