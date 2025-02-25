import { render, screen } from "@testing-library/react";
import { useDictionary } from "@/i18n/DictionaryProvider";
import EditModal from "./EditModal";
import { SegmentType } from "@/types/segments";

jest.mock("@/i18n/DictionaryProvider", () => ({
  useDictionary: jest.fn(),
}));

jest.mock("./SegmentTypeForm", () => {
  const MockSegmentTypeForm = () => <div data-testid="segment-type-form">Mock Form</div>;
  // ESlint reclama por não ter display name, por isso adicinei
  MockSegmentTypeForm.displayName = "MockSegmentTypeForm"; 
  return MockSegmentTypeForm;
});

const mockSegmentTypes: SegmentType = { id: "1", name: "Segmento 1", description: "Desc Segmento 1", priority: 0, isActive: true };

describe("Create Modal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    (useDictionary as jest.Mock).mockReturnValue({
      dictionary: {
        types: {
          modal: {
            titleEdit: "Editar Tipo de Segmento",
          },
        },
      },
    });
  });

  it("render component correctly", () => {
    render(<EditModal segment={mockSegmentTypes} open={true} onClose={mockOnClose} />);
    expect(screen.getByText("Editar Tipo de Segmento")).toBeInTheDocument();
    expect(screen.getByTestId("segment-type-form")).toBeInTheDocument();
  });
});
