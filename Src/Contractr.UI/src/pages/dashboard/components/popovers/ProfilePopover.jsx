import {
  Badge,
  Box,
  ButtonBase,
  Divider,
  styled,
  useMediaQuery,
} from "@mui/material";
import AppAvatar from "../../../../components/avatars/AppAvatar";
import { Small } from "../../../../components/Typography";
import { Fragment, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import PopoverLayout from "./PopoverLayout"; // styled components
import { useAuth0 } from "@auth0/auth0-react";
import {useEffect} from 'react';

const StyledButtonBase = styled(ButtonBase)(({ theme }) => ({
  padding: 5,
  marginLeft: 4,
  borderRadius: 30,
  border: `1px solid ${theme.palette.divider}`,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));
const StyledSmall = styled(Small)(({ theme }) => ({
  display: "block",
  cursor: "pointer",
  padding: "5px 1rem",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ProfilePopover = () => {
  const anchorRef = useRef(null);
  const navigate = useNavigate();
  const { logout, user } = useAuth0();
  const [open, setOpen] = useState(false);
  const upSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  const handleMenuItem = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {

  }, [user]);

  let fullName = user.profile != undefined ? `${user.profile.first_name} ${user.profile.last_name}` : user.email;
  return (
    
    <Fragment>
      <StyledButtonBase
        disableRipple
        ref={anchorRef}
        onClick={() => setOpen(true)}
      >
        <Badge
          overlap="circular"
          variant="dot"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          sx={{
            alignItems: "center",
            "& .MuiBadge-badge": {
              width: 11,
              height: 11,
              right: "4%",
              borderRadius: "50%",
              border: "2px solid #fff",
              backgroundColor: "success.main",
            },
          }}
        >
          {upSm && (
            <Small mx={1} color="text.secondary">
              Hi,{" "}
              <Small fontWeight="600" display="inline">
                {fullName}
              </Small>
            </Small>
          )}
          <AppAvatar
            src={user?.picture || "/static/avatar/001-man.svg"}
            sx={{
              width: 28,
              height: 28,
            }}
          />
        </Badge>
      </StyledButtonBase>

      <PopoverLayout
        hiddenViewButton
        maxWidth={300}
        minWidth={200}
        popoverOpen={open}
        anchorRef={anchorRef}
        popoverClose={() => setOpen(false)}
        title={
          "Settings"
        }
      >
        <Box pt={2}>
          
          <StyledSmall onClick={() => handleMenuItem("/account")}>
            Profile & Account
          </StyledSmall>

          <StyledSmall onClick={() => handleMenuItem("/org")}>
            Organization
          </StyledSmall>

          <StyledSmall
            onClick={() => handleMenuItem("/org")}
          >
            Manage Team
          </StyledSmall>

          <Divider
            sx={{
              my: 1,
            }}
          />

          <StyledSmall
            onClick={() => {
              handleLogout();
              toast.error("You Logout Successfully");
            }}
          >
            Sign Out
          </StyledSmall>
        </Box>
      </PopoverLayout>
    </Fragment>
  );
};

export default ProfilePopover;
