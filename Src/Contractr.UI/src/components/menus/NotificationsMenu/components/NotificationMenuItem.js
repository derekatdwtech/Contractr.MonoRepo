import React from "react";
import TimeSpan from "../../../text/TimeSpan";

const NotificationMenuItem = ({ status, description, time }) => {
    const dateTime = new Date(time);
  return (
    <li>
      <a
        href=""
        className="peers fxw-nw td-n p-20 bdB c-grey-800 cH-blue bgcH-grey-100"
      >
        <div className="peer mR-15">
          <img
            className="w-3r bdrs-50p"
            src="https://randomuser.me/api/portraits/men/2.jpg"
            alt=""
          />
        </div>
        <div className="peer peer-greed">
          <span>
            <span className="fw-500">{status}</span>
            <span className="c-grey-600">
             {description}
            </span>
          </span>
          <p className="m-0">
            <small className="fsz-xs"><TimeSpan date={dateTime} /></small>
          </p>
        </div>
      </a>
    </li>
  );
};
export default NotificationMenuItem;