import React from "react";
import { routes } from "../../route";
import SidebarHeader from "./components/SidebarHeader";
import SidebarListItem from "./components/SideListItem";

const Sidebar = (props) => {
  const generateSidebarLinks = (routes) => {
    return routes.map((route) => route.showNavbar ? (
      <SidebarListItem
        icon={route.icon}
        label={route.name}
        path={route.path}
        key={route.name.toLowerCase()}
      />
    ): null);
  };
  
  return (
    <div className="sidebar">
      <div className="sidebar-inner">
        <SidebarHeader />
        <ul className="sidebar-menu scrollable pos-r">
          {generateSidebarLinks(routes)}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
