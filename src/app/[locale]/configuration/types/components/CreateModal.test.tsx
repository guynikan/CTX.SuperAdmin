import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateModal from "./CreateModal";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";

// Mocks
jest.mock("./ConfigurationTypeForm", () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="configuration-type-form">
      MockForm (create)
      <button onClick={props.onClose}>Close</button>
    </div>
  ),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/configuration/types"),
}));

const renderWithProvider = async (open: boolean, onClose = jest.fn()) => {
  render(
    <DictionaryProvider namespaces={["configuration", "common"]}>
      <CreateModal open={open} onClose={onClose} />
    </DictionaryProvider>
  );

  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });

  return { onClose };
};

describe("CreateModal", () => {
  beforeEach(() => jest.clearAllMocks());

  it("does not render modal content when open is false", async () => {
    await renderWithProvider(false);
    expect(screen.queryByText("Criar Tipo de Configuração")).not.toBeInTheDocument();
  });

  it("renders modal title and form when open is true", async () => {
    await renderWithProvider(true);
    expect(screen.getByText("Criar Tipo de Configuração")).toBeInTheDocument();
    expect(screen.getByTestId("configuration-type-form")).toBeInTheDocument();
    expect(screen.getByText("MockForm (create)")).toBeInTheDocument();
  });

  it("calls onClose when Close button is clicked inside the form", async () => {
    const { onClose } = await renderWithProvider(true);
    const user = userEvent.setup();
    await user.click(screen.getByText("Close"));
    expect(onClose).toHaveBeenCalled();
  });
});
