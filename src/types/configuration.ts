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
  sectionId?: string;
  name: string;
  order: number;
  properties: string;
  isPersisted?: boolean; // ← novo campo
};

export type Section = {
  id: string;
  name: string;
  order: number;
  properties: string;
  items: Item[];
  isPersisted?: boolean; // ← novo campo
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

export type ConfigurationType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string;
  metadataSchema: string;
  dataSchema: string;
  isActive: boolean;
  configurations: Configuration[];
};

export type CreateConfiguration = Pick<Configuration, "title" | "description" | "moduleId"|  "configurationTypeId">;