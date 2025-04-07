import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditModal from "./EditModal";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";

// Mocks
jest.mock("./ConfigurationTypeForm", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="configuration-type-form">
      MockForm - {props.initialValues?.name}
      <button onClick={props.onClose}>Close</button>
    </div>
  ),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/configuration/types"),
}));

// Não precisamos mockar useDictionary, pois já usamos o DictionaryProvider real

const mockConfiguration = {
  id: "1",
  name: "Tipo A",
  description: "Descrição A",
};

const renderWithProvider = async (open: boolean, onClose = jest.fn()) => {
  render(
    <DictionaryProvider namespaces={["configuration", "common"]}>
      <EditModal open={open} onClose={onClose} configuration={mockConfiguration} />
    </DictionaryProvider>
  );
  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
  return { onClose };
};

describe("EditModal", () => {
  beforeEach(() => jest.clearAllMocks());

  it("does not render modal content when open is false", async () => {
    await renderWithProvider(false);
    expect(screen.queryByText("Editar Tipo de Configuração")).not.toBeInTheDocument();
  });

  it("renders modal title and form when open is true", async () => {
    await renderWithProvider(true);
    expect(screen.getByText("Editar Tipo de Configuração")).toBeInTheDocument();
    expect(screen.getByTestId("configuration-type-form")).toBeInTheDocument();
    expect(screen.getByText("MockForm - Tipo A")).toBeInTheDocument();
  });

  it("calls onClose when Close button is clicked inside the form", async () => {
    const { onClose } = await renderWithProvider(true);
    const user = userEvent.setup();
    await user.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalled();
  });
});
