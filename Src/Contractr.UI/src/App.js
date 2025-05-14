import { CssBaseline, ThemeProvider } from "@mui/material";
import { useUserOrg } from "./context/UserOrgContext";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import routes from "./route";
import { useAuth0 } from "@auth0/auth0-react";
import { config } from "./config";
import { useFetch } from "./hooks/useFetch";
import { useState } from "react";
import { useEffect } from "react";
import useSettings from "./hooks/useSettings";
import { createCustomTheme } from "./theme";
import { useRoutes } from "react-router-dom";
import LoadingScreen from "./components/loaders/LoadingScreen";

function App() {
  const { get, post } = useFetch();
//  const { user, isLoading, loginWithRedirect } = useAuth0();
  const { settings } = useSettings();
  const theme = createCustomTheme({
    theme: settings.theme,
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
  });
  // const [isApiLoading, setIsApiLoading] = useState(true);
  const content = useRoutes(routes());
  const { userProfile, organization, loading } = useUserOrg();

  // const getUserProfile = async () => {
  //   if (!isLoading) {
  //     if (user?.profile == undefined) {
  //       get(`${config.API_URL}/User`, null, true)
  //         .then((res) => {
  //           if (res.ok) {
  //             return res.json();
  //           } else {
  //             console.error("User not found.");
  //           }
  //         })
  //         .then((data) => {
  //           user.profile = data;
  //         });
  //     }
  //   }
  // };
  // const getOrganizationForUser = async () => {
  //   console.log("Getting organization");
  //   get(`${config.API_URL}/Organization/owner`, null, true)
  //     .then((res) => {
  //       if (res.status === 200) {
  //         return res.json();
  //       } else if (res.status === 404) {
  //         console.log("Organization is not found. Initiating setup.");
  //         setIsApiLoading(false);
  //       }
  //       return res.json();
  //     })
  //     .then((data) => {
  //       setOrganization(data);
  //       setIsApiLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  useEffect(() => {
    // async function Call() {
    //   if (!isLoading && !user) {
    //     await loginWithRedirect();
    //   } else {
    //     await getUserProfile();
    //     await getOrganizationForUser();
    //   }
    // }

    // Call();
  }, [loading]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
          <CssBaseline />
          {loading ? <LoadingScreen /> : content}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
