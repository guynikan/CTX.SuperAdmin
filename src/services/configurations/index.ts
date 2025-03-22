import { httpService } from "@/services/http";
import { Configuration, CreateConfiguration, Item, Section } from "@/types/configuration";

export const createConfiguration = async (configuration: CreateConfiguration): Promise<Configuration | undefined> => {
  return await httpService<Configuration>({
    path: "/api/Configuration",
    options: {
      method: "POST",
      body: JSON.stringify(configuration),
    },
  });
};

export const getConfigurationById = async (id: string): Promise<Configuration | undefined> => {
  return await httpService<Configuration>({
    path: `/api/Configuration/${id}`,
    options: { method: "GET" },
  });
};

export const createConfigurationItems = async (items: Partial<Item[]>, configurationId: string) => {
  return await httpService<Partial<Item[]>>({
    path: `/api/Configuration/${configurationId}/items/batch`,
    options: {
      method: "POST",
      body: JSON.stringify({ items })
    },
  });
};

export const createConfigurationSection = async (configurationId: string, section: Partial<Section>) => {
  return await httpService<Partial<Section>>({
    path: `/api/Configuration/${configurationId}/sections`,
    options: {
      method: "POST",
      body: JSON.stringify(section),
    },
  });
};

export const associateSectionItems = async (
  configurationId: string,
  sectionId: string,
  itemIds: string[]
): Promise<void> => {
  return await httpService<void>({
    path: `/api/Configuration/${configurationId}/sections/${sectionId}/items`,
    options: {
      method: "POST",
      body: JSON.stringify({itemIds}),
    },
  });
};
