import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { config } from "../config";

export { useFetch };

function useFetch() {
  const { getAccessTokenSilently, isAuthenticated, loginWithRedirect } = useAuth0();
  const [accessToken, setAccessToken] = useState();

  return {
    get: request("GET"),
    post: request("POST"),
    patch: request("PATCH"),
    delete: request("DELETE"),
  };

  function request(method) {
    return async (
      url,
      body,
      requiresAuth = false,
      contentType = "application/json"
    ) => {
      return await getHeaders(requiresAuth).then((data) => {
        const requestOptions = {
          method,
          headers: data,
        };

        if (body) {
          if (contentType !== null) {
            requestOptions.headers["Content-Type"] = contentType;
          }

          if (contentType === null) {
            requestOptions.body = body;
          } else {
            requestOptions.body = JSON.stringify(body);
          }
        }
        console.log(`Executing ${method} on url ${url}.`, requestOptions);
        return fetch(url, requestOptions);
      });
    };
  }

  async function getHeaders(requiresAuth) {
    const token = accessToken;
    const hasToken = !!token;

    if (requiresAuth) {
      console.log(
        "Request requires authorization. Setting Authorization Headers"
      );
      if (hasToken) {
        return { Authorization: `Bearer ${token}`, credentials: "include" };
      } else {
        console.log("Retrieving access token.");
       
        return await getAccessTokenSilently({
          audience: config.AUTH0_AUDIENCE,
        })
          .then((token) => {
            console.log("Successfully retrieved access token.");
            setAccessToken(token);
            return { Authorization: `Bearer ${token}`, credentials: "include" };
          })
          .catch((err) => {
            console.error("Failed to retrieve access token", err);
            return {};
          });
      }
    } else {
      return {};
    }
  }
}
