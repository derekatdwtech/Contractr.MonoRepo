import React from "react";
import NavBar from "../../navbar";
import Sidebar from "../../sidebar";

const MainLayout = ({ children, user }) => {
  return (
    <div>
      <Sidebar />
      <div className="page-container">
        <NavBar auth={user}/>
        <main className="main-content bgc-grey-100">
          <div className="row gap-20 masonry pos-r">
            <div className="masonry-sizer col-md-6"></div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
