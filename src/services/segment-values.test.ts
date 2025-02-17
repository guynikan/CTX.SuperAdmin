import { 
  getSegmentValues,
  getSegmentValueById,
  createSegmentValue,
  updateSegmentValue,
  deleteSegmentValue,
  getSegmentValuesByType
} from "./segment-values";
import { httpService } from "./http";
import { CreateSegmentValue, SegmentValue } from "@/types/segments";

jest.mock("../services/http", () => ({
  httpService: jest.fn(),
}));

describe("SegmentValue Service", () => {
  const mockSegmentValue: SegmentValue = {
    id: "1",
    segmentTypeId: "10",
    value: "TestValue",
    displayName: "Test Display",
    description: "Some description",
    isActive: true,
  };

  const mockCreateValue: CreateSegmentValue = {
    segmentTypeId: "10",
    value: "NewValue",
    displayName: "New Display",
    description: "New description",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSegmentValues", () => {
    it("should call httpService with the correct path and GET method", async () => {
      (httpService as jest.Mock).mockResolvedValue([mockSegmentValue]);

      const result = await getSegmentValues();
      expect(httpService).toHaveBeenCalledWith({
        path: "/api/SegmentValue",
        options: { method: "GET" },
      });
      expect(result).toEqual([mockSegmentValue]);
    });

    it("deve lidar com erro e repassar a exceção", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Network Error"));

      await expect(getSegmentValues()).rejects.toThrow("Network Error");
    });
  });


  describe("getSegmentValueById", () => {
    it("should call httpService with the correct path and GET method", async () => {
      (httpService as jest.Mock).mockResolvedValue(mockSegmentValue);

      const result = await getSegmentValueById("1");
      expect(httpService).toHaveBeenCalledWith({
        path: "/api/SegmentValue/1",
        options: { method: "GET" },
      });
      expect(result).toEqual(mockSegmentValue);
    });

    it("should throw error if httpService fails", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Not Found"));

      await expect(getSegmentValueById("1")).rejects.toThrow("Not Found");
    });
  });

  describe("createSegmentValue", () => {
    it("should call httpService with path /api/SegmentValue and method POST", async () => {
      (httpService as jest.Mock).mockResolvedValue(mockSegmentValue);

      const result = await createSegmentValue(mockCreateValue);
      expect(httpService).toHaveBeenCalledWith({
        path: "/api/SegmentValue",
        options: {
          method: "POST",
          body: JSON.stringify(mockCreateValue),
        },
      });
      expect(result).toEqual(mockSegmentValue);
    });

    it("should rethrow the exception if it fails", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Invalid Data"));

      await expect(createSegmentValue(mockCreateValue)).rejects.toThrow("Invalid Data");
    });
  });

  describe("updateSegmentValue", () => {
    it("should call httpService with path /api/SegmentValue/:id and PUT method", async () => {
      (httpService as jest.Mock).mockResolvedValue(mockSegmentValue);

      const updatedData = { displayName: "Updated Display" };
      const result = await updateSegmentValue("1", updatedData);

      expect(httpService).toHaveBeenCalledWith({
        path: "/api/SegmentValue/1",
        options: {
          method: "PUT",
          body: JSON.stringify(updatedData),
        },
      });
      expect(result).toEqual(mockSegmentValue);
    });

    it("should throw error if update fails", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Update Error"));

      await expect(updateSegmentValue("1", { displayName: "Fail" })).rejects.toThrow("Update Error");
    });
  });

  describe("deleteSegmentValue", () => {
    it("should call httpService with path /api/SegmentValue/:id and method DELETE", async () => {
      (httpService as jest.Mock).mockResolvedValue(undefined);

      await deleteSegmentValue("1");
      expect(httpService).toHaveBeenCalledWith({
        path: "/api/SegmentValue/1",
        options: { method: "DELETE" },
      });
    });

    it("should throw error if deletion fails", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Delete Error"));

      await expect(deleteSegmentValue("1")).rejects.toThrow("Delete Error");
    });
  });

  describe("getSegmentValuesByType", () => {
    it("should call httpService with path /api/SegmentValue/byType/:segmentTypeId and method GET", async () => {
      (httpService as jest.Mock).mockResolvedValue([mockSegmentValue]);

      const result = await getSegmentValuesByType("10");
      expect(httpService).toHaveBeenCalledWith({
        path: "/api/SegmentValue/byType/10",
        options: { method: "GET" },
      });
      expect(result).toEqual([mockSegmentValue]);
    });

    it("should throw error if request fails", async () => {
      (httpService as jest.Mock).mockRejectedValue(new Error("Type Error"));

      await expect(getSegmentValuesByType("10")).rejects.toThrow("Type Error");
    });
  });
});
