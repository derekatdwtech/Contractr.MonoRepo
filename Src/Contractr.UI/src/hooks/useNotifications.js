import { useState } from "react";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const postNotification = (notification) => {
    let merged = notifications.concat(JSON.parse(notification));
    console.log(merged);
    setNotifications(merged);
  };

  return [notifications, postNotification];
};

export default useNotifications;
