import { render, screen, waitFor } from "@testing-library/react";
import CreateModal from "./CreateModal";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/segments/types"),
}));

jest.mock("./SegmentValueForm", () => {
  const MockSegmentValueForm = () => <div data-testid="segment-value-form">Mock Form</div>;
  // ESlint reclama por não ter display name, por isso adicinei
  MockSegmentValueForm.displayName = "MockSegmentValueForm"; 
  return MockSegmentValueForm;
});

const renderWithProvider = async () => {
  const mockOnClose = jest.fn();  

  render(
    <DictionaryProvider namespaces={["segments","common"]}>
      <CreateModal open={true} onClose={mockOnClose} />
    </DictionaryProvider>
  );
  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("Create Modal", () => {
  it("render component correctly", async () => {
    await renderWithProvider();
    expect(screen.getByText("Criar Valor de Segmento")).toBeInTheDocument();
    expect(screen.getByTestId("segment-value-form")).toBeInTheDocument();
  });
});
