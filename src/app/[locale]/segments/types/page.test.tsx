import { render, screen, waitFor } from "@testing-library/react";
import SegmentTypesPage from "./page";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";
import { useSegmentTypes } from "@/hooks/segments/useSegmentTypes";
import { SegmentType } from "@/types/segments";

jest.mock("@/hooks/segments/useSegmentTypes", () => ({
  useSegmentTypes: jest.fn(),
  useDeleteSegmentType: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false, 
  })),
  useUpdateSegmentType: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/segments/types"),
}));

const mockDictionary = {
  title: "Todos os Tipos de Segmentos",
  registerButton: "Cadastrar Tipo de Segmento",
  loading: "🔄 Carregando Tipos de Segmento...",
  errorTitle: "⚠️ Erro ao carregar os Tipos de Segmento.",
  errorMessage: "Tente novamente mais tarde.",
  table: {
    name: "Nome",
    description: "Descrição",
    priority: "Prioridade",
    actions: "Ações",
  },
};

const mockSegmentTypes: SegmentType[] = [
  { id: "1", name: "Segmento 1", description: "Desc Segmento 1", priority: 0, isActive: true },
  { id: "2", name: "Segmento 2", description: "Desc Segmento 2", priority: 1, isActive: true },
];

const renderWithProvider = async () => {
  render(
    <DictionaryProvider namespace="segments">
      <SegmentTypesPage />
    </DictionaryProvider>
  );
  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("SegmentTypesPage", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  
  });

  it("render page correctly", async () => {
    // Precisei fazer o casting do Mock aqui porque o React Query nao aceita o tipo da função mockReturnValue 
    (useSegmentTypes as jest.Mock).mockReturnValue({ 
      data: mockSegmentTypes,
      isLoading: false,
      isPending: false,
      error: null,
    });

    await renderWithProvider();

    expect(screen.getByText(mockDictionary.title)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.registerButton)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.name)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.description)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.priority)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.actions)).toBeInTheDocument();
  });

  it("shows error message when data load fails", async () => {
    (useSegmentTypes as jest.Mock).mockReturnValue({ 
      data: null,
      isLoading: false,
      error: new Error("Erro na API"),
    });

    await renderWithProvider();

    expect(screen.getByText(mockDictionary.errorTitle)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.errorMessage)).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    (useSegmentTypes as jest.Mock).mockReturnValue({ 
      data: null,
      isLoading: true,
      error: null,
    });

    await renderWithProvider();

    expect(screen.getByText(mockDictionary.loading)).toBeInTheDocument();
  });

  it("render retrieved data inside data grid", async () => {
    (useSegmentTypes as jest.Mock).mockReturnValue({ 
      data: mockSegmentTypes,
      isLoading: false,
      error: null,
    });

    await renderWithProvider();

    expect(screen.getByText("Segmento 1")).toBeInTheDocument();
    expect(screen.getByText("Desc Segmento 1")).toBeInTheDocument();
    expect(screen.getByText(0)).toBeInTheDocument();

    expect(screen.getByText("Segmento 2")).toBeInTheDocument();
    expect(screen.getByText("Desc Segmento 2")).toBeInTheDocument();
    expect(screen.getByText(1)).toBeInTheDocument();
  });

});
