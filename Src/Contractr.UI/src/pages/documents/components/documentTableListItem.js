import { MoreHoriz } from "@mui/icons-material";
import { Box, Grid, IconButton, CircularProgress } from "@mui/material";
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
  display: 'flex',
  alignItems: 'center',
  height: '24px', // Fixed height for consistency
}));

const DocumentTableListItem = ({ document, isNewUpload = false }) => {
  const { get } = useFetch();
  const [pages, setPages] = useState([]);
  const [documentEl, setDocumentEl] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleMoreDocumentClick = (event) => {
    setDocumentEl(event.currentTarget);
  };

  const handleClose = () => setDocumentEl(null);

  const fetchSignaturePages = async () => {
    try {
      const res = await get(`${config.API_URL}/Document/${document.id}/signature_pages`, null, true);
      const data = await res.json();
      setPages(data);
      return data;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const startPolling = () => {
    console.log("starting polling");
    const pollInterval = setInterval(async () => {
      const newPages = await fetchSignaturePages();
      if (newPages.length > 0) {
        console.log("newPages", newPages);
        setIsPolling(false);
        clearInterval(pollInterval);
      }
    }, 5000); // Poll every 5 seconds

    return pollInterval;
  };

  const getDocumentAge = () => {
    // Parse the date string into a Date object
    const uploadedDate = new Date(document.uploaded_on);
    // Check if the date is valid
    if (isNaN(uploadedDate.getTime())) {
      console.error('Invalid date:', document.uploaded_on);
      return 0;
    }
    return Date.now() - uploadedDate.getTime();
  };

  useEffect(() => {
    let pollInterval;
    const documentAge = getDocumentAge();
    const isRecentDocument = documentAge < 5 * 60 * 1000;

    // Initial fetch
    fetchSignaturePages().then(initialPages => {
      if ((initialPages.length === 0 && isRecentDocument) || isNewUpload) {
        setIsPolling(true);
        pollInterval = startPolling();
      }
    });

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [document.id, document.uploaded_on, isNewUpload]);

  const renderSignaturePagesCount = () => {
    const documentAge = getDocumentAge();
    const isRecentDocument = documentAge < 5 * 60 * 1000;

    // Show loading state
    if (isLoading) {
      return (
        <FlexBox alignItems="center" gap={1} height={24}>
          <CircularProgress size={16} color="inherit" />
          <StyledSmall variant="primary">Loading...</StyledSmall>
        </FlexBox>
      );
    }

    // Don't show anything if there are 0 pages and it's not a recent document
    if (pages.length === 0 && !isRecentDocument && !isNewUpload) {
      return null;
    }

    // Show processing state for recent documents with 0 pages
    if ((isRecentDocument || isNewUpload) && pages.length === 0 && isPolling) {
      return (
        <FlexBox alignItems="center" gap={1} height={24}>
          <CircularProgress size={16} color="inherit" />
          <StyledSmall variant="primary">Processing...</StyledSmall>
        </FlexBox>
      );
    }

    // Only show the count if there are actual pages
    if (pages.length > 0) {
      return <StyledSmall variant="primary">{pages.length} Signature Pages</StyledSmall>;
    }

    return null;
  };

  return (
    <Grid item sm={12} xs={12}>
      <FlexBetween alignItems="center">
        <FlexBox alignItems="center" flex={1}>
          <Box mr={2}>
            <RoundCheckBox />
          </Box>
          <Box mr={2} height={40} width={40}>
            <img src="/static/file-type/pdf.svg" alt="File Type" width="100%" />
          </Box>
          <H6>{document.file_name}</H6>
        </FlexBox>
        <Box mx={2} minWidth={120} textAlign="center">
          {renderSignaturePagesCount()}
        </Box>
        <Box>
          <IconButton onClick={(e) => handleMoreDocumentClick(e)}>
            <MoreHoriz fontSize="small" color="disabled" />
          </IconButton>
        </Box>
      </FlexBetween>
      <MoreDocumentOptions 
        anchorEl={documentEl} 
        handleMoreClose={handleClose} 
        pages={pages} 
        parent_document={document.id} 
        file_name={document.file_name} 
      />
    </Grid>
  );
};

export default DocumentTableListItem;
