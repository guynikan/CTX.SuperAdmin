"use client";

import { useContext, useState } from "react";
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

import { DictionaryContext } from "@/i18n/DictionaryProvider";

export default function LoginPage() {

  const { dictionary } = useContext(DictionaryContext)!;

  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("cpf: " + cpf + " password:" + password);
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
              {dictionary?.form?.title}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>

              <TextField
                label="CPF"
                fullWidth
                variant="outlined"
                margin="normal"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
              />

      
              <TextField
                label="Senha"
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
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
                {dictionary?.form?.login_button} →
              </Button>

              {/* Esqueci a Senha */}
              <Typography variant="body2" sx={{ mt: 3, color:'#434343', textAlign: "center" }}>
                <Link href="/forgot-password" underline="hover" fontWeight={600}>
                  {dictionary?.form?.forgot_password}
                </Link>
              </Typography>

            </Box>
          </Box>
        </Container>
      </Grid>
     
    </Grid>

   
  );
}
