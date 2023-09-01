import { CssBaseline, ThemeProvider } from "@mui/material";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import routes from "./route";
import { useAuth0 } from "@auth0/auth0-react";
import { config } from "./config";
import { useFetch } from "./hooks/useFetch";
import { useState } from "react";
import { useEffect } from "react";
import { OrganizationContext } from "./context/OrganizationContext";
import useSettings from "./hooks/useSettings";
import { createCustomTheme } from "./theme";
import { useRoutes } from "react-router-dom";
import LoadingScreen from "./components/loaders/LoadingScreen";

function App() {
  const { get, post } = useFetch();
  const { user, isLoading, loginWithRedirect, isAuthenticated } = useAuth0();
  const { settings } = useSettings();
  const [organization, setOrganization] = useState({});
  const theme = createCustomTheme({
    theme: settings.theme,
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
  });
  const [isApiLoading, setIsApiLoading] = useState(true);
  const content = useRoutes(routes());

  const getUserProfile = async () => {
    if (!isLoading) {
      if (user?.profile == undefined) {
        get(`${config.API_URL}/User`, null, true)
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              console.error("User not found.");
            }
          })
          .then((data) => {
            user.profile = data;
          });
      }
    }
  };
  const getOrganizationForUser = async () => {
    console.log("Getting organization");
    get(`${config.API_URL}/Organization/owner`, null, true)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else if (res.status === 404) {
          console.log("Organization is not found. Initiating setup.");
          setIsApiLoading(false);
        }
        return res.json();
      })
      .then((data) => {
        setOrganization(data);
        setIsApiLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
       loginWithRedirect();
    } else {
       getUserProfile();
       getOrganizationForUser();
    }
  }, [isAuthenticated]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <OrganizationContext.Provider value={{ organization }}>
          <CssBaseline />
          {isLoading || isApiLoading ? <LoadingScreen /> : content}
        </OrganizationContext.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
