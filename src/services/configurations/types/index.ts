import { httpService } from "@/services/http";
import { ConfigurationType } from "@/types/configuration";

export const getConfigurationTypes = async (): Promise<ConfigurationType[] | undefined> => {
  return await httpService<ConfigurationType[]>({
    path: "/api/ConfigurationType",
    options: { method: "GET" },
  });
};
