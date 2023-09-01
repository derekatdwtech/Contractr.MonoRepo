import { TabContext, TabList } from "@mui/lab";
import { Button, styled, Tab } from "@mui/material";
import { Box } from "@mui/system";
import FlexBox from "../../../components/flexbox/FlexBox";
import { H5 } from "../../../components/Typography";
import IconWrapper from "../../../components/IconWrapper";
import Add from "../../../icons/Add";
import GroupSenior from "../../../icons/GroupSenior";
import { useTranslation } from "react-i18next"; // styled components

const Wrapper = styled(Box)(() => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
}));
const TabListWrapper = styled(TabList)(({ theme }) => ({
  [theme.breakpoints.down(727)]: {
    order: 3,
  },
})); // --------------------------------------------------------------------

// --------------------------------------------------------------------
const HeadingArea = ({ value, changeTab }) => {
  const { t } = useTranslation();
  return (
    <Wrapper gap={1}>
      <FlexBox alignItems="center">
        <IconWrapper>
          <GroupSenior
            sx={{
              color: "primary.main",
            }}
          />
        </IconWrapper>
        <H5>{t("Users")}</H5>
      </FlexBox>

      

      <Button variant="contained" startIcon={<Add />}>
        {t("Add New User")}
      </Button>
    </Wrapper>
  );
};

export default HeadingArea;
