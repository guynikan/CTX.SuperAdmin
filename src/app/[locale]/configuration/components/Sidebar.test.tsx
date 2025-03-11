import { render, screen, waitFor } from "@testing-library/react";
import Sidebar from "./Sidebar";
import { useModules } from "@/hooks/useModules";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";
import userEvent from "@testing-library/user-event";

jest.mock("@/hooks/useModules", () => ({
  useModules: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "pt_BR/modules/mod123"),
}));

const mockModules = [
  { id: "mod123", name: "Módulo Teste", parentId: null },
  { id: "mod456", name: "Outro Módulo", parentId: null },
];

const renderWithProvider = async () => {
  render(
    <DictionaryProvider namespace="modules">
      <Sidebar />
    </DictionaryProvider>
  );
  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("Sidebar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display loading indicator when data is being fetched", async () => {
    (useModules as jest.Mock).mockReturnValue({ data: [], isLoading: true });
    await renderWithProvider();


    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should render modules correctly when data is available", async () => {
    (useModules as jest.Mock).mockReturnValue({ data: mockModules, isLoading: false });
    await renderWithProvider();

    expect(screen.getByText("Módulo Teste")).toBeInTheDocument();
    expect(screen.getByText("Outro Módulo")).toBeInTheDocument();
  });

  it("should apply active styles when module is selected", async () => {
    (useModules as jest.Mock).mockReturnValue({ data: mockModules, isLoading: false });
    await renderWithProvider();

    const activeModule = screen.getByRole("button", { name: "Módulo Teste" });
    await waitFor(() => {
      expect(activeModule).toHaveStyle("background-color: rgb(224, 224, 224); color: black");
    });

  });

  it("should show message when no modules are available", async () => {
    (useModules as jest.Mock).mockReturnValue({ data: [], isLoading: false });
    await renderWithProvider();

    expect(screen.getByText("Nenhum módulo cadastrado")).toBeInTheDocument();
  });

  it("should display loading indicator when data is being fetched", async () => {
    (useModules as jest.Mock).mockReturnValue({ data: [], isLoading: true });
    await renderWithProvider();

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should call handleAddModule when 'Adicionar módulo' button is clicked", async () => {
    const handleAddModuleMock = jest.fn();
    (useModules as jest.Mock).mockReturnValue({ data: mockModules, isLoading: false });
  
    render(
      <DictionaryProvider namespace="modules">
        <Sidebar handleAddModule={handleAddModuleMock} />
      </DictionaryProvider>
    );
  
    await waitFor(() => {
      expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
    });
  
    const addButton = screen.getByRole("button", { name: 'Novo Módulo' });
  
    await userEvent.click(addButton);
  
    expect(handleAddModuleMock).toHaveBeenCalledTimes(1);
  });
  

});



