import React from "react";

const SmallDataCard = (props) => {
    const {title, data, color} = props;
  return (
    <div className="layers bd bgc-white p-20">
      <div className="layer w-100 mB-10">
        <h6 className="lh-1">{title}</h6>
      </div>
      <div className="layer w-100">
        <div className="peers ai-sb fxw-nw">
          <div className="peer peer-greed">
            <span id="sparklinedash"></span>
          </div>
          <div className="peer">
            <span className={`d-ib lh-0 va-m fw-600 bdrs-10em pX-15 pY-15 bgc-${color}-50 c-${color}-500`}>
              {data}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmallDataCard;
