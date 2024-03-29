import { Add } from "@mui/icons-material";
import { AvatarGroup, Button, Card } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import AppAvatar from "../avatars/AppAvatar";
import FlexBetween from "../flexbox/FlexBetween";
import FlexBox from "../flexbox/FlexBox";
import { H3, Small } from "../Typography";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; // component props interface

const ProjectCard3 = ({ project }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  return (
    <Link to="/dashboards/project-details">
      <Card>
        <Box
          sx={{
            height: 165,
            margin: "1rem",
            borderRadius: "8px",
            overflow: "hidden",
            "& img": {
              width: "100%",
              height: "100%",
              objectFit: "cover",
            },
          }}
        >
          <img src={project.thumbnail} alt="Project Thumbnail" />
        </Box>

        <Box padding={2} paddingTop={0}>
          <H3 mb={1}>{t(project.name)}</H3>
          <Small color="text.secondary" fontWeight={500} mb={2}>
            {project.description}
          </Small>

          <FlexBetween flexWrap="wrap" pt="1rem">
            <FlexBox alignItems="center" gap={1}>
              <AvatarGroup>
                <AppAvatar alt="Remy Sharp" src={project.teamMember[0]} />
                <AppAvatar alt="Travis Howard" src={project.teamMember[1]} />
              </AvatarGroup>

              <Button variant="dashed">
                <Add
                  fontSize="small"
                  sx={{
                    color: "grey.600",
                  }}
                />
              </Button>
            </FlexBox>

            <Small
              sx={{
                backgroundColor: "action.hover",
                padding: "5px 15px",
                borderRadius: "20px",
                color: "text.secondary",
                [theme.breakpoints.between(960, 1050)]: {
                  marginTop: 1,
                  width: "100%",
                  textAlign: "center",
                },
              }}
            >
              3 Weeks Left
            </Small>
          </FlexBetween>
        </Box>
      </Card>
    </Link>
  );
};

export default ProjectCard3;
