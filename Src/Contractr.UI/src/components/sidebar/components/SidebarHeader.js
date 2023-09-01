import React from "react";
import Icon from "../../icons";

const SidebarHeader = () => {
  return (
    <div className="sidebar-logo">
      <div className="peers ai-c fxw-nw">
        <div className="peer peer-greed">
          <a className="sidebar-link td-n" href="index.html">
            <div className="peers ai-c fxw-nw">
              <div className="peer">
                <div className="logo">
                {/* <Icon variant={"star"} size={500} color={"deep-orange"} /> */}
                </div>
              </div>
              <div className="peer peer-greed">
                <h5 className="lh-1 mB-0 logo-text">Contractr.Law</h5>
              </div>
            </div>
          </a>
        </div>
        <div className="peer">
          <div className="mobile-toggle sidebar-toggle">
            <a href="#" className="td-n">
              <i className="ti-arrow-circle-left"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarHeader;