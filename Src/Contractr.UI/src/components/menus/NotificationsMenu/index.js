import React, { useState } from "react";
import NotificationIcon from "../../icons/notification-icon";
import NotificationMenuItem from "./components/NotificationMenuItem";

const NotificationsMenu = ({ user }) => {
  const [notification, setNotifications] = useState([
    {
      description: "This is a notification",
      time: "2022-08-19 03:33:33.130",
      status: "Information",
    },
  ]);
  const [showClass, setShowClass] = useState("");

  const onNotificationBellClick = () => {
    showClass == "" ? setShowClass("show") : setShowClass("");
  };
  const onClearNotifications = () => {
    setNotifications([]);
  };
  return (
    <li className="notifications dropdown">
      {notification.length > 0 && (
        <NotificationIcon count={notification.length} />
      )}
      <a
        onClick={() => onNotificationBellClick()}
        className="dropdown-toggle no-after"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
      >
        <i className="ti-bell"></i>
      </a>

      <ul
        className={`dropdown-menu ${showClass}`}
        aria-labelledby="dropdownMenuButton1"
      >
        <li className="pX-20 pY-15 bdB">
          <i className="ti-bell pR-10"></i>
          <span className="fsz-sm fw-600 c-grey-900">Notifications</span>
        </li>
        <li>
          {notification.length > 0 && (
            <ul className="ovY-a pos-r scrollable lis-n p-0 m-0 fsz-sm">
              {notification.map((n, i) => {
                return (
                  <NotificationMenuItem
                    description={n.description}
                    staus={n.status}
                    time={n.time}
                    key={i}
                  />
                );
              })}
            </ul>
          )}
          {notification.length <= 0 && (
            <div className="fsz-sm fw-600 c-grey-900" style={{textAlign:"center", padding:"20px"}}>You have no notifications</div>
          )}
        </li>
        {notification.length > 0 && (
        <li className="pX-20 pY-15 ta-c bdT">
          <span>
            <a
              onClick={() => onClearNotifications()}
              className="c-grey-600 cH-blue fsz-sm td-n"
            >
              Clear All Notifications{" "}
              <i className="ti-angle-right fsz-xs mL-10"></i>
            </a>
          </span>
        </li>
        )}
      </ul>
    </li>
  );
};
export default NotificationsMenu;
