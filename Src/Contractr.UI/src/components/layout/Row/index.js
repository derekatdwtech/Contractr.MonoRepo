import React from "react";

const Row = ({ children, props }) => {
  return <div className="row gap-20 masonry pos-r" {...props}>{children}</div>;
};
export default Row;
