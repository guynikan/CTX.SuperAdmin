"use client";

import { useMemo } from "react";
import { Paper, Button, Box, Typography, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useModules } from "@/hooks/useModules";
import { useDictionary } from "@/i18n/DictionaryProvider";

export default function Sidebar({ handleAddModule }: { handleAddModule: () => void }) {
  const { data: modules, isLoading } = useModules();
  const { dictionary: translations, locale } = useDictionary();
  const dictionary = translations.modules;
  
  const pathname = usePathname();

  const rootModules = useMemo(() => modules?.filter((module) => !module.parentId) || [], [modules]);

  return (
    <>
      <Button
        sx={styles.addButton}
        variant="outlined"
        fullWidth
        onClick={handleAddModule}
        startIcon={<AddIcon />}
      >
        {dictionary?.registerButton}
      </Button>

      <Paper elevation={3} sx={styles.container}>
        {isLoading ? (
          <Box sx={styles.loadingBox}>
            <CircularProgress size={24} />
          </Box>
        ) : rootModules.length > 0 ? (
          rootModules.map((item) => {
            const isActive = pathname.startsWith(`/${locale}/configuration/modules/${item.id}`);

            return (
              <Link key={item.id} href={`/configuration/modules/${item.id}`} passHref>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    ...styles.moduleButton,
                    color: isActive ? "white" : "black",
                    backgroundColor: isActive ? "black" : "white",
                    "&:hover": { backgroundColor: isActive ? "black" : "#E0E0E0" },
                  }}
                >
                  {item.name}
                </Button>
              </Link>
            );
          })
        ) : (
          <Box sx={styles.emptyBox}>
            <Typography sx={styles.emptyText}>{dictionary?.empty}</Typography>
          </Box>
        )}
      </Paper>
    </>
  );
}

const styles = {
  addButton: {
    overflow: "hidden",
    p: 2,
    marginBottom: "10px",
  },
  container: {
    borderRadius: 3,
    overflow: "hidden",
    p: 1.5,
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    gap: 1,
  },
  loadingBox: {
    textAlign: "center",
    py: 3,
  },
  moduleButton: {
    justifyContent: "flex-start",
    p: 1.8,
    borderRadius: 3,
    fontSize: "1rem",
    fontWeight: 500,
  },
  emptyBox: {
    textAlign: "center",
    py: 3,
  },
  emptyText: {
    fontSize: "0.9rem",
    color: "#666",
    mb: 1,
  },
};
