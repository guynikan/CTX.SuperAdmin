import { render, screen, waitFor } from "@testing-library/react";
import SegmentValuesPage from "./page";
import { useSegmentValues } from "@/hooks/segments/useSegmentValues";
import { SegmentType, SegmentValue } from "@/types/segments";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";
import { useSegmentTypes } from "@/hooks/segments/useSegmentTypes";

jest.mock("@/hooks/segments/useSegmentValues", () => ({
  useSegmentValues: jest.fn(),
  useCreateSegmentValue:jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false, 
  })),
  useUpdateSegmentValue: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  useDeleteSegmentValue: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false, 
  })),
}));

jest.mock("@/hooks/segments/useSegmentTypes", () => ({
  useSegmentTypes: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/segments/values"),
}));

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

const mockSegmentValues: SegmentValue[] = [
  { id: "f892487f-52c2-4d97-8be5", displayName: "Valor 1", description: "Desc Valor 1", value: "value 1", segmentTypeId: "2222", isActive: false  },
  { id: "f892487f-52c2-4d97-8be5-d5ef085763b", displayName: "Valor 2", description: "Desc Valor 2", value: "value 2", segmentTypeId: "1111", isActive: true },
];

const mockSegmentTypes: SegmentType[] = [
  { id: "1", name: "Segmento 1", description: "Desc Segmento 1", priority: 0, isActive: true },
  { id: "2", name: "Segmento 2", description: "Desc Segmento 2", priority: 1, isActive: true },
];

const renderWithProvider = async () => {
  render(
    <DictionaryProvider namespace="segments">
      <SegmentValuesPage />
    </DictionaryProvider>
  );
  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("SegmentValuesPage", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    
  });

  it("render page correctly", async () => {

    (useSegmentValues as jest.Mock).mockReturnValue({ 
      data: mockSegmentValues,
      isLoading: false,
      isPending: false,
      error: null,
    });

    (useSegmentTypes as jest.Mock).mockReturnValue({ 
      data: mockSegmentTypes,
    });
    
    await renderWithProvider();

    expect(screen.getByText(mockDictionary.title)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.registerButton)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.displayName)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.value)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.description)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.segmentType)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.table.actions)).toBeInTheDocument();
  });


  it("render retrieved data inside data grid", async () => {

    (useSegmentValues as jest.Mock).mockReturnValue({ 
      data: mockSegmentValues,
      isLoading: false,
      error: null,
    });

    await renderWithProvider();

    expect(screen.getByText("Valor 1")).toBeInTheDocument();
    expect(screen.getByText("Desc Valor 1")).toBeInTheDocument();
    expect(screen.getByText("value 1")).toBeInTheDocument();

    expect(screen.getByText("Valor 2")).toBeInTheDocument();
    expect(screen.getByText("Desc Valor 2")).toBeInTheDocument();
    expect(screen.getByText("value 2")).toBeInTheDocument();
        
  });


});
