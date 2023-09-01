import React from "react";

const Card = ({ children }) => {
  return (
    <div className="masonry-item">
      <div className="bd bgc-white">
        <div className="layers">
            {children}
        </div>
      </div>
    </div>
  );
};

export default Card;