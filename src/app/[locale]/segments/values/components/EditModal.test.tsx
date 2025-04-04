import { render, screen, waitFor } from "@testing-library/react";
import EditModal from "./EditModal";
import { SegmentValue } from "@/types/segments";
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

const mockSegmentValues: SegmentValue = { id: "1", displayName: "Segmento 1", value:"Value 2", description: "Desc Segmento 1", segmentTypeId: "asd", isActive: true };

const renderWithProvider = async () => {
  const mockOnClose = jest.fn();  

  render(
    <DictionaryProvider namespaces={["segments","common"]}>
     <EditModal segment={mockSegmentValues} open={true} onClose={mockOnClose} />
    </DictionaryProvider>
  );
  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("Edit Modal", () => {
  it("render component correctly", async () => {
    await renderWithProvider();
    expect(screen.getByText("Editar Valor de Segmento")).toBeInTheDocument();
    expect(screen.getByTestId("segment-value-form")).toBeInTheDocument();
  });
});
