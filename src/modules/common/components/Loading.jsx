import { Box, CircularProgress, Stack } from "@mui/material";

const Loading = () => {
    return (
      <Box sx={{ margin: "auto" }}>
        <Stack alignItems="center">
          <CircularProgress />
        </Stack>
      </Box>
    );
  };
export default Loading