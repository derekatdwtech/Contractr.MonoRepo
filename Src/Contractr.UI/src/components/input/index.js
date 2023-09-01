import React from "react";

const Input = (props) => {
  const { name, onChange, type = "text" } = props;
  return (
    <input
      type={type}
      className="form-control"
      id={`ctr_input_${name}`}
      name={name}
      {...props}
      onChange={onChange}
    />
  );
};

export default Input;
