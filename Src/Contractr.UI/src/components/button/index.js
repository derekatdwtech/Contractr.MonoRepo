import React from 'react';

const Button =({children, variant, onClick}) => {
    return (
        <button className={`btn btn-${variant}`} type="button" onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;