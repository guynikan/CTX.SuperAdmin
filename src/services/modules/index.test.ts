import { 
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule
} from "./index";
import { httpService } from "@/services/http";
import { CreateModule, Module } from "@/types/modules";

jest.mock("@/services/http", () => ({
  httpService: jest.fn(),
}));

describe("Module Service", () => {
  const mockModule: Module = {
    id: "1",
    name: "Test Module",
    level: 0,
    isActive: true,
    description: "Module description",
  };

  const mockCreateModule: CreateModule = {
    name: "New Module",
    description: "New module description",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getModules", () => {
    it("should fetch all modules", async () => {
      (httpService as jest.Mock).mockResolvedValue([mockModule]);
      const result = await getModules();
      expect(httpService).toHaveBeenCalledWith({ path: "/api/Module", options: { method: "GET" } });
      expect(result).toEqual([mockModule]);
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Network Error"));
      await expect(getModules()).rejects.toThrow("Network Error");
    });
  });

  describe("getModuleById", () => {
    it("should fetch a module by ID", async () => {
      (httpService as jest.Mock).mockResolvedValue(mockModule);
      const result = await getModuleById("1");
      expect(httpService).toHaveBeenCalledWith({ path: "/api/Module/1", options: { method: "GET" } });
      expect(result).toEqual(mockModule);
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Not Found"));
      await expect(getModuleById("1")).rejects.toThrow("Not Found");
    });
  });

  describe("createModule", () => {
    it("should create a new module", async () => {
      (httpService as jest.Mock).mockResolvedValue(mockModule);
      const result = await createModule(mockCreateModule);
      expect(httpService).toHaveBeenCalledWith({
        path: "/api/Module",
        options: { method: "POST", body: JSON.stringify(mockCreateModule) },
      });
      expect(result).toEqual(mockModule);
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Invalid Data"));
      await expect(createModule(mockCreateModule)).rejects.toThrow("Invalid Data");
    });
  });

  describe("updateModule", () => {
    it("should update a module", async () => {
      (httpService as jest.Mock).mockResolvedValue(mockModule);
      const updatedData = { name: "Updated Module" };
      const result = await updateModule("1", updatedData);
      expect(httpService).toHaveBeenCalledWith({
        path: "/api/Module/1",
        options: { method: "PUT", body: JSON.stringify(updatedData) },
      });
      expect(result).toEqual(mockModule);
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Update Error"));
      await expect(updateModule("1", { name: "Fail" })).rejects.toThrow("Update Error");
    });
  });

  describe("deleteModule", () => {
    it("should delete a module", async () => {
      (httpService as jest.Mock).mockResolvedValue(undefined);
      await deleteModule("1");
      expect(httpService).toHaveBeenCalledWith({ path: "/api/Module/1", options: { method: "DELETE" } });
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Delete Error"));
      await expect(deleteModule("1")).rejects.toThrow("Delete Error");
    });
  });
});
