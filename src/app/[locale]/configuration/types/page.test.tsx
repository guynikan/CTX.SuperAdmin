import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";
import ConfigurationTypesPage from "./page";
import { useConfigurationTypes } from "@/hooks/useConfigurationTypes";

jest.mock("@/hooks/useConfigurationTypes", () => ({
  useConfigurationTypes: jest.fn(),
  useDeleteConfigurationType: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  useCreateConfigurationType: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
  useUpdateConfigurationType: jest.fn(() => ({
    mutateAsync: jest.fn(),
    isPending: false,
  })),
}));

jest.mock("@/app/components/EditButton", () => (props) => (
  <button data-testid="edit-button" onClick={() => props.onEdit(props.item)}>Editar</button>
));

jest.mock("@/app/components/DeleteButton", () => (props) => (
  <button data-testid="delete-button" onClick={props.onDelete}>Excluir</button>
));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/configuration/types"),
}));

const mockConfigurations = [
  { id: "1", name: "Tipo A", description: "Descricao A" },
  { id: "2", name: "Tipo B", description: "Descricao B" },
];

const renderWithProvider = async () => {
  render(
    <DictionaryProvider namespaces={["configuration", "common"]}>
      <ConfigurationTypesPage />
    </DictionaryProvider>
  );
  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("ConfigurationTypesPage", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders error message", async () => {
    (useConfigurationTypes as jest.Mock).mockReturnValue({ data: null, isLoading: false, error: new Error("Erro") });
    await renderWithProvider();
    expect(screen.getByText("⚠️ Erro ao carregar")).toBeInTheDocument();
  });

  it("renders list of configuration types", async () => {
    (useConfigurationTypes as jest.Mock).mockReturnValue({ data: mockConfigurations, isLoading: false, error: null });
    await renderWithProvider();

    mockConfigurations.forEach((c) => {
      expect(screen.getByText(c.name)).toBeInTheDocument();
      expect(screen.getByText(c.description)).toBeInTheDocument();
    });

    expect(screen.getAllByTestId("edit-button").length).toBe(mockConfigurations.length);
    expect(screen.getAllByTestId("delete-button").length).toBe(mockConfigurations.length);
  });

  it("opens create modal when clicking 'Criar'", async () => {
    (useConfigurationTypes as jest.Mock).mockReturnValue({ data: [], isLoading: false, error: null });
    await renderWithProvider();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /criar/i }));
    expect(await screen.findByText("Criar Tipo de Configuração")).toBeInTheDocument();
  });
});
