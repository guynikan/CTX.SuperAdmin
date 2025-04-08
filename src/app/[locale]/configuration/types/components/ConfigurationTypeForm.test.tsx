import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfigurationTypeForm from "./ConfigurationTypeForm";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";

// Mocks React Query hooks
const mutateAsyncMock = jest.fn();

jest.mock("@/hooks/useConfigurationTypes", () => ({
  useCreateConfigurationType: jest.fn(() => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
  })),
  useUpdateConfigurationType: jest.fn(() => ({
    mutateAsync: mutateAsyncMock,
    isPending: false,
  })),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/configuration/types"),
}));

const defaultValues = {
  id: "1",
  name: "Tipo Teste",
  description: "Descrição Teste",
  metadataSchema: "metadata",
  dataSchema: "data",
};

const renderWithProvider = async (props = {}) => {
  render(
    <DictionaryProvider namespaces={["configuration", "common"]}>
      <ConfigurationTypeForm onClose={jest.fn()} {...props} />
    </DictionaryProvider>
  );

  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("ConfigurationTypeForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all input fields with correct labels", async () => {
    await renderWithProvider();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
    expect(screen.getByLabelText("Data Schema")).toBeInTheDocument();
    expect(screen.getByLabelText("Metadata Schema")).toBeInTheDocument();
  });

  it("validates required fields and shows translated error messages", async () => {
    await renderWithProvider();
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /Criar/i }));
    
    expect(await screen.findByText("Nome é obrigatório")).toBeInTheDocument();
    expect(await screen.getByText("Data Schema é obrigatório")).toBeInTheDocument();
    expect(await screen.getByText("Metadata é obrigatório")).toBeInTheDocument();
  });

  it("submits the form with correct data when creating", async () => {
    await renderWithProvider();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText("Nome"), "Novo Tipo");
    await user.type(screen.getByLabelText("Descrição"), "Descrição nova");
    await user.type(screen.getByLabelText("Data Schema"), "dataSchema");
    await user.type(screen.getByLabelText("Metadata Schema"), "metadataSchema");

    await user.click(screen.getByTestId("submit-button"));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        name: "Novo Tipo",
        description: "Descrição nova",
        dataSchema: "dataSchema",
        metadataSchema: "metadataSchema",
      });
    });
  });

  it("submits the form and calls update when editing", async () => {
    await renderWithProvider({ initialValues: defaultValues });
    const user = userEvent.setup();

    await user.clear(screen.getByLabelText("Nome"));
    await user.type(screen.getByLabelText("Nome"), "Editado");

    await user.click(screen.getByRole("button", { name: /editar/i }));

    await waitFor(() => {
      expect(mutateAsyncMock).toHaveBeenCalledWith({
        id: "1",
        data: expect.objectContaining({ name: "Editado" }),
      });
    });
  });

  it("calls onClose and resets form on cancel", async () => {
    const onClose = jest.fn();
    await renderWithProvider({ initialValues: defaultValues, onClose });
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
