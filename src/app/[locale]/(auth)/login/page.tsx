"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Grid from "@mui/material/Grid2"; 

import { useDictionary } from "@/i18n/DictionaryProvider";

export default function LoginPage() {

  const { dictionary } = useDictionary();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("username: " + username + " password:" + password);
  };

  return (

    <Grid container spacing={1} sx={{ minHeight: "100vh" }}>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}>
        <Box sx={{ bgcolor: "#434343", height:'100%' }}></Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 12, md: 6 }}  
       sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
          height: "100vh",
        }}>
        <Container maxWidth="xs">
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h5" fontWeight={600}>
              {dictionary?.signIn}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>

              <TextField
                label={dictionary?.username}
                fullWidth
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={dictionary?.username}
              />
      
              <TextField
                label={dictionary?.password}
                type={showPassword ? "text" : "password"}
                fullWidth
                autoComplete="on"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*******"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  backgroundColor: "#000",
                  color: "white",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                {dictionary?.signIn} →
              </Button>

              {/* Esqueci a Senha */}
              <Typography variant="body2" sx={{ mt: 3, color:'#434343', textAlign: "center" }}>
                <Link href="/esqueci-minha-senha" underline="hover" fontWeight={600}>
                  {dictionary?.forgot_password}
                </Link>
              </Typography>

            </Box>
          </Box>
        </Container>
      </Grid>
     
    </Grid>

   
  );
}
