import { 
  getSegmentTypes,
  getSegmentTypeById,
  createSegmentType,
  updateSegmentType,
  deleteSegmentType
} from "./types";
import { httpService } from "@/services/http";
import { CreateSegmentType, SegmentType } from "@/types/segments";

jest.mock("@/services/http", () => ({
  httpService: jest.fn(),
}));

describe("SegmentType Service", () => {
  const mockSegmentType: SegmentType = {
    id: "1",
    name: "TestType",
    isActive: false,
    priority: 1,
    description: "Test description",
  };

  const mockCreateType: CreateSegmentType = {
    name: "NewType",
    priority: 1,
    description: "New description",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSegmentTypes", () => {
    it("should fetch all segment types", async () => {
      (httpService as jest.Mock).mockResolvedValue([mockSegmentType]);
      const result = await getSegmentTypes();
      expect(httpService).toHaveBeenCalledWith({ path: "/api/SegmentType", options: { method: "GET" } });
      expect(result).toEqual([mockSegmentType]);
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Network Error"));
      await expect(getSegmentTypes()).rejects.toThrow("Network Error");
    });
  });

  describe("getSegmentTypeById", () => {
    it("should fetch a segment type by ID", async () => {
      (httpService as jest.Mock).mockResolvedValue(mockSegmentType);
      const result = await getSegmentTypeById("1");
      expect(httpService).toHaveBeenCalledWith({ path: "/api/SegmentType/1", options: { method: "GET" } });
      expect(result).toEqual(mockSegmentType);
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Not Found"));
      await expect(getSegmentTypeById("1")).rejects.toThrow("Not Found");
    });
  });

  describe("createSegmentType", () => {
    it("should create a new segment type", async () => {
      (httpService as jest.Mock).mockResolvedValue(mockSegmentType);
      const result = await createSegmentType(mockCreateType);
      expect(httpService).toHaveBeenCalledWith({
        path: "/api/SegmentType",
        options: { method: "POST", body: JSON.stringify(mockCreateType) },
      });
      expect(result).toEqual(mockSegmentType);
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Invalid Data"));
      await expect(createSegmentType(mockCreateType)).rejects.toThrow("Invalid Data");
    });
  });

  describe("updateSegmentType", () => {
    it("should update a segment type", async () => {
      (httpService as jest.Mock).mockResolvedValue(mockSegmentType);
      const updatedData = { name: "Updated Name" };
      const result = await updateSegmentType("1", updatedData);
      expect(httpService).toHaveBeenCalledWith({
        path: "/api/SegmentType/1",
        options: { method: "PUT", body: JSON.stringify(updatedData) },
      });
      expect(result).toEqual(mockSegmentType);
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Update Error"));
      await expect(updateSegmentType("1", { name: "Fail" })).rejects.toThrow("Update Error");
    });
  });

  describe("deleteSegmentType", () => {
    it("should delete a segment type", async () => {
      (httpService as jest.Mock).mockResolvedValue(undefined);
      await deleteSegmentType("1");
      expect(httpService).toHaveBeenCalledWith({ path: "/api/SegmentType/1", options: { method: "DELETE" } });
    });

    it("should handle errors", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Delete Error"));
      await expect(deleteSegmentType("1")).rejects.toThrow("Delete Error");
    });
  });
});
