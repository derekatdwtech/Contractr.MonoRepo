import { MoreHoriz } from "@mui/icons-material";
import { Box, Grid, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import React, { useState, useEffect } from "react";
import FlexBetween from "../../../components/flexbox/FlexBetween";
import FlexBox from "../../../components/flexbox/FlexBox";
import RoundCheckBox from "../../../components/RoundCheckBox";
import { H6, Small, Tiny } from "../../../components/Typography";
import { config } from "../../../config";
import { useFetch } from "../../../hooks/useFetch";
import MoreDocumentOptions from "./MoreDocumentOptions";

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

const DocumentTableListItem = ({ document }) => {
  const { get } = useFetch();
  const [pages, setPages] = useState([]);
  const [documentEl, setDocumentEl] = useState(null);

  const handleMoreDocumentClick = (event) => {
    setDocumentEl(event.currentTarget);
  };

  const handleClose = () => setDocumentEl(null);

  useEffect(() => {
    async function getSignaturePagesForDocument(id) {
      get(`${config.API_URL}/Document/${id}/signature_pages`, null, true)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPages(pages.concat(data));
        })
        .catch((err) => {
          console.error(err);
        });
    }
    getSignaturePagesForDocument(document.id);
  }, [document]);

  return (
    <Grid item sm={12} xs={12}>
      <FlexBetween>
        <FlexBox alignItems="center">
            <Box>
            <RoundCheckBox />
                </Box>
          <Box marginRight={1.5} height={40} width={40}>
            <img src="/static/file-type/pdf.svg" alt="File Type" width="100%" />
          </Box>

          <Box>
            <FlexBox alignItems="center">
              <H6>{document.file_name}</H6>
            </FlexBox>
          </Box>
        </FlexBox>
        <StyledSmall variant="primary">{pages.length}  Signature Pages</StyledSmall>
        <IconButton onClick={(e) => handleMoreDocumentClick(e)}>
          <MoreHoriz fontSize="small" color="disabled" />
        </IconButton>
      </FlexBetween>
      <MoreDocumentOptions anchorEl={documentEl} handleMoreClose={handleClose} pages={pages} parent_document={document.id} file_name={document.file_name} />
    </Grid>
  );
};
export default DocumentTableListItem;
