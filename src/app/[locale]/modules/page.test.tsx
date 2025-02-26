import { render, screen, waitFor } from "@testing-library/react";
import ModulesPage from "./page";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";
import { useModules } from "@/hooks/useModules";
import { Module } from "@/types/modules";

jest.mock("@/hooks/useModules", () => ({
  useModules: jest.fn(),
  useCreateModule:jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false, 
  })),
  useDeleteModule: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false, 
  })),
}));
 
jest.mock("./components/Tree", () => () => <div data-testid="tree-flow">Tree Flow</div>);

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/modules"),
}));

const mockModules: Module[] = [
  { id: "1", name: "Module 1", description: "Desc Module 1", level: 0, isActive: true },
  { id: "2", name: "Module 2", description: "Desc Module 2", level: 1, isActive: true },
];

const renderWithProvider = async () => {
  render(
    <DictionaryProvider namespace="modules">
      <ModulesPage />
    </DictionaryProvider>
  );
  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("Modules Page", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("render page correctly as tree view", async () => {
    // Precisei fazer o casting do Mock aqui porque o React Query nao aceita o tipo da função mockReturnValue 
    (useModules as jest.Mock).mockReturnValue({ 
      data: mockModules,
      isLoading: false,
      isPending: false,
      error: null,
    });
    await renderWithProvider();
    expect(screen.getByText("Todos os Módulos")).toBeInTheDocument();
    expect(screen.getByText("Ver como Tabela")).toBeInTheDocument();
  
  });

  it("shows error message when data load fails", async () => {
    (useModules as jest.Mock).mockReturnValue({ 
      data: null,
      isLoading: false,
      error: new Error("Erro na API"),
    });

    await renderWithProvider();

    expect(screen.getByText("⚠️ Erro ao carregar módulos")).toBeInTheDocument();
    expect(screen.getByText("Tente novamente.")).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    (useModules as jest.Mock).mockReturnValue({ 
      data: null,
      isLoading: true,
      error: null,
    });

    await renderWithProvider();

    expect(screen.getByText("🔄 Carregando módulos..")).toBeInTheDocument();
  });

 
});
