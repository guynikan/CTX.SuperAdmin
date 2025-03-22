import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConfigurationForm from "./ConfigurationForm";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";
import { Item, Section } from "@/types/configuration";
import { toast } from "react-toastify";

jest.mock("./ConfigurationFields", () => jest.fn(() => <div data-testid="fields-component">ConfigurationFields</div>));
jest.mock("./ConfigurationSections", () => jest.fn(() => <div data-testid="sections-component">ConfigurationSections</div>));
jest.mock("@/hooks/useConfiguration", () => ({
  useConfigurationMutations: () => ({
    createItemsMutation: { mutateAsync: jest.fn().mockResolvedValue([]) },
    createSectionMutation: { mutateAsync: jest.fn().mockResolvedValue({ id: "new-section" }) },
    associateItemsToSectionProcess: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/en_US/modules",
}));

jest.mock("react-toastify", () => ({ toast: { success: jest.fn() } }));

const mockFields: Item[] = [
  { id: "1", name: "Field 1", order: 0, properties: "{}", isPersisted: true },
  { id: "2", name: "Field 2", order: 1, properties: "{}", isPersisted: false },
];

const mockSections: Partial<Section>[] = [
  { name: "Section 1", items: ["2"], isPersisted: false },
];

const mockSetFields = jest.fn();
const mockSetSections = jest.fn();

const renderWithProvider = async () => {
  render(
    <DictionaryProvider namespace="modules">
      <ConfigurationForm
        configurationId="config-123"
        fields={mockFields}
        setFields={mockSetFields}
        sections={mockSections}
        setSections={mockSetSections}
      />
    </DictionaryProvider>
  );

  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("ConfigurationForm", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders tabs correctly", async () => {
    await renderWithProvider();
    expect(screen.getByTestId("fields-tab")).toBeInTheDocument();
    expect(screen.getByTestId("sections-tab")).toBeInTheDocument();
    expect(screen.getByTestId("rules-tab")).toBeInTheDocument();
  });

  it("renders fields tab by default", async () => {
    await renderWithProvider();
    expect(screen.getByTestId("fields-component")).toBeInTheDocument();
  });

  it("switches to sections tab on click", async () => {
    await renderWithProvider();
    fireEvent.click(screen.getByTestId("sections-tab"));
    expect(screen.getByTestId("sections-component")).toBeInTheDocument();
  });

  it("calls mutations and updates state on save", async () => {
    await renderWithProvider();
    fireEvent.click(screen.getByText(/salvar configuração/i));

    await waitFor(() => {
      expect(mockSetFields).toHaveBeenCalled();
      expect(mockSetSections).toHaveBeenCalled();
      expect(toast.success).toHaveBeenCalledWith("Configuração atualizada!");
    });
  });
});
