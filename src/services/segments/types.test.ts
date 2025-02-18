// import { 
//   getSegmentTypes,
//   getSegmentTypeById,
//   createSegmentType,
//   updateSegmentType,
//   deleteSegmentType,
// } from "./types";
// import { httpService } from "@/services/http";
// import { CreateSegmentType, SegmentType } from "@/types/segments";

// jest.mock("@/services/http", () => ({
//   httpService: jest.fn(),
// }));

// describe("SegmentType Service", () => {
//   const mockSegmentType: SegmentType = {
//     id: "1",
//     description: "Some description",
//     isActive: true,
//   };

//   const mockCreateType: CreateSegmentType = {
//     value: "NewType",
//     displayName: "New Display",
//     description: "New description",
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   describe("getSegmentTypes", () => {
//     it("should call httpService with the correct path and GET method", async () => {
//       (httpService as jest.Mock).mockResolvedType([mockSegmentType]);

//       const result = await getSegmentTypes();
//       expect(httpService).toHaveBeenCalledWith({
//         path: "/api/SegmentType",
//         options: { method: "GET" },
//       });
//       expect(result).toEqual([mockSegmentType]);
//     });

//     it("deve lidar com erro e repassar a exceção", async () => {
//       (httpService as jest.Mock).mockRejectedType(new Error("Network Error"));

//       await expect(getSegmentTypes()).rejects.toThrow("Network Error");
//     });
//   });


//   describe("getSegmentTypeById", () => {
//     it("should call httpService with the correct path and GET method", async () => {
//       (httpService as jest.Mock).mockResolvedType(mockSegmentType);

//       const result = await getSegmentTypeById("1");
//       expect(httpService).toHaveBeenCalledWith({
//         path: "/api/SegmentType/1",
//         options: { method: "GET" },
//       });
//       expect(result).toEqual(mockSegmentType);
//     });

//     it("should throw error if httpService fails", async () => {
//       (httpService as jest.Mock).mockRejectedType(new Error("Not Found"));

//       await expect(getSegmentTypeById("1")).rejects.toThrow("Not Found");
//     });
//   });

//   describe("createSegmentType", () => {
//     it("should call httpService with path /api/SegmentType and method POST", async () => {
//       (httpService as jest.Mock).mockResolvedType(mockSegmentType);

//       const result = await createSegmentType(mockCreateType);
//       expect(httpService).toHaveBeenCalledWith({
//         path: "/api/SegmentType",
//         options: {
//           method: "POST",
//           body: JSON.stringify(mockCreateType),
//         },
//       });
//       expect(result).toEqual(mockSegmentType);
//     });

//     it("should rethrow the exception if it fails", async () => {
//       (httpService as jest.Mock).mockRejectedType(new Error("Invalid Data"));

//       await expect(createSegmentType(mockCreateType)).rejects.toThrow("Invalid Data");
//     });
//   });

//   describe("updateSegmentType", () => {
//     it("should call httpService with path /api/SegmentType/:id and PUT method", async () => {
//       (httpService as jest.Mock).mockResolvedType(mockSegmentType);

//       const updatedData = { displayName: "Updated Display" };
//       const result = await updateSegmentType("1", updatedData);

//       expect(httpService).toHaveBeenCalledWith({
//         path: "/api/SegmentType/1",
//         options: {
//           method: "PUT",
//           body: JSON.stringify(updatedData),
//         },
//       });
//       expect(result).toEqual(mockSegmentType);
//     });

//     it("should throw error if update fails", async () => {
//       (httpService as jest.Mock).mockRejectedType(new Error("Update Error"));

//       await expect(updateSegmentType("1", { displayName: "Fail" })).rejects.toThrow("Update Error");
//     });
//   });

//   describe("deleteSegmentType", () => {
//     it("should call httpService with path /api/SegmentType/:id and method DELETE", async () => {
//       (httpService as jest.Mock).mockResolvedType(undefined);

//       await deleteSegmentType("1");
//       expect(httpService).toHaveBeenCalledWith({
//         path: "/api/SegmentType/1",
//         options: { method: "DELETE" },
//       });
//     });

//     it("should throw error if deletion fails", async () => {
//       (httpService as jest.Mock).mockRejectedType(new Error("Delete Error"));

//       await expect(deleteSegmentType("1")).rejects.toThrow("Delete Error");
//     });
//   });

//   describe("getSegmentTypesByType", () => {
//     it("should call httpService with path /api/SegmentType/byType/:segmentTypeId and method GET", async () => {
//       (httpService as jest.Mock).mockResolvedType([mockSegmentType]);

//       const result = await getSegmentTypesByType("10");
//       expect(httpService).toHaveBeenCalledWith({
//         path: "/api/SegmentType/byType/10",
//         options: { method: "GET" },
//       });
//       expect(result).toEqual([mockSegmentType]);
//     });

//     it("should throw error if request fails", async () => {
//       (httpService as jest.Mock).mockRejectedType(new Error("Type Error"));

//       await expect(getSegmentTypesByType("10")).rejects.toThrow("Type Error");
//     });
//   });
// });
