import { httpService } from "@/services/http";
import { Configuration, CreateConfiguration, UpdateConfiguration } from "@/types/configuration";

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

export const deleteConfiguration = async (id: string): Promise<void> => {
  return await httpService<void>({
    path: `/api/Configuration/${id}`,
    options: { method: "DELETE" },
  });
};

export const updateConfiguration = async (id: string, configuration: UpdateConfiguration): Promise<Configuration | undefined> => {
  return await httpService<Configuration>({
    path: `/api/Configuration/${id}`,
    options: {
      method: "PUT",
      body: JSON.stringify(configuration),
    },
  });
};

export const createConfigurationRuleSet = async (configurationId: string, ruleSet: RuleSet) => {
  return await httpService<Partial<RuleSet>>({
    path: `/api/ConfigurationRule/configuration/${configurationId}/ruleset`,
    options: {
      method: "POST",
      body: JSON.stringify(ruleSet),
    },
  });
};

type RuleSet = {
  name: string,
  logicalOperator: number,
  enabled: boolean,
  priority: number,
  ruleConditions: [
    {
      segmentType: string,
      comparisonOperator: number,
      values: string[]
    }
  ]
}

