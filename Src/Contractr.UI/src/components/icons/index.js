import React from "react";
import PropTypes from 'prop-types';
import { IconList } from "./data/validProps";

const Icon = (props) => {
  return (
    <span className="icon-holder">
      <i className={`c-${props.color}-${props.size} ti-${props.variant.toLowerCase()}`}></i>
    </span>
  );
};

 Icon.propTypes = {
    variant: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.oneOf(IconList)
    ]),
    color: PropTypes.string,
    size: PropTypes.number
 }

 Icon.defaultProps = {
    variant: "home",
    color: "blue",
    size: 500
 }

 export default Icon;