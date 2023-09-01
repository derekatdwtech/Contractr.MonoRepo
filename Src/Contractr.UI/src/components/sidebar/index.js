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
          {/* <li className="nav-item dropdown">
            <a className="dropdown-toggle" href="javascript:void(0);">
              <span className="icon-holder">
                <i className="c-orange-500 ti-layout-list-thumb"></i>
              </span>
              <span className="title">Tables</span>
              <span className="arrow">
                <i className="ti-angle-right"></i>
              </span>
            </a>
            <ul className="dropdown-menu">
              <li>
                <a className="sidebar-link" href="basic-table.html">
                  Basic Table
                </a>
              </li>
              <li>
                <a className="sidebar-link" href="datatable.html">
                  Data Table
                </a>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a className="dropdown-toggle" href="javascript:void(0);">
              <span className="icon-holder">
                <i className="c-purple-500 ti-map"></i>
              </span>
              <span className="title">Maps</span>
              <span className="arrow">
                <i className="ti-angle-right"></i>
              </span>
            </a>
            <ul className="dropdown-menu">
              <li>
                <a href="google-maps.html">Google Map</a>
              </li>
              <li>
                <a href="vector-maps.html">Vector Map</a>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a className="dropdown-toggle" href="javascript:void(0);">
              <span className="icon-holder">
                <i className="c-red-500 ti-files"></i>
              </span>
              <span className="title">Pages</span>
              <span className="arrow">
                <i className="ti-angle-right"></i>
              </span>
            </a>
            <ul className="dropdown-menu">
              <li>
                <a className="sidebar-link" href="blank.html">
                  Blank
                </a>
              </li>
              <li>
                <a className="sidebar-link" href="404.html">
                  404
                </a>
              </li>
              <li>
                <a className="sidebar-link" href="500.html">
                  500
                </a>
              </li>
              <li>
                <a className="sidebar-link" href="signin.html">
                  Sign In
                </a>
              </li>
              <li>
                <a className="sidebar-link" href="signup.html">
                  Sign Up
                </a>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <a className="dropdown-toggle" href="javascript:void(0);">
              <span className="icon-holder">
                <i className="c-teal-500 ti-view-list-alt"></i>
              </span>
              <span className="title">Multiple Levels</span>
              <span className="arrow">
                <i className="ti-angle-right"></i>
              </span>
            </a>
            <ul className="dropdown-menu">
              <li className="nav-item dropdown">
                <a href="javascript:void(0);">
                  <span>Menu Item</span>
                </a>
              </li>
              <li className="nav-item dropdown">
                <a href="javascript:void(0);">
                  <span>Menu Item</span>
                  <span className="arrow">
                    <i className="ti-angle-right"></i>
                  </span>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a href="javascript:void(0);">Menu Item</a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">Menu Item</a>
                  </li>
                </ul>
              </li>
            </ul>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
