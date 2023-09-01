import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";

const LoadingScreen = () => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress  />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary">
            <img
              src="/static/logo/logo.svg"
              alt="logo"
              width={16}
              display="box"
            />
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
};

export default LoadingScreen;
