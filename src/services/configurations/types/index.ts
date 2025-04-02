import { httpService } from "@/services/http";
import { ConfigurationType, CreateConfigurationType } from "@/types/configuration";

const basePath = "/api/ConfigurationType";

export const getConfigurationTypes = async (): Promise<ConfigurationType[] | undefined> => {
  return await httpService<ConfigurationType[]>({
    path: basePath,
    options: { method: "GET" },
  });
};

export const getConfigurationTypeById = async (id: string): Promise<ConfigurationType | undefined> => {
  return await httpService<ConfigurationType>({
    path: `${basePath}/${id}`,
    options: { method: "GET" },
  });
};

export const createConfigurationType = async (data: CreateConfigurationType): Promise<ConfigurationType | undefined> => {
  return await httpService<ConfigurationType>({
    path: basePath,
    options: {
      method: "POST",
      body: JSON.stringify(data),
    },
  });
};

export const updateConfigurationType = async (
  id: string,
  data: Partial<ConfigurationType>
): Promise<ConfigurationType | undefined> => {
  return await httpService<ConfigurationType>({
    path: `${basePath}/${id}`,
    options: {
      method: "PUT",
      body: JSON.stringify(data),
    },
  });
};

export const deleteConfigurationType = async (id: string): Promise<void> => {
  return await httpService<void>({
    path: `${basePath}/${id}`,
    options: {
      method: "DELETE",
    },
  });
};
