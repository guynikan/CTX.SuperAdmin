"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Grid from "@mui/material/Grid2"; 

import { useDictionary } from "@/i18n/DictionaryProvider";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/routes";


export default function LoginPage() {
  const router = useRouter();
  const {  dictionary: translations } = useDictionary();
  const dictionary = translations.auth;
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const schema = yup.object({
    username: yup
      .string()
      .required((dictionary as any)?.required || 'Required'),
    password: yup
      .string()
      .required((dictionary as any)?.required || 'Required')
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

  const onSubmit = async (data: FormValues) => {
    setError(null);
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please try again.');
        setLoading(false);
      } else if (result?.ok) {
        router.push(ROUTES.HOME);
        router.refresh();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
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
              {(dictionary as any)?.signIn || 'Sign In'}
            </Typography>

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>

              <TextField
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message}
                label={(dictionary as any)?.username}
                fullWidth
                variant="outlined"
                margin="normal"
                placeholder={(dictionary as any)?.username}
              />
      
              <TextField
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                label={(dictionary as any)?.password}
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
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  backgroundColor: "#000",
                  color: "white",
                  "&:hover": { opacity: 0.9 },
                }}
              >
                {loading ? 'Signing in...' : `${(dictionary as any)?.signIn || 'Sign In'} →`}
              </Button>

              {/* Esqueci a Senha */}
              <Typography variant="body2" sx={{ mt: 3, color:'#434343', textAlign: "center" }}>
                <Link href={ROUTES.AUTH.FORGOT_PASSWORD} underline="hover" fontWeight={600}>
                  {(dictionary as any)?.forgot_password}
                </Link>
              </Typography>

            </Box>
          </Box>
        </Container>
      </Grid>
    </Grid>
  );
}
