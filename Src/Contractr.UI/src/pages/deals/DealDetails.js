import { Add, MoreHoriz } from "@mui/icons-material";
import {
  AvatarGroup,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  styled,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import LinearProgress from "@mui/material/LinearProgress";
import AppAvatar from "../../components/avatars/AppAvatar";
import FlexBetween from "../../components/flexbox/FlexBetween";
import FlexBox from "../../components/flexbox/FlexBox";
import RoundCheckBox from "../../components/RoundCheckBox";
import { H3, H5, H6, Small, Tiny } from "../../components/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { config } from "../../config";
import DocumentsTable from "../documents/components/documentsTable";
const StyledAvatar = styled(AppAvatar)(() => ({
  width: 36,
  height: 36,
  borderColor: "transparent",
  backgroundColor: "transparent",
}));
const RightContentWrapper = styled(Box)(() => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));
const StyledSmall = styled(Small)(({ theme, type }) => ({
  fontSize: 12,
  color: "white",
  padding: "4px 10px",
  borderRadius: "4px",
  backgroundColor:
    type === "success"
      ? theme.palette.success.main
      : theme.palette.primary.main,
}));
const DealDetailsPage = () => {
  const { id } = useParams();
  const { get } = useFetch();
  const [deal, setDeal] = useState({});

  const getDealById = () => {
    get(`${config.API_URL}/deal/${id}`, null, true)
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
      })
      .then((data) => {
        setDeal(data);
      });
  };

  useEffect(() => {
    getDealById();
  }, [id]);

  return (
    <Box pt={2} pb={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <Box padding={3}>
              <StyledSmall type="Open">{deal.status}</StyledSmall>
              <FlexBetween>
                <H3 mb={1} mt={1}>
                  {deal.unique_name}{" "}
                </H3>

                <IconButton
                  sx={{
                    padding: 0,
                  }}
                >
                  <MoreHoriz />
                </IconButton>


              </FlexBetween>

              <Small color="text.secondary">{deal.description}</Small>
            </Box>

            <Divider />

            <Box padding={3}>
              <Grid container spacing={3}>
                <Grid item sm={12} xs={12}>
                  <FlexBox
                    justifyContent="space-between"
                    flexWrap="wrap"
                    mb={3.5}
                  >
                    <H5 mb={3}>Tasks</H5>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={() => console.log("Pressed")}
                      sx={{
                        fontSize: 12,
                      }}
                    >
                      Create Task
                    </Button>
                  </FlexBox>
                  {tasks.map((task) => (
                    <FormControlLabel
                      key={task.title}
                      control={
                        <RoundCheckBox checked={task.status === "Completed"} />
                      }
                      label={
                        <Box>
                          <H6 lineHeight={1} mb={0.3}>
                            {task.title}
                          </H6>
                          <Tiny color="text.secondary" fontWeight={500}>
                            {task.status}
                          </Tiny>
                        </Box>
                      }
                      sx={{
                        margin: 0,
                        width: "100%",
                        cursor: "default",
                        paddingBottom: 1.5,
                        alignItems: "flex-start",
                        "& .MuiCheckbox-root": {
                          padding: 0,
                          paddingRight: 1.2,
                        },
                        "&:last-child": {
                          paddingBottom: 0,
                        },
                      }}
                    />
                  ))}
                </Grid>
              </Grid>
            </Box>
            <Divider />
          </Card>
          <Card>
            <DocumentsTable id={id} />
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <RightContentWrapper>
            <Card
              sx={{
                padding: 3,
                height: "48%",
              }}
            >
              <FlexBox justifyContent="space-between" flexWrap="wrap" mb={3.5}>
                <H5 mb={2}>Stakeholders</H5>
                <Add />
              </FlexBox>

              {projectTools.map((item) => (
                <FlexBox alignItems="center" mb={2} key={item.id}>
                  <StyledAvatar alt="Logo" src={item.image} />

                  <Box ml={1.5}>
                    <H6>{item.company}</H6>
                    <Tiny color="text.secondary">{item.position}</Tiny>
                  </Box>
                </FlexBox>
              ))}
            </Card>

            <Card
              sx={{
                padding: 3,
                height: "48%",
              }}
            >
              <FlexBox justifyContent="space-between" flexWrap="wrap" mb={3.5}>
                <H5 mb={2}>Signatories</H5>
                <Add />
              </FlexBox>

              {signature.map((item) => (
                <FlexBox alignItems="center" mb={2} key={item.id}>
                  <StyledAvatar alt="Logo" src={item.image} />
                  <Box ml={1.5}>
                    <H6>{item.company}</H6>
                    <Tiny color="text.secondary">{item.position}</Tiny>
                  </Box>
                </FlexBox>
              ))}
            </Card>
          </RightContentWrapper>
        </Grid>
      </Grid>
    </Box>
  );
};

const tasks = [
  {
    title:
      "Upload Document dsfsdlfksafksfdfkldsjfdais;jfewjf9302j[fj2oijew[0jwef89ewjf8a29jv328jv3vj9vj9[0j",
    status: "Completed",
  },
  {
    title: "Distribute Signature Pages",
    status: "Ongoing",
  },
  {
    title: "Receive Signed Pages",
    status: "Pending",
  },
  {
    title: "Generate Packet",
    status: "Open",
  },
];

const projectTools = [
  {
    id: 1,
    company: "Brian Baxter",
    image: "/static/avatar/001-man.svg",
    position: "Lead Associate",
  },
  {
    id: 2,
    company: "James Taylor",
    image: "/static/avatar/001-man.svg",
    position: "Buyor",
  },
  {
    id: 3,
    company: "Jerry Murray",
    image: "/static/avatar/001-man.svg",
    position: "Seller",
  },
];
const signature = [
  {
    id: 1,
    company: "Brian Baxter",
    image: "/static/avatar/001-man.svg",
    position: "2/5 Signatures Received",
  },
  {
    id: 2,
    company: "James Taylor",
    image: "/static/avatar/001-man.svg",
    position: "0/9 Signatures Received",
  },
  {
    id: 3,
    company: "Jerry Murray",
    image: "/static/avatar/001-man.svg",
    position: "10/10 Signatures Received",
  },
];

export default DealDetailsPage;
