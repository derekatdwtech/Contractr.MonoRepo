import { SwitchUnstyled, switchUnstyledClasses } from "@mui/core";
import { Box, Button, Card, Chip, Grid, Stack, styled } from "@mui/material";
import FlexBox from "components/flexbox/FlexBox";
import { H2, H5, H6, Small, Span } from "components/Typography";
import DoneIcon from "icons/DoneIcon";
import FolderSpecial from "icons/FolderSpecial";
import Layers from "icons/Layers";
import Premium from "icons/Premium";
// styled components
const CustomSwitchStyle = styled("span")(({ theme }) => ({
  width: 52,
  height: 24,
  fontSize: 0,
  cursor: "pointer",
  position: "relative",
  display: "inline-block",
  [`&.${switchUnstyledClasses.disabled}`]: {
    opacity: 0.4,
    cursor: "not-allowed",
  },
  [`& .${switchUnstyledClasses.track}`]: {
    width: "100%",
    height: "100%",
    display: "block",
    borderRadius: 26,
    position: "absolute",
    backgroundColor: theme.palette.grey[600],
  },
  [`& .${switchUnstyledClasses.thumb}`]: {
    top: 3,
    left: 3,
    width: 18,
    height: 18,
    display: "block",
    borderRadius: 16,
    position: "relative",
    backgroundColor: "#fff",
    transition: "all 200ms ease",
  },
  [`&.${switchUnstyledClasses.focusVisible} .${switchUnstyledClasses.thumb}`]: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    boxShadow: "0 0 1px 8px rgba(0, 0, 0, 0.25)",
  },
  [`&.${switchUnstyledClasses.checked}`]: {
    [`.${switchUnstyledClasses.thumb}`]: {
      top: 3,
      left: 30,
      backgroundColor: "#fff",
    },
    [`.${switchUnstyledClasses.track}`]: {
      backgroundColor: theme.palette.primary.main,
    },
  },
  [`& .${switchUnstyledClasses.input}`]: {
    top: 0,
    left: 0,
    margin: 0,
    zIndex: 1,
    opacity: 0,
    width: "100%",
    height: "100%",
    cursor: "inherit",
    position: "absolute",
  },
}));

const Pricing = () => {
  return (
    <Box pt={2} pb={4}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack alignItems="center" mb={4}>
            <H2 mb={2}>Pricing Plans</H2>
            <FlexBox alignItems="center" gap={2}>
              <H5>Monthly</H5>
              <SwitchUnstyled component={CustomSwitchStyle} />
              <H5>Annually</H5>
            </FlexBox>
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Stack
            direction="row"
            flexWrap="wrap"
            gap={3}
            justifyContent="center"
          >
            <SingleCard
              price={49}
              type="Month"
              Icon={Layers}
              planName="Basic"
              iconColor="warning"
              description="Perfect plan for starters"
              features={[
                "One Project",
                "Share it with 5 team members",
                "Sync across device",
              ]}
            />
            <SingleCard
              price={99}
              type="Month"
              planName="Standard"
              iconColor="primary"
              Icon={FolderSpecial}
              description="For users who want to do more"
              features={[
                "One Project",
                "Share it with 5 team members",
                "Sync across device",
                "Components included",
                "30 day version history",
              ]}
            />
            <SingleCard
              price={149}
              type="Month"
              Icon={Premium}
              iconColor="info"
              planName="Premium"
              description="Advance features for pros"
              features={[
                "One Project",
                "Share it with 5 team members",
                "Sync across device",
                "300+ components",
                "30 day version history",
              ]}
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Pricing; // ---------------------------------------------------------------

// ---------------------------------------------------------------
function SingleCard({
  planName,
  price,
  type,
  description,
  features,
  iconColor,
  Icon,
}) {
  return (
    <Card
      sx={{
        borderRadius: "40px",
        padding: 3,
        width: 290,
      }}
    >
      <Chip
        label={
          <Icon
            sx={{
              color: `${iconColor}.main`,
              display: "block",
            }}
          />
        }
        sx={{
          width: 35,
          height: 35,
          borderRadius: "4px",
          "& .MuiChip-label": {
            padding: 0,
          },
          backgroundColor: `${iconColor}.light`,
        }}
      />

      <H2 mt={2}>
        ${price}
        <Span fontSize={12} color="text.secondary">
          / {type}
        </Span>
      </H2>

      <H2 mt={2}>{planName}</H2>
      <H6 fontSize={12} color="text.secondary">
        {description}
      </H6>
      <Stack minHeight={200} mt={3} spacing={1.5}>
        {features.map((item, index) => (
          <FlexBox alignItems="end" gap={1} key={index}>
            <DoneIcon color="success" />
            <Small fontSize={13}>{item}</Small>
          </FlexBox>
        ))}
      </Stack>

      <Button
        variant="outlined"
        fullWidth
        sx={{
          borderColor: "primary.main",
          color: "primary.main",
          borderRadius: 25,
        }}
      >
        Get Started
      </Button>
    </Card>
  );
}
