import { Box, Button, TextField } from "@mui/material";

export default function Home() {
  return (
    <div>
      <h1>SuperAdmin</h1>
      <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
        <TextField label="Material Text Field" />
        <Box m={2}>
          <Button variant="contained" color="primary">
            Material Button
          </Button>
        </Box>
      </Box>
    </div>
  );
}
