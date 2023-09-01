import { useAuth0 } from "@auth0/auth0-react";
import { config } from "../config";

export const GetToken = async () => {
  const { getAccessTokenSilently } = useAuth0();
  return await getAccessTokenSilently({
    audience: config.AUTH0_AUDIENCE,
  });
};
