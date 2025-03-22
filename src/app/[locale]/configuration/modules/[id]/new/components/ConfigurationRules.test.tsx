import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConfigurationRules from "./ConfigurationRules";
import { Ruleset } from "@/types/configuration";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";

const initialRuleset: Ruleset = {
  name: "Minha Regra",
  enabled: true,
  priority: 0,
  ruleConditions: [],
};

jest.mock("next/navigation", () => ({
  usePathname: () => "/en_US/modules",
}));

const mockOnChange = jest.fn();

const renderWithProvider = async () => {
  render(
    <DictionaryProvider namespace="modules">
      <ConfigurationRules ruleset={initialRuleset} onChange={mockOnChange} />
    </DictionaryProvider>
  );
  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("ConfigurationRules", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders rule name input and initial rule fields", async () => {
   
    await renderWithProvider();

    expect(screen.getByLabelText("Nome da Regra")).toBeInTheDocument();
    expect(screen.getByLabelText("Segmento")).toBeInTheDocument();
    expect(screen.getByLabelText("Operador")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor")).toBeInTheDocument();
  });

  it("adds a new rule when 'Adicionar Regra' button is clicked", async () => {
   
    await renderWithProvider();

    fireEvent.click(screen.getByRole("button", { name: /adicionar regra/i }));

    const selects = screen.getAllByLabelText("Segmento");
    expect(selects.length).toBe(2); 
  });

  it("updates the segmentType field and triggers onChange", async () => {
   
    await renderWithProvider();
    
    fireEvent.mouseDown(screen.getByLabelText("Segmento"));
    fireEvent.click(screen.getByRole("option", { name: "Status" }));

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("updates the comparisonOperator field correctly", async () => {
   
    await renderWithProvider();

    fireEvent.mouseDown(screen.getAllByLabelText("Operador")[0]);
    fireEvent.click(screen.getByRole("option", { name: "Diferente" }));

    expect(mockOnChange).toHaveBeenCalled();
  });

  it("updates the value field correctly", async () => {
    
    await renderWithProvider();
    
    fireEvent.mouseDown(screen.getByLabelText("Valor"));
    fireEvent.click(screen.getByRole("option", { name: "Não Assistido" }));

    expect(mockOnChange).toHaveBeenCalled();
  });
});
