import React, { useContext, useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import { TabContext, TabList } from "@mui/lab";
import {
  Button,
  Card,
  Grid,
  Tab,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import FlexBox from "../../components/flexbox/FlexBox";
import useModal from "../../components/modal/usemodal";
import { OrganizationContext } from "../../context/OrganizationContext";
import { useFetch } from "../../hooks/useFetch";
import { config } from "../../config";
import { H2 } from "../../components/Typography";
import SearchInput from "../../components/input/search/SearchInput";
import ProjectCard from "../../components/cards/ProjectCard";
import CreateProject from "../../components/modal/CreateProject";

const DealsPage = () => {
  const [value, setValue] = useState("0");
  const downSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handleChange = (_, newValue) => {
    setValue(newValue);
  }; // search input
  const [openModal, setOpenModal] = useState(false);
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState({});
  const onDealCreate = (deal) => {
    setDeals(deals.concat(deal));
    setSelectedDeal(deal);
    setOpenModal(!openModal);
  };

  const { organization } = useContext(OrganizationContext);
  const { get } = useFetch();

  useEffect(() => {
    get(`${config.API_URL}/deal?organization=${organization.id}`, null, true)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        return [];
      })
      .then((data) => {
        if (data.length > 0) {
          console.log(data);
          setDeals(data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [organization.id]);

  return (
    <Box pt={2} pb={4}>
      <TabContext value={value}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card
              sx={{
                padding: ".1rem 2rem",
                height: "100%",
              }}
            >
              <FlexBox
                height="100%"
                alignItems="center"
                justifyContent="space-between"
              >
                <H2>{organization.name}</H2>
              </FlexBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <FlexBox justifyContent="space-between" flexWrap="wrap">
              <SearchInput
                disable_border="true"
                placeholder="Find Deals"
                sx={{
                  maxWidth: downSM ? "100%" : 270,
                  marginBottom: downSM ? 1 : 0,
                }}
              />
              <Button
                fullWidth={downSM}
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenModal(true)}
                sx={{
                  fontSize: 12,
                }}
              >
                New Deal
              </Button>
              <CreateProject
                open={openModal}
                setOpen={setOpenModal}
                onCreateCallBack={(d) => onDealCreate(d)}
              />
            </FlexBox>
          </Grid>
        </Grid>

        <Grid container spacing={3} pt={4}>
          {deals.length > 0 &&
            deals.map((item, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <ProjectCard deal={item} />
              </Grid>
            ))}
          {deals.length === 0 && (
            <Grid
              item
              xs={12}
              sm={12}
              lg={12}
              alignContent="flex-start"
              alignItems="flex-start"
              justify="flex-start"
            >
              <Typography>
                You haven't started any deals yet. Click 'New Deal' to start a
                new deal.
              </Typography>
            </Grid>
          )}

          {/* <MoreOptions
            anchorEl={projectMoreEl}
            handleMoreClose={handleProjectMoreClose}
          /> */}
        </Grid>
      </TabContext>
    </Box>
  );
};
export default DealsPage;
