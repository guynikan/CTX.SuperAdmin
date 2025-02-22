import { httpService } from "@/services/http";
import { Module, CreateModule } from "@/types/modules";

export const getModules = async (): Promise<Module[] | undefined> => {
  return await httpService<Module[]>({
    path: "/api/Module",
    options: { method: "GET" },
  });
};

export const getModuleById = async (id: string): Promise<Module | undefined> => {
  return await httpService<Module>({
    path: `/api/Module/${id}`,
    options: { method: "GET" },
  });
};

export const createModule = async (module: CreateModule): Promise<Module | undefined> => {
  return await httpService<Module>({
    path: "/api/Module",
    options: {
      method: "POST",
      body: JSON.stringify(module),
    },
  });
};

export const updateModule = async (id: string, module: Partial<Module>): Promise<Module | undefined> => {
  return await httpService<Module>({
    path: `/api/Module/${id}`,
    options: {
      method: "PUT",
      body: JSON.stringify(module),
    },
  });
};

export const deleteModule = async (id: string): Promise<void> => {
  await httpService<void>({
    path: `/api/Module/${id}`,
    options: { method: "DELETE" },
  });
};
