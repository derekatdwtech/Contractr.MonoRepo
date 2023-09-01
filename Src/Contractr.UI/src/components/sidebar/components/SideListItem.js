import React from "react";
import { Link } from "react-router-dom";

const SidebarListItem = (props) => {
    /*
    ACTIVE CLASSNAME: `mT-30 actived`
    */
  return (
    <li className="nav-item mT-30 active">
      <Link className="siderbar-link" to={props.path}>
        {props.icon}
        <span className="title">{props.label}</span>
      </Link>
    </li>
  );
};

export default SidebarListItem;
