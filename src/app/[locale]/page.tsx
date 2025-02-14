"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

const links = [
  { name: "Login ✅ ", href: "/login" },
  { name: "Segment Types ✅ ", href: "/segment-types" },
  { name: "Segment Values ⌛", href: "/" },
  { name: "Configuration Types ⌛", href: "/" },
  { name: "Configuration Values ⌛", href: "/" },

];

export default function Home() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, #000, #333)",
        color: "white",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h2"
        fontWeight="bold"
        letterSpacing={2}
        sx={{ mb: 4 }}
      >
        Super Admin NextGen
      </Typography>

      <Container
        sx={{
          display: "flex",
          flexWrap: 'wrap',
          justifyContent:'center',
          gap: 2,
          alignItems: "center",
        }}
      >
        {links.map((link) => (
          <Link key={link.name} href={link.href} passHref>
            <Button
              variant="outlined"
              sx={{
                fontSize: "14px",
                borderRadius: "8px",
                color: "white",
                borderColor: "white",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "white",
                  color: "black",
                },
              }}
            >
              {link.name}
            </Button>
          </Link>
        ))}
      </Container>
    </Box>
  );
}
