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
  const [documents, setDocuments] = useState([]);

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
                <H3 mb={1} mt={1}>{deal.unique_name}  </H3>
                
                <IconButton
                  sx={{
                    padding: 0,
                  }}
                >
                  <MoreHoriz />
                </IconButton>

                {/* <MoreOptions
                  anchorEl={projectEl}

                /> */}
              </FlexBetween>

              <Small color="text.secondary">
                {deal.description}
              </Small>
            </Box>

            <Divider />

            <Box padding={3}>
              <Grid container spacing={3}>
                <Grid item sm={7} xs={12}>
                  <H5 mb={2}>Tasks</H5>
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

                <Grid item sm={5} xs={12}>
                  <H5 mb={2}>Team</H5>
                  <AvatarGroup
                    sx={{
                      alignItems: "center",
                      justifyContent: "flex-end",
                      "& .MuiAvatar-root": {
                        boxSizing: "border-box",
                        border: 0,
                      },
                    }}
                  >
                    <AppAvatar
                      alt="Remy Sharp"
                      src="/static/avatar/001-man.svg"
                    />
                    <AppAvatar
                      alt="Travis Howard"
                      src="/static/avatar/002-girl.svg"
                    />
                    <AppAvatar
                      alt="Cindy Baker"
                      src="/static/avatar/003-boy.svg"
                    />

                    <Button
                      variant="dashed"
                      sx={{
                        ml: 1,
                      }}
                    >
                      <Add
                        fontSize="small"
                        sx={{
                          color: "grey.600",
                        }}
                      />
                    </Button>
                  </AvatarGroup>

                  <Box mt={2}>
                    <FlexBetween py={1}>
                      <H6 fontWeight={600}>Project Progress</H6>
                      <H6>32%</H6>
                    </FlexBetween>

                    <LinearProgress variant="determinate" value={32} />
                  </Box>
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
              <H5 mb={2}>Stakeholders</H5>

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

            {/* <Card
              sx={{
                padding: 3,
                height: "48%",
              }}
            >
              <H5 mb={2}>Project Stack</H5>

              {stacks.map((item) => (
                <FlexBox alignItems="center" mb={2} key={item.id}>
                  <StyledAvatar alt="Logo" src={item.image} />
                  <Box ml={1.5}>
                    <H6>{item.company}</H6>
                    <Tiny color="text.secondary">{item.position}</Tiny>
                  </Box>
                </FlexBox>
              ))}
            </Card> */}

            <Card
              sx={{
                padding: 3,
                height: "48%",
              }}
            >
              <H5 mb={2}>Signatories</H5>

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
    title: "Upload Document",
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
const files = [
  {
    id: 1,
    title: "Design Homepage",
    image: "/static/file-type/jpg.svg",
  },
  {
    id: 2,
    title: "Preliminary Sketches",
    image: "/static/file-type/zip.svg",
  },
  {
    id: 3,
    title: "Preliminary Sketches",
    image: "/static/file-type/pdf.svg",
  },
  {
    id: 4,
    title: "Preliminary Sketches",
    image: "/static/file-type/raw.svg",
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
const stacks = [
  {
    id: 1,
    company: "HTML5",
    image: "/static/tools-logo/html.svg",
    position: "Code",
  },
  {
    id: 2,
    company: "VueJS",
    image: "/static/tools-logo/vue.svg",
    position: "Code",
  },
  {
    id: 3,
    company: "Sass",
    image: "/static/tools-logo/sass.svg",
    position: "Code",
  },
];

export default DealDetailsPage;
