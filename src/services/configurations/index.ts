import { httpService } from "@/services/http";
import { Configuration, CreateConfiguration } from "@/types/configuration";

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

