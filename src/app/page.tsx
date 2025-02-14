"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

const links = [
  { name: "Login", href: "/login" },
  { name: "Segment Types", href: "/segment-types" },
  { name: "Configuration", href: "/configuration" },
  { name: "Reports", href: "/reports" },
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
        sx={{ textTransform: "uppercase", mb: 4 }}
      >
        Super Admin NextGen
      </Typography>

      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        {links.map((link) => (
          <Link key={link.name} href={link.href} passHref>
            <Button
              variant="outlined"
              sx={{
                width: "250px",
                py: 1.5,
                fontSize: "1.2rem",
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
