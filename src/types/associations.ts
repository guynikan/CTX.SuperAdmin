export interface ConfigurationAssociation {
  id: string;
  sourceConfigurationId: string;
  targetConfigurationId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sourceConfiguration: {
    id: string;
    slug: string;
    title: string;
    configurationTypeSlug: string;
    moduleName: string;
  };
  targetConfiguration: {
    id: string;
    slug: string;
    title: string;
    configurationTypeSlug: string;
    moduleName: string;
  };
}

export interface AssociatedConfiguration {
  id: string;
  configurationTypeId: string;
  moduleId: string;
  baseConfigurationId: string | null;
  title: string;
  slug?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  data: Record<string, any>;
  metadata: Record<string, any>;
  version: string;
  configurationType: {
    name: string;
    slug: string;
    description: string;
    metadataSchema: string;
    dataSchema: string;
    isActive: boolean;
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  module: {
    parentId: string | null;
    parent: any | null;
    name: string;
    description: string;
    level: number;
    isActive: boolean;
    children: any[];
    configurations: any[];
    id: string;
    createdAt: string;
    updatedAt: string;
  };
  expression?: string;
}

export interface CreateAssociatedConfiguration {
  title: string;
  slug: string; // Obrigatório, regex: ^[a-z0-9_]+$, max: 255
  description?: string;
  configurationTypeId: string;
  moduleId: string;
  baseConfigurationId?: string | null;
  isActive?: boolean;
  version?: string;
  metadata?: Record<string, any>;
  data?: Record<string, any>;
}

export interface UpdateAssociatedConfiguration {
  configurationTypeId: string; // Obrigatório
  moduleId: string; // Obrigatório
  title: string; // Obrigatório, max: 200
  slug: string; // Obrigatório, regex: ^[a-z0-9_]+$, max: 255
  description?: string; // Opcional, max: 500
  baseConfigurationId?: string | null;
  isActive?: boolean;
  version?: string;
  metadata?: Record<string, any>;
  data?: Record<string, any>;
}

export interface CreateAssociation {
  sourceConfigurationId: string;
  targetConfigurationId: string;
  isActive?: boolean;
}
