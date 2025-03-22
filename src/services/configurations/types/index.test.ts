import { getConfigurationTypes } from "./index";
import { httpService } from "@/services/http";

jest.mock("@/services/http", () => ({
  httpService: jest.fn(),
}));

describe("getConfigurationTypes", () => {
  it("should return configuration types when the request is successful", async () => {
    // Arrange
    const mockResponse = [
      { id: 1, name: "Config 1" },
      { id: 2, name: "Config 2" },
    ];
    (httpService as jest.Mock).mockResolvedValue(mockResponse);

    // Act
    const result = await getConfigurationTypes();

    // Assert
    expect(httpService).toHaveBeenCalledWith({
      path: "/api/ConfigurationType",
      options: { method: "GET" },
    });
    expect(result).toEqual(mockResponse);
  });

  it("should throw an error when the request fails", async () => {
    // Arrange
    const mockError = new Error("Erro tratado pelo defaultErrorHandling");
    (httpService as jest.Mock).mockRejectedValue(mockError);

    // Act + Assert
    await expect(getConfigurationTypes()).rejects.toThrow(
      "Erro tratado pelo defaultErrorHandling"
    );
    expect(httpService).toHaveBeenCalledWith({
      path: "/api/ConfigurationType",
      options: { method: "GET" },
    });
  });
});
