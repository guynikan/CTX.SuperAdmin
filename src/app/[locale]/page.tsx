"use client";

import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";

import { ROUTES } from "@/routes";

const links = [
  { name: "Login ✅", href: ROUTES.AUTH.LOGIN },
  { name: "Segment Types ✅", href: ROUTES.SEGMENTS.TYPES },
  { name: "Segment Values ✅", href: ROUTES.SEGMENTS.VALUES },
  { name: "Configuration Types ⌛", href: ROUTES.CONFIGURATION.RULES },
  { name: "Configuration Rules ⌛", href: ROUTES.CONFIGURATION.VALUES },
  { name: "Module ⌛", href: ROUTES.MODULE.ROOT},

];

export default function Home() {
  return (
    <Box
      sx={{   
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "black",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        letterSpacing={1}
        sx={{ mb: 4, mt: 5 }}
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
                color: "black",
                borderColor: "black",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "black",
                  color: "white",
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
