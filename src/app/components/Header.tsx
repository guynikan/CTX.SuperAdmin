import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "white",
          color: "black",
          boxShadow: "none",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar sx={{ marginRight:'20px', display: "flex", justifyContent: "space-between" }}>

          <Typography variant="h5" sx={{ ml: 2 }}>SuperAdmin / NextGen</Typography>
          <IconButton edge="end" sx={{ color: "black" }}>
            <AccountCircleIcon />
            <Typography sx={{ ml: 2 }}>Elton</Typography>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width:'100%',
          bgcolor: "black",
          display: "flex",
          alignItems: "center",
          height: 50,
          gap: 4,
          marginTop: '60px',
          px: 5,
        }}
      >
          <Link style={{color: 'white', textDecoration:'none'}} href='/configuration/modules' >Home</Link> 
          <Link style={{color: 'white', textDecoration:'none'}} href='/modules' >Modules</Link> 
          <Link style={{color: 'white', textDecoration:'none'}} href='/segments/types' >Segment Types</Link> 
          <Link style={{color: 'white', textDecoration:'none'}} href='/segments/values' >Segment Values</Link> 
          <Link style={{color: 'white', textDecoration:'none'}} href='/configuration/types' >Configuration Types</Link> 
      </Box>

    </>
  );
}
