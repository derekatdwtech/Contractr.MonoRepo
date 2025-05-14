import { Add } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { Avatar, Box, Button, Stack, styled } from "@mui/material";
import AppModal from "./AppModal";
import FlexBox from "../../components/flexbox/FlexBox";
import AppTextField from "../../components/input/AppTextField";
import { H6 } from "../../components/Typography";
import { useContext, useState } from "react"; // custom styled components
import { useFetch } from "../../hooks/useFetch";
import { config } from "../../config";
import { Form } from "react-router-dom";
import { useUserOrg } from "../../context/UserOrgContext";
const StyledAppModal = styled(AppModal)(({ theme }) => ({
  minWidth: 400,
  [theme.breakpoints.down(400)]: {
    width: 300,
  },
})); // -------------------------------------------------------------------

// -------------------------------------------------------------------
const CreateProject = ({ open, setOpen, onCreateCallBack }) => {
  const { post } = useFetch();
  const { organization } = useUserOrg();
  const [formData, setFormData] = useState({
    start_date: new Date(Date.now()).toLocaleDateString(),
    close_date: new Date(Date.now()).toLocaleDateString(),
    buyor: "",
    seller: "",
    deal_status_id: 1,
  });

  const onInputChange = (e, n = null) => {
    
    const name = n !== null ? n : e.target.name;
    const value = n !== null ? e : e.target.value;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onSubmit = () => {
    console.log("Create Deal");
    formData.organization = organization.id;
    formData.start_date = new Date(formData.start_date).toISOString();
    formData.close_date = new Date(formData.close_date).toISOString();

    post(`${config.API_URL}/deal`, formData, true)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        onCreateCallBack(data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <StyledAppModal open={open} handleClose={() => setOpen(false)}>

      <Box mb={2}>
        <H6 mb={1}>Project Name *</H6>
        <AppTextField fullWidth size="small" placeholder="Project name" name="unique_name" onChange={(e) => onInputChange(e)} required/>
      </Box>
      <Box mb={2}>
        <H6 mb={1}>Description *</H6>
        <AppTextField
          rows={2}
          fullWidth
          multiline
          size="small"
          name="description"
          placeholder="Description"
          onChange={(e) => onInputChange(e)}
          required
        />
      </Box>
      <Box mb={2}>
        <H6 mb={1}>Start Date</H6>
        <DatePicker
          value={formData.start_date}
          onChange={(newValue) => onInputChange(newValue, "start_date")}
          name="start_date"
          renderInput={(params) => (
            <AppTextField
              fullWidth
              size="small"
              inputProps={{
                placeholder: "Deadline Date",
              }}
              {...params}
            />
          )}
        />
      </Box>
      <Box mb={2}>
        <H6 mb={1}>Projected Close</H6>
        <DatePicker
          value={formData.close_date}
          onChange={(newValue) => onInputChange(newValue, "close_date")}
          name="close_date"
          renderInput={(params) => (
            <AppTextField
              fullWidth
              size="small"
              inputProps={{
                placeholder: "Deadline Date",
              }}
              {...params}
            />
          )}
        />
      </Box>


      <Box my={1}>
        <H6 mb={1}>Team</H6>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Button variant="dashed">
            <Add
              fontSize="small"
              sx={{
                color: "grey.600",
              }}
            />
          </Button>
          <Avatar alt="Remy Sharp" src="/static/user/user-7.png" />
          <Avatar alt="Travis Howard" src="/static/user/user-6.png" />
          <Avatar alt="Cindy Baker" src="/static/user/user-5.png" />
        </Stack>
      </Box>

      <FlexBox mt={4} gap={2}>
        <Button variant="contained" fullWidth onClick={()=> onSubmit()}>
          Create
        </Button>

        <Button variant="outlined" fullWidth onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </FlexBox>
    </StyledAppModal>
  );
};

export default CreateProject;
