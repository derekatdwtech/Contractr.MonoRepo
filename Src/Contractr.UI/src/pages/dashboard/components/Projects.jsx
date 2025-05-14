import { Box, Button, Grid } from "@mui/material";
import { H5 } from "../../../components/Typography";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProjectCard from "../../../components/cards/ProjectCard";
import { useFetch } from "../../../hooks/useFetch";
import { config } from "../../../config";
import { useUserOrg } from "../../../context/UserOrgContext";

const Projects = () => {
  const { t } = useTranslation();
  const [deals, setDeals] = useState([]);
  const { organization } = useUserOrg();
  const { get } = useFetch();

  useEffect(() => {
    if(organization) {
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
    }
    
  }, [organization]);

  return (
    <Box pt={3} pb={5} px={3}>
      <H5 marginBottom={2}>{t("Current Deals")}</H5>

      <Grid container spacing={3}>
        {deals.length > 0 &&
          deals.map((item, index) => (
            <Grid item xs={12} sm={6} lg={4} key={index}>
              <ProjectCard deal={item} />
            </Grid>
          ))}
      </Grid>

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
      >
        {t("Load More")}
      </Button>
    </Box>
  );
};

const projectList = [
  {
    name: "Project Nightfall",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ut labore et dolore magna aliqua.",
    thumbnail: "/static/thumbnail/thumbnail-1.png",
    teamMember: [
      "/static/avatar/010-girl-1.svg",
      "/static/avatar/011-man-2.svg",
    ],
  },
  {
    name: "Project Nightfall",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor ut labore et dolore magna aliqua.",
    thumbnail: "/static/thumbnail/thumbnail-2.png",
    teamMember: [
      "/static/avatar/013-woman-3.svg",
      "/static/avatar/012-woman-2.svg",
    ],
  },
];
export default Projects;
