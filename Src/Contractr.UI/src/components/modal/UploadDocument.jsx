import { Add } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { Avatar, Box, Button, Stack, styled, CircularProgress } from "@mui/material";
import AppModal from "./AppModal";
import FlexBox from "../flexbox/FlexBox";
import AppTextField from "../input/AppTextField";
import { H6 } from "../Typography";
import { useContext, useState } from "react"; // custom styled components
import { useFetch } from "../../hooks/useFetch";
import { useUserOrg } from "../../context/UserOrgContext";
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
  const { organization } = useUserOrg();
  const { user } = useAuth0();
  const [error, setError] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const [isUploading, setIsUploading] = useState(false);

  const onSubmit = () => {
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setError(null);
    setIsUploading(true);
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
          console.log(data);
          setError(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to upload document. Please try again.");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const onInputChange = (e) => {
    setError(null);
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
          error={!!error}
          helperText={error}
        />
      </Box>
      
      <FlexBox mt={4} gap={2}>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={()=> onSubmit()}
          disabled={isUploading || !selectedFile}
        >
          {isUploading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Upload"
          )}
        </Button>

        <Button 
          variant="outlined" 
          fullWidth 
          onClick={() => setOpen(false)}
          disabled={isUploading}
        >
          Cancel
        </Button>
      </FlexBox>
    </StyledAppModal>
  );
};

export default UploadDocumentModal;
