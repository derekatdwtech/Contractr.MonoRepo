
import { withAuthenticationRequired } from "@auth0/auth0-react";
import React from "react";
import LoadingScreen from "../components/loaders/LoadingScreen";


export const ProtectedRoute = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <LoadingScreen />
    ),
  });

  return <Component />;
};
