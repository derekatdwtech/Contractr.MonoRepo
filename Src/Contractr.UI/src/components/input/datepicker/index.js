import React from "react";
import "bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";

const DatePicker = (props) => {
    const {name, onChange, selectedValue } = props;
    const defaultValue = new Date(Date.now()).toLocaleDateString();
  return (
    <div className="timepicker-input input-icon mb-3">
      <div className="input-group">
        <div className="input-group-text bgc-white bd bdwR-0">
          <i className="ti-calendar"></i>
        </div>
        <input
          type="text"
          className="form-control bdc-grey-200"
          data-provide="datepicker"
          name={name}
          onSelect={onChange}
          value={selectedValue ? selectedValue : defaultValue}
          {...props}
        />
      </div>
    </div>
  );
};
export default DatePicker;
