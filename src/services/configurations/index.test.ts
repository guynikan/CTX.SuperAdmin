import { 
  createConfiguration,
  createConfigurationItems,
  createConfigurationSection,
  associateSectionItems
} from "./index"; 
import { httpService } from "@/services/http";
import { Configuration, Item, Section } from "@/types/configuration";

jest.mock("@/services/http", () => ({
  httpService: jest.fn(),
}));

describe("Configuration Service", () => {
  const mockConfiguration: Partial<Configuration> = {
    id: "config123",
    title: "Test Config",
    description: "Config description",
    isActive: true,
    configurationTypeId: "type123",
    moduleId: "module123",
  };

  const mockItems: Partial<Item[]> = [
    { name: "Item 1", order: 0, properties: "{}" },
    { name: "Item 2", order: 1, properties: "{}" },
  ];

  const mockSection: Partial<Section> = {
    name: "Section 1",
    order: 0,
    properties: "{}",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createConfiguration", () => {
    it("should create a new configuration", async () => {
      (httpService as jest.Mock).mockResolvedValue(mockConfiguration);
      const result = await createConfiguration(mockConfiguration);

      expect(httpService).toHaveBeenCalledWith({
        path: "/api/Configuration",
        options: { method: "POST", body: JSON.stringify(mockConfiguration) },
      });
      expect(result).toEqual(mockConfiguration);
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Invalid Data"));
      await expect(createConfiguration(mockConfiguration)).rejects.toThrow("Invalid Data");
    });
  });

  describe("createConfigurationItems", () => {
    it("should add items to a configuration", async () => {
      (httpService as jest.Mock).mockResolvedValue(mockItems);
      const result = await createConfigurationItems(mockItems, "config123");

      expect(httpService).toHaveBeenCalledWith({
        path: "/api/Configuration/config123/items/batch",
        options: { method: "POST", body: JSON.stringify(mockItems) },
      });
      expect(result).toEqual(mockItems);
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Item Creation Error"));
      await expect(createConfigurationItems(mockItems, "config123")).rejects.toThrow("Item Creation Error");
    });
  });

  describe("createConfigurationSection", () => {
    it("should create a new section", async () => {
      (httpService as jest.Mock).mockResolvedValue(mockSection);
      const result = await createConfigurationSection(mockSection);

      expect(httpService).toHaveBeenCalledWith({
        path: "/api/Configuration/{id}/sections",
        options: { method: "POST", body: JSON.stringify(mockSection) },
      });
      expect(result).toEqual(mockSection);
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Section Creation Error"));
      await expect(createConfigurationSection(mockSection)).rejects.toThrow("Section Creation Error");
    });
  });

  describe("associateSectionItems", () => {
    it("should associate items with a section", async () => {
      (httpService as jest.Mock).mockResolvedValue(undefined);
      await associateSectionItems(["item1", "item2"], "section123", "config123");

      expect(httpService).toHaveBeenCalledWith({
        path: "/api/Configuration/config123/sections/section123/items",
        options: { method: "POST", body: JSON.stringify(["item1", "item2"]) },
      });
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Association Error"));
      await expect(associateSectionItems(["item1", "item2"], "section123", "config123")).rejects.toThrow("Association Error");
    });
  });
});
