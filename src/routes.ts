export const ROUTES = {
  HOME: "/home",
  MODULE:{
    ROOT: '/module'
  },
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
    FORGOT_PASSWORD: "/auth/forgot-password",
  },
  CONFIGURATION: {
    ROOT: "/configuration",
    RULES: "/configuration/rules",
    VALUES: "/configuration/values",
  },
  SEGMENTS: {
    ROOT: "/segments",
    TYPES: "/segments/types",
    VALUES: "/segments/values",
  },
  
} as const;
