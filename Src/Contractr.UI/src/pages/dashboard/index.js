import LayoutBodyWrapper from "../../components/layout/LayoutBodyWrapper";
import { Fragment, useContext, useEffect, useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import DashboardSidebar from "./components/DashboardSidebar";
import ProfileSetup from "../new_account/profile_setup";
import { Outlet } from "react-router-dom";
import { useUserOrg } from "../../context/UserOrgContext";


const DashboardLayout = ({ children }) => {
  const { userProfile, organization, loading } = useUserOrg();
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [showMobileSideBar, setShowMobileSideBar] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const handleCompactToggle = () => setSidebarCompact(!sidebarCompact);

  const handleMobileDrawerToggle = () =>
    setShowMobileSideBar((state) => !state); // dashboard body wrapper custom style

  const customStyle = {
    width: `calc(100% - ${sidebarCompact ? "86px" : "280px"})`,
    marginLeft: sidebarCompact ? "86px" : "280px",
  };

  useEffect(() => {
    if(organization === null) {
        setShowProfileSetup(true);
    }
  }, [organization]);
  
  return (
    <Fragment>
      <DashboardSidebar
        sidebarCompact={sidebarCompact}
        showMobileSideBar={showMobileSideBar}
        setSidebarCompact={handleCompactToggle}
        setShowMobileSideBar={handleMobileDrawerToggle}
      />

      <LayoutBodyWrapper sx={customStyle}>
        <DashboardHeader
          setShowSideBar={handleCompactToggle}
          setShowMobileSideBar={handleMobileDrawerToggle}
        />

        {showProfileSetup ? <ProfileSetup isProfileSetupShowing={showProfileSetup} onCreateCallback={(c) => setShowProfileSetup(c)}/> : children || <Outlet />}
      </LayoutBodyWrapper>
    </Fragment>
  );
};

export default DashboardLayout;
