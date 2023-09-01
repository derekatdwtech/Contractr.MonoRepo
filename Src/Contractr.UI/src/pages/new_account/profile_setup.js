import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import AppTextField from "../../components/input/AppTextField";
// import OrderSummery2 from "page-sections/ecommerce/OrderSummery2";
import { H2, H3 } from "../../components/Typography";
import { useFetch } from "../../hooks/useFetch";
import { config } from "../../config";
import toast from "react-hot-toast";

const ProfileSetup = ({ onCreateCallback, isProfileSetupShowing }) => {
  const { user } = useAuth0();
  const { t } = useTranslation();
  const { post } = useFetch();
  const [userInformation, setUserInformation] = useState({
    email: user.email,
    id: user.sub,
    is_active: true,
  });
  const [organizationInformation, setOrganizationInformation] = useState({
    owner: user.sub,
  });

  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

  const handleUserInformationChange = (e) => {
    setUserInformation((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleOrgInformationChange = (e) => {
    setOrganizationInformation((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const saveProfileInformation = () => {
    setSaveButtonDisabled(true);
    if (user.profile.id != undefined) {
      post(`${config.API_URL}/User`, userInformation, true)
        .then((r) => {
          if (r.ok) {
            console.log("Successfully created user.");
            return r.json();
          } else {
            setSaveButtonDisabled(false);
            throw new ErrorEvent("Failed to create user");
          }
        })
        .then((data) => {
          user.profile = data;
        })
        .catch((err) => {
          setSaveButtonDisabled(false);
          toast.error("Failed to add user", err);
        });
    }

    console.log("Creating Organization");
    post(`${config.API_URL}/organization`, organizationInformation, true)
      .then((res) => {
        if (res.ok) {
          onCreateCallback(!isProfileSetupShowing);
        }
      })
      .catch((e) => {
        console.error(e);
        setSaveButtonDisabled(false);
        toast.error("Failed to create organization", e);
      });
  };
  return (
    <Box pt={2} pb={4}>
      <Grid container spacing={3}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Card
            sx={{
              padding: 3,
            }}
          >
            <Grid item xs={12} pb={2}>
              <H2> Welcome to Contractr!</H2>
              <Typography>
                We show you're new here. To continue, please fill out your
                profile information and create your organization to begin.
              </Typography>
            </Grid>
            <Divider></Divider>
            <Grid container spacing={3} pt={2}>
              {user.profile.id === undefined && (
                <div>
                  <Grid item xs={12}>
                    <H3>User Information</H3>
                  </Grid>
                  <Grid item xs={7}>
                    <Box py={1}>
                      <AppTextField
                        label="First Name"
                        fullWidth
                        type="text"
                        name="first_name"
                        required
                        onChange={(e) => handleUserInformationChange(e)}
                      />
                    </Box>
                    <Box py={1}>
                      <AppTextField
                        label="Last Name"
                        fullWidth
                        type="text"
                        name="last_name"
                        required
                        onChange={(e) => handleUserInformationChange(e)}
                      />
                    </Box>
                    <Box py={1}>
                      <AppTextField
                        fullWidth
                        type="email"
                        name="email"
                        value={user.email}
                        disabled
                        onChange={(e) => handleUserInformationChange(e)}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={5}>
                    <img
                      alt=""
                      src="/static/illustration/crm-lead.svg"
                      style={{
                        padding: 30,
                        display: "block",
                        marginLeft: "auto",
                      }}
                    />
                  </Grid>
                </div>
              )}

              <Divider />
              <Grid item xs={12}>
                <H3>Organization Information</H3>
              </Grid>
              <Grid item md={12} xs={12}>
                <AppTextField
                  label="Organization Name"
                  fullWidth
                  name="name"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <AppTextField
                  label="Address"
                  fullWidth
                  name="address"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <AppTextField
                  label="Town/City"
                  fullWidth
                  name="city"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <AppTextField
                  label="State"
                  fullWidth
                  type="text"
                  name="state"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <AppTextField
                  label="Country"
                  fullWidth
                  type="text"
                  name="country"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <AppTextField
                  label="Zip Code"
                  fullWidth
                  type="number"
                  name="zip"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <AppTextField
                  label="Phone Number"
                  fullWidth
                  type="number"
                  name="Phone Number"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>
              <Grid item md={12} xs={12}>
                <Button
                  variant="contained"
                  sx={{
                    margin: "auto",
                    marginTop: 4,
                    fontWeight: 500,
                    display: "block",
                    textAlign: "center",
                    padding: "0.5rem 3rem",
                  }}
                  onClick={() => saveProfileInformation()}
                  disabled={saveButtonDisabled}
                >
                  {t("Save")}
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileSetup;
