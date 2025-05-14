import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import AppTextField from "../../components/input/AppTextField";
// import OrderSummery2 from "page-sections/ecommerce/OrderSummery2";
import { H2, H3 } from "../../components/Typography";
import { useFetch } from "../../hooks/useFetch";
import { config } from "../../config";
import toast from "react-hot-toast";
import { useUserOrg } from "../../context/UserOrgContext";

const ProfileSetup = ({ onCreateCallback, isProfileSetupShowing }) => {
  const { userProfile, auth0User } = useUserOrg();
  const { t } = useTranslation();
  const { post, put } = useFetch();
  const [userInformation, setUserInformation] = useState({
    email: auth0User.email,
    id: auth0User.sub,
    is_active: true,
  });
  const [organizationInformation, setOrganizationInformation] = useState({
    owner: userProfile.sub,
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

  const saveProfileInformation = async () => {
    setSaveButtonDisabled(true);
    if (!userProfile.id) {
      await post(`${config.API_URL}/User`, userInformation, true)
        .then((r) => {
          if (r.ok) {
            console.log("Successfully updated userProfile.");
            return r.json();
          } else {
            setSaveButtonDisabled(false);
            throw new ErrorEvent("Failed to update user");
          }
        })
        .then((data) => {
          userProfile = data;
        })
        .catch((err) => {
          setSaveButtonDisabled(false);
          toast.error("Failed to update user", err);
        });
    }

    console.log("Creating Organization");
    await post(`${config.API_URL}/Organization`, organizationInformation, true)
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
          <Card sx={{ padding: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <H2>Welcome to Contractr!</H2>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  We show you're new here. To continue, please fill out your
                  profile information and create your organization to begin.
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {userProfile.id === undefined && (
                <>
                  <Grid item xs={12}>
                    <H3>User Information</H3>
                  </Grid>
                  
                  <Grid item xs={12} md={7}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <AppTextField
                          label="First Name"
                          fullWidth
                          type="text"
                          name="first_name"
                          required
                          onChange={(e) => handleUserInformationChange(e)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <AppTextField
                          label="Last Name"
                          fullWidth
                          type="text"
                          name="last_name"
                          required
                          onChange={(e) => handleUserInformationChange(e)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <AppTextField
                          fullWidth
                          type="email"
                          name="email"
                          value={auth0User.email}
                          disabled
                          onChange={(e) => handleUserInformationChange(e)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                </>
              )}

              <Grid item xs={12}>
                <H3>Organization Information</H3>
              </Grid>
              <Grid item xs={12} md={6}>
                <AppTextField
                  label="Organization Name"
                  fullWidth
                  name="name"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <AppTextField
                  label="Phone Number"
                  fullWidth
                  type="tel"
                  name="phone"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>

              <Grid item xs={12}>
                <AppTextField
                  label="Address"
                  fullWidth
                  name="address"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <AppTextField
                  label="Town/City"
                  fullWidth
                  name="city"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <AppTextField
                  label="State"
                  fullWidth
                  type="text"
                  name="state"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <AppTextField
                  label="Country"
                  fullWidth
                  type="text"
                  name="country"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <AppTextField
                  label="Zip Code"
                  fullWidth
                  type="text"
                  name="zip"
                  required
                  onChange={(e) => handleOrgInformationChange(e)}
                />
              </Grid>

              <Grid item xs={12} sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => saveProfileInformation()}
                  disabled={saveButtonDisabled}
                  sx={{
                    py: 1.5,
                    maxWidth: '400px',
                    margin: '0 auto',
                    display: 'block'
                  }}
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
