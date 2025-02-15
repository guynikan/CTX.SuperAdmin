export const ROUTES = {
  HOME: "/home",
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
    FORGOT_PASSWORD: "/auth/forgot",
  },
  CONFIGURATION: {
    ROOT: "/configuration",
    TYPES: "/configuration/types",
    VALUES: "/configuration/values",
  },
  SEGMENTS: {
    ROOT: "/segments",
    TYPES: "/segments/types",
    VALUES: "/segments/values",
  },
  
} as const;
