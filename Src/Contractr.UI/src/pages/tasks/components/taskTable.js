import { Box, Button, Divider, Grid, IconButton } from "@mui/material";
import { Add, MoreHoriz } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import FlexBox from "../../../components/flexbox/FlexBox";
import { H5, H6 } from "../../../components/Typography";
import { config } from "../../../config";
import { useFetch } from "../../../hooks/useFetch";
import TaskModal from "../../../components/modal/UploadDocument";
import DocumentTableListItem from "./documentTableListItem";

const TasksTable = (props) => {
  const { id } = props;

  const [tasks, setTasks] = useState([]);
  const { get } = useFetch();
  const [openModal, setOpenModal] = useState(false);

  const onUploadCallback = (document) => {
    setTasks(tasks.concat(document));
    setOpenModal(!openModal);
  };

  useEffect(() => {
    get(`${config.API_URL}/document?deal_id=${id}`, null, true)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTasks(data);
      });
  }, [id]);
  return (
    <Box padding={3}>
      <Grid container spacing={3}>
        <Grid item sm={12} xs={12}>
          <FlexBox justifyContent="space-between" flexWrap="wrap" mb={3.5}>
            <H5 mb={3}>Tasks</H5>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenModal(true)}
              sx={{
                fontSize: 12,
              }}
            >
              Create Task
            </Button>
          </FlexBox>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {tasks.length > 0 &&
          tasks.map((item) => (
            <DocumentTableListItem document={item} key={item.id} />
          ))}
      </Grid>
      {tasks.length < 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <i>No tasks have been uploaded for this deal.</i>
          </Grid>
        </Grid>
      )}
      <TaskModal
        open={openModal}
        setOpen={setOpenModal}
        id={id}
        onUploadCallback={(d) => onUploadCallback(d)}
      />
    </Box>
  );
};
export default TasksTable;
