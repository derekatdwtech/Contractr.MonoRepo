import { NotificationsNone } from "@mui/icons-material";
import { Box, Button, Card, Grid, styled, useTheme } from "@mui/material";
import FlexBox from "../../components/flexbox/FlexBox";
import { H3 } from "../../components/Typography";
import PasswordIcon from "../../icons/PasswordIcon";
import ProfileIcon from "../../icons/ProfileIcon";
import Notifications from "./components/Notifications";
import Password from "./components/Password";
import UserInfo from "./components/UserInfo";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import convertToSlug from "../../convertSlug"; // styled component

const StyledButton = styled(Button)(() => ({
  fontSize: 12,
  borderRadius: 0,
  fontWeight: 500,
  position: "relative",
  padding: "0.6rem 1.5rem",
  justifyContent: "flex-start",
}));

const AccountSettings = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [active, setActive] = useState("user-info");
  const style = {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.secondary.light
        : theme.palette.divider,
    color: theme.palette.primary.main,
    "&::before": {
      width: 4,
      right: 0,
      content: '""',
      height: "100%",
      position: "absolute",
      backgroundColor: theme.palette.primary.main,
    },
  };
  return (
    <Box pt={2} pb={4}>
      <Grid container spacing={3}>
        <Grid item md={3} xs={12}>
          <Card
            sx={{
              padding: "1.5rem 0",
            }}
          >
            <H3 fontSize={14} mb={1} pl={3}>
              {t("User Profile")}
            </H3>

            <FlexBox
              flexDirection="column"
              sx={{
                [theme.breakpoints.between("sm", 960)]: {
                  flexWrap: "wrap",
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              }}
            >
              {tabList.map(({ id, name, Icon }) => (
                <StyledButton
                  key={id}
                  startIcon={
                    <Icon
                      sx={{
                        color: "text.secondary",
                      }}
                    />
                  }
                  onClick={() => setActive(convertToSlug(name))}
                  sx={
                    active === convertToSlug(name)
                      ? style
                      : {
                          "&:hover": style,
                        }
                  }
                >
                  {t(name)}
                </StyledButton>
              ))}
            </FlexBox>
          </Card>
        </Grid>

        <Grid item md={9} xs={12}>
          {active === convertToSlug(tabList[0].name) && <UserInfo />}
          {active === convertToSlug(tabList[1].name) && <Password />}
          {active === convertToSlug(tabList[2].name) && <Notifications />}
        </Grid>
      </Grid>
    </Box>
  );
};

const tabList = [
  {
    id: 1,
    name: "User Info",
    Icon: ProfileIcon,
  },
  
  {
    id: 2,
    name: "Password",
    Icon: PasswordIcon,
  },
   {
    id: 3,
    name: "Notifications",
    Icon: NotificationsNone,
  }
];
export default AccountSettings;
