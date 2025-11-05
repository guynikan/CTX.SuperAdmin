"use client";

import { AppBar, Toolbar, IconButton, Typography, Box, Menu, MenuItem } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const open = Boolean(anchorEl);
  
  const username = session?.username || "User";

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await signOut({ redirect: false });
    router.push('/auth/login');
    router.refresh();
  };

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton 
              edge="end" 
              sx={{ color: "black" }}
              onClick={handleClick}
              aria-controls={open ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <AccountCircleIcon />
              <Typography sx={{ ml: 2 }}>{username}</Typography>
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'user-menu-button',
              }}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
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
