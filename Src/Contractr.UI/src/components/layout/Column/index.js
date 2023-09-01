import React from 'react';


const Column =(props) => {
    const { size, children } = props;
    return (
        <div className={`col-${size}`}>
            {children}
        </div>
    )
}

export default Column;