import { getConfigurationTypes } from "@/services/configurations/types";
import { httpService } from "@/services/http";

jest.mock("@/services/http", () => ({
  httpService: jest.fn(),
}));

describe("getConfigurationTypes", () => {
  it("deve retornar os tipos de configuração quando a requisição for bem-sucedida", async () => {

    const mockResponse = [
      { id: 1, name: "Config 1" },
      { id: 2, name: "Config 2" },
    ];
    httpService.mockResolvedValue(mockResponse);

    const result = await getConfigurationTypes();

    expect(httpService).toHaveBeenCalledWith({
      path: "/api/ConfigurationType",
      options: { method: "GET" },
    });
    expect(result).toEqual(mockResponse);
  });

  it("deve retornar undefined quando a requisição falhar", async () => {

    httpService.mockRejectedValue(new Error("Erro na API"));

    const result = await getConfigurationTypes();

    expect(httpService).toHaveBeenCalledWith({
      path: "/api/ConfigurationType",
      options: { method: "GET" },
    });
    console.log({result})
    expect(result).toBeUndefined();
  });
});
