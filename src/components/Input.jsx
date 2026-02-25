import React from 'react';

const Input = ({ label, id, error, className = '', ...props }) => (
    <div className={`field ${error ? 'field-error' : ''} ${className}`}>
        {label && <label htmlFor={id}>{label}</label>}
        <input id={id} {...props} />
        {error && <span className="error-text">{error}</span>}
    </div>
);

export default Input;
