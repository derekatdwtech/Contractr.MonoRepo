import React from 'react';

const Select = (props) => {

  return (
    <select
      className="form-control"
      value={props.selectedValue}
      onSelect={props.onChange}
      name={props.name}
    >
      <option>{props.defaultOption}</option>
      {props.options.map((o, i) => {
        return (
          <option key={i} value={o}>
            {o}
          </option>
        );
      })}
    </select>
  );
};

export default Select;

Select.defaultProps = {
  options: [],
  defaultOption: "Choose an option",
};
