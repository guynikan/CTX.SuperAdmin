import { httpService } from "@/services/http";
import { 
  ConfigurationAssociation,
  AssociatedConfiguration,
  CreateAssociatedConfiguration,
  UpdateAssociatedConfiguration,
  CreateAssociation
} from "@/types/associations";

const BASE_PATH = "/api/Configuration";

// Get all associations for a configuration
export const getConfigurationAssociations = async (configId: string): Promise<ConfigurationAssociation[]> => {
  const associations = await httpService<ConfigurationAssociation[]>({
    path: `${BASE_PATH}/${configId}/associations`,
    options: { method: "GET" },
  });
  
  return associations || [];
};

// Get a specific associated configuration by ID
export const getAssociatedConfigurationById = async (configId: string): Promise<AssociatedConfiguration | undefined> => {
  return await httpService<AssociatedConfiguration>({
    path: `${BASE_PATH}/${configId}`,
    options: { method: "GET" },
  });
};

// Update an associated configuration
export const updateAssociatedConfiguration = async (
  configId: string, 
  data: UpdateAssociatedConfiguration
): Promise<AssociatedConfiguration | undefined> => {
  return await httpService<AssociatedConfiguration>({
    path: `${BASE_PATH}/${configId}`,
    options: {
      method: "PUT",
      body: JSON.stringify(data),
    },
  });
};

// Create a new configuration
export const createConfiguration = async (
  data: CreateAssociatedConfiguration
): Promise<AssociatedConfiguration | undefined> => {
  return await httpService<AssociatedConfiguration>({
    path: BASE_PATH,
    options: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
};

// Delete a configuration
export const deleteAssociatedConfiguration = async (configId: string): Promise<void> => {
  await httpService<void>({
    path: `${BASE_PATH}/${configId}`,
    options: { method: "DELETE" },
  });
};

// Create an association between configurations
export const createAssociation = async (
  data: CreateAssociation
): Promise<ConfigurationAssociation | undefined> => {
  return await httpService<ConfigurationAssociation>({
    path: "/api/configurations/associations",
    options: {
      method: "POST",
      body: JSON.stringify({
        sourceConfigurationId: data.sourceConfigurationId,
        targetConfigurationId: data.targetConfigurationId,
        isActive: data.isActive ?? true
      }),
    },
  });
};

// Update an association (only isActive can be changed)
export const updateAssociation = async (
  associationId: string,
  isActive: boolean
): Promise<ConfigurationAssociation | undefined> => {
  return await httpService<ConfigurationAssociation>({
    path: `/api/configurations/associations/${associationId}`,
    options: {
      method: "PUT",
      body: JSON.stringify({
        sourceConfigurationId: "ignored-but-required-by-api",
        targetConfigurationId: "ignored-but-required-by-api",
        isActive: isActive
      }),
    },
  });
};

// Delete an association
export const deleteAssociation = async (
  sourceConfigId: string,
  associationId: string
): Promise<void> => {
  await httpService<void>({
    path: `${BASE_PATH}/${sourceConfigId}/associations/${associationId}`,
    options: { method: "DELETE" },
  });
};
