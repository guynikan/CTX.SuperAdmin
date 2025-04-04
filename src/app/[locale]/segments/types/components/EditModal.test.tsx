import { render, screen, waitFor } from "@testing-library/react";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";
import EditModal from "./EditModal";
import { SegmentType } from "@/types/segments";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/segments/types"),
}));

jest.mock("./SegmentTypeForm", () => {
  const MockSegmentTypeForm = () => <div data-testid="segment-type-form">Mock Form</div>;
  // ESlint reclama por não ter display name, por isso adicinei
  MockSegmentTypeForm.displayName = "MockSegmentTypeForm"; 
  return MockSegmentTypeForm;
});

const mockSegmentTypes: SegmentType = { id: "1", name: "Segmento 1", description: "Desc Segmento 1", priority: 0, isActive: true };


const renderWithProvider = async () => {
  const mockOnClose = jest.fn();  

  render(
    <DictionaryProvider namespaces={["segments","common"]}>
      <EditModal segment={mockSegmentTypes} open={true} onClose={mockOnClose} />
    </DictionaryProvider>
  );
  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("Edit Modal", () => {
  it("render component correctly", async () => {
    await renderWithProvider();
    expect(screen.getByText("Editar Tipo de Segmento")).toBeInTheDocument();
    expect(screen.getByTestId("segment-type-form")).toBeInTheDocument();
  });
});
