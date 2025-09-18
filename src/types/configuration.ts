export type Module = {
  id: string;
  parentId: string | null;
  parent: Module | null;
  name: string;
  description: string;
  level: number;
  isActive: boolean;
  children: Module[];
  configurations: Configuration[];
  createdAt: string;
  updatedAt: string;
};

export type Configuration = {
  id: string;
  configurationTypeId: string;
  moduleId: string;
  baseConfigurationId: string | null;
  title: string;
  slug?: string;
  description?: string;
  version: string;
  data: Record<string, any>; // JSON object with configuration data
  metadata: Record<string, any>; // JSON object with metadata
  isActive: boolean;
  hasRule: boolean;
  rule: Rule | null;
  createdAt: string;
  updatedAt: string;
  configurationType: ConfigurationType;
  module: Module;
  baseConfiguration?: Configuration | null;
};

export type ConfigurationType = {
  id: string;
  name: string;
  slug: string;
  description: string;
  metadataSchema: string; // JSON schema as string
  dataSchema: string; // JSON schema as string
  isActive: boolean;
  configurations: Configuration[];
  createdAt: string;
  updatedAt: string;
};


export type Rule = {
  id?: string;
  segmentType: string;
  comparisonOperator: number;
  values: string[];
  logicalOperator: number;
};

export type Ruleset = {
  name: string;
  enabled: boolean;
  logicalOperator: number;
  priority: number;
  ruleConditions: Rule[];
};

export type CreateConfiguration = Pick<Configuration, "title" | "description" | "moduleId" | "configurationTypeId" | "baseConfigurationId"> & {
  slug?: string;
  data?: Record<string, any>;
  metadata?: Record<string, any>;
};

export type CreateConfigurationType = Pick<ConfigurationType, "name" | "slug" | "description" | "dataSchema" | "metadataSchema">;