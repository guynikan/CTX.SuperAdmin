import { render, screen, waitFor } from "@testing-library/react";
import CreateModal from "./CreateModal";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/segments/types"),
}));

jest.mock("./SegmentTypeForm", () => {
  const MockSegmentTypeForm = () => <div data-testid="segment-type-form">Mock Form</div>;
  // ESlint reclama por não ter display name, por isso adicinei
  MockSegmentTypeForm.displayName = "MockSegmentTypeForm"; 
  return MockSegmentTypeForm;
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
    expect(screen.getByText("Criar Tipo de Segmento")).toBeInTheDocument();
    expect(screen.getByTestId("segment-type-form")).toBeInTheDocument();
  });
});
