import { render, screen } from "@testing-library/react";
import SegmentValuesPage from "./page";


const mockDictionary = {
  title: "Todos os Valores de Segmentos",
  registerButton: "Cadastrar Valor de Segmento",
  loading: "🔄 Carregando Valores de Segmentos...",
  errorTitle: "⚠️ Erro ao carregar os Valores de Segmentos.",
  errorMessage: "Tente novamente mais tarde.",
  table: {
    displayName: "Nome de Exibição",
    value: "Valor",
    description: "Descrição",
    segmentType: "Tipo de Segmento",
    actions: "Ações",
  },
};

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/login"),
}));

describe("SegmentValuesPage", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render page correctly", async () => {

    await render(<SegmentValuesPage />);

    expect(screen.getByText(mockDictionary.title)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.registerButton)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.displayName)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.value)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.description)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.segmentType)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.actions)).toBeInTheDocument();
  });


  it("render retrieved data inside data grid", async () => {

    await render(<SegmentValuesPage />);


    expect(screen.getByText("Exibição 1")).toBeInTheDocument();
    expect(screen.getByText("Valor 1")).toBeInTheDocument();
    expect(screen.getByText("Descrição do segmento 1")).toBeInTheDocument();
    expect(screen.getByText("Segmento 1")).toBeInTheDocument();

    expect(screen.getByText("Exibição 2")).toBeInTheDocument();
    expect(screen.getByText("Valor 2")).toBeInTheDocument();
    expect(screen.getByText("Descrição do segmento 2")).toBeInTheDocument();
    expect(screen.getByText("Segmento 2")).toBeInTheDocument();
  });


});
