import { Box, Button, Divider, Grid, IconButton } from "@mui/material";
import { Add, MoreHoriz } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import FlexBox from "../../../components/flexbox/FlexBox";
import { H5, H6 } from "../../../components/Typography";
import { config } from "../../../config";
import { useFetch } from "../../../hooks/useFetch";
import UploadDocumentModal from "../../../components/modal/UploadDocument";
import DocumentTableListItem from "./documentTableListItem";

const DocumentsTable = (props) => {
  const { id } = props;

  const [documents, setDocuments] = useState([]);
  const { get } = useFetch();
  const [openModal, setOpenModal] = useState(false);

  const downloadDocument = (id) => {
    console.log(id);
  };

  const onUploadCallback = (document) => {
    setDocuments(documents.concat(document));
    setOpenModal(!openModal);
  };

  useEffect(() => {
    get(`${config.API_URL}/document?deal_id=${id}`, null, true)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setDocuments(data);
      });
  }, [id]);
  return (
    <Box padding={3}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FlexBox justifyContent="space-between" flexWrap="wrap" mb={3.5}>
            <H5 mb={3}>Uploaded Documents</H5>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenModal(true)}
              sx={{
                fontSize: 12,
              }}
            >
              Upload Document
            </Button>
          </FlexBox>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {documents.length > 0 &&
          documents.map((item) => (
            <DocumentTableListItem document={item} key={item.id} />
          ))}
      </Grid>
      {documents.length < 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <i>No documents have been uploaded for this deal.</i>
          </Grid>
        </Grid>
      )}
      <UploadDocumentModal
        open={openModal}
        setOpen={setOpenModal}
        id={id}
        onUploadCallback={(d) => onUploadCallback(d)}
      />
    </Box>
  );
};
export default DocumentsTable;
