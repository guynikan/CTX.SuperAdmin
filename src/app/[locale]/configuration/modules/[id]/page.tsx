"use client";

import { Fragment, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";

import { useDictionary } from "@/i18n/DictionaryProvider";
import { useCreateModule, useModuleById } from "@/hooks/useModules";
import { useParams } from "next/navigation";

import CreateModuleModal from "../../../modules/components/CreateModal";
import CreateConfigurationModal from "./CreateConfigurationModal";
import { useCreateConfiguration } from "@/hooks/useConfiguration";
import { CreateConfiguration } from "@/types/configuration";

export default function ModulePageDetail() {
  const { dictionary: translations } = useDictionary();
  const dictionary = translations.modules;

  const createModuleMutation = useCreateModule();
  const createConfigurationMutation = useCreateConfiguration();

  const { id } = useParams();
  const { data: module, isLoading } = useModuleById(String(id));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigModalOpen, setConfigModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const [configurationData, setConfigurationData] = useState({
    title: "",
    description: "",
    configurationTypeId: "",
  });

  const [moduleData, setModuleData] = useState({
    name: "",
    description: "",
  });

  const handleAddConfiguration = async (configurationData: CreateConfiguration) => {
    setLoading(true);
    try {
      const { title, description, configurationTypeId } = configurationData;
      const configResponse = await createConfigurationMutation.mutateAsync({
        title,
        description,
        configurationTypeId,
        moduleId: id as string,
      });

      if (configResponse) {
        setConfigModalOpen(false);
        setConfigurationData({ title: "", description: "", configurationTypeId: "" });
        window.location.href = `/configuration/modules/${id}/new?&config_id=${configResponse?.id}`;
      }
    } catch (error) {
      console.error("Erro ao adicionar Módulo:", error);
    } finally {
      setLoading(false);
    }
  };

  const addSubModule = async (moduleData) => {
    setLoading(true);
    try {
      await createModuleMutation.mutateAsync({
        parentId: module?.id,
        name: moduleData.name,
        description: moduleData.description,
      });
      setIsModalOpen(false);
      setModuleData({ name: "", description: "" });
    } catch (error) {
      console.error("Erro ao adicionar Módulo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={styles.container}>
      {isLoading ? (
        <Box sx={styles.loading}>
          <CircularProgress size={24} />
        </Box>
      ) : module ? (
        <Fragment key={module.id}>
          {/* Header */}
          <Box sx={styles.header}>
            <Box>
              <Typography variant="h6" fontWeight={600} sx={styles.moduleTitle}>
                Módulo - {module.name}
              </Typography>
              <Typography sx={styles.moduleDescription}>{module.description}</Typography>
            </Box>
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Box>

          {/* Actions */}
          <Box sx={styles.actions}>
            <Button
              onClick={() => setConfigModalOpen(true)}
              variant="outlined"
              startIcon={<SettingsIcon />}
            >
              {dictionary?.newConfiguration}
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="outlined"
              startIcon={<AddIcon />}
            >
              {dictionary?.newSubModule}
            </Button>
          </Box>

          {/* Submodules */}
          {!!module.children?.length && (
            <Paper sx={styles.submodulesWrapper}>
              <Tabs
                sx={styles.submodulesTabs}
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
              >
                {module.children.map((submodule) => (
                  <Tab key={submodule.id} label={submodule.name} />
                ))}
              </Tabs>
            </Paper>
          )}

          {/* Configurações do Módulo */}
          {!!module.configurations?.length && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, textAlign: "left" }}>
                {dictionary?.configurationListTitle}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {module.configurations.map((config) => (
                  <Button
                    key={config.id}
                    href={`/configuration/modules/${module.id}/new?config_id=${config.id}`}
                    variant="outlined"
                    size="small"
                    sx={{ justifyContent: "flex-start" }}
                  >
                    {config.title}
                  </Button>
                ))}
              </Box>
            </Paper>
          )}
        </Fragment>
      ) : (
        <Typography variant="h5">{dictionary?.emptySingle}</Typography>
      )}

      <CreateModuleModal
        open={isModalOpen}
        onSubmit={addSubModule}
        moduleData={moduleData}
        setModuleData={setModuleData}
        loading={loading}
        onClose={() => setIsModalOpen(false)}
      />

      <CreateConfigurationModal
        open={isConfigModalOpen}
        onClose={() => setConfigModalOpen(false)}
        onSubmit={handleAddConfiguration}
        initialData={configurationData}
      />
    </Box>
  );
}

const styles = {
  container: {
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    py: 3,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 2,
  },
  moduleTitle: {
    textAlign: "left",
  },
  moduleDescription: {
    mb: 2,
    textAlign: "left",
  },
  actions: {
    display: "flex",
    gap: 2,
    mb: 3,
  },
  submodulesWrapper: {
    p: 3,
    mb: 3,
  },
  submodulesTabs: {
    borderBottom: "1px solid #e5e5e5",
  },
};
