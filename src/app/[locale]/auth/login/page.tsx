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
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ROUTES } from "@/routes";


export default function LoginPage() {

  const {  dictionary: translations } = useDictionary();
  const dictionary = translations.auth;
  
  const [showPassword, setShowPassword] = useState(false);

  const schema = yup.object({
    username: yup
      .string()
      .required(dictionary?.required),
    password: yup
      .string()
      .required(dictionary?.required)
  }).required();

  type FormValues = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

    const onSubmit = (data: FormValues) => {
      console.log({data})
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

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

              <TextField
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                label={dictionary?.username}
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder={dictionary?.username}
              />
      
              <TextField
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                label={dictionary?.password}
                type={showPassword ? "text" : "password"}
                fullWidth
                autoComplete="on"
                variant="outlined"
                margin="normal"           
                placeholder="*******"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton data-testid="show-password-button"  onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                data-testid="signin-button"
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
                <Link href={ROUTES.AUTH.FORGOT_PASSWORD} underline="hover" fontWeight={600}>
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
