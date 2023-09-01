import { Add } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { Avatar, Box, Button, Stack, styled } from "@mui/material";
import AppModal from "./AppModal";
import FlexBox from "../flexbox/FlexBox";
import AppTextField from "../input/AppTextField";
import { H6 } from "../Typography";
import { useContext, useState } from "react"; // custom styled components
import { useFetch } from "../../hooks/useFetch";
import { OrganizationContext } from "../../context/OrganizationContext";
import { config } from "../../config";
import { useAuth0 } from "@auth0/auth0-react";

const StyledAppModal = styled(AppModal)(({ theme }) => ({
  minWidth: 400,
  [theme.breakpoints.down(400)]: {
    width: 300,
  },
})); // -------------------------------------------------------------------

// -------------------------------------------------------------------
const UploadDocumentModal = ({ open, setOpen, id, onUploadCallback }) => {
  const { post } = useFetch();
  const { organization } = useContext(OrganizationContext);
  const { user } = useAuth0();
  const [error, setError] = useState();
  const [selectedFile, setSelectedFile] = useState();

  const onSubmit = () => {
    setError(null);
    const formData = new FormData();
    formData.append("file", selectedFile);

    post(
      `${config.API_URL}/document/upload?uploaded_by=${user.sub}&deal_id=${id}`,
      formData,
      true,
      null
    )
      .then((res) => {
       if(res.ok) {
        return res.json();
       }
       else {
        return res.text();
       }
      })
      .then((data) => {
        if(data.blob_uri !== undefined) {
            onUploadCallback(data);
            setOpen(!open);
        }
        else {
            console.log(data)
            setError(data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onInputChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <StyledAppModal open={open} handleClose={() => setOpen(false)}>
      
      <Box mb={2}>
        <H6 mb={1}>Description</H6>
        <AppTextField
          rows={2}
          fullWidth
          size="small"
          name="document"
          placeholder="Select Document"
          type="file"
          onChange={(e) => onInputChange(e)}
        />
      </Box>
      
      <FlexBox mt={4} gap={2}>
        <Button variant="contained" fullWidth onClick={()=> onSubmit()}>
          Upload
        </Button>

        <Button variant="outlined" fullWidth onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </FlexBox>
    </StyledAppModal>
  );
};

export default UploadDocumentModal;
