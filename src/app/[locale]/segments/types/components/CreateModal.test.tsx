import { render, screen } from "@testing-library/react";
import CreateModal from "./CreateModal";
import { useDictionary } from "@/i18n/DictionaryProvider";

jest.mock("@/i18n/DictionaryProvider", () => ({
  useDictionary: jest.fn(),
}));

jest.mock("./SegmentTypeForm", () => {
  const MockSegmentTypeForm = () => <div data-testid="segment-type-form">Mock Form</div>;
  // ESlint reclama por não ter display name, por isso adicinei
  MockSegmentTypeForm.displayName = "MockSegmentTypeForm"; 
  return MockSegmentTypeForm;
});

describe("Create Modal", () => {
  const mockOnClose = jest.fn();  

  beforeEach(() => {
    (useDictionary as jest.Mock).mockReturnValue({
      dictionary: {
        types: {
          modal: {
            titleCreate: "Criar Novo Tipo de Segmento",
          },
        },
      },
    });
  });

  it("render component correctly", () => {
    render(<CreateModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText("Criar Novo Tipo de Segmento")).toBeInTheDocument();
    expect(screen.getByTestId("segment-type-form")).toBeInTheDocument();
  });
});
