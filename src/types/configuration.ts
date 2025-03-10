export type ConfigurationType = {
  id: string;
  name: string;
  metadataSchema: string;
  dataSchema: string;
};

export type Module = {
  id: string;
  parentId: string;
  name: string;
  level: number;
};

export type ConfigurationData = {
  id: string;
  version: string;
  metadata: string;
  data: string;
};

export type Item = {
  id: string;
  sectionId: string;
  name: string;
  order: number;
  properties: string;
};

export type Section = {
  id: string;
  name: string;
  order: number;
  properties: string;
  items: Item[];
};

export type Configuration = {
  id: string;
  configurationTypeId: string;
  moduleId: string;
  title: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  configurationType: ConfigurationType;
  module: Module;
  configurationData: ConfigurationData[];
  sections: Section[];
  items: Item[];
};

export type CreateConfiguration = Pick<Configuration, "title" | "description" | "moduleId"|  "configurationTypeId">;