import { render, screen } from "@testing-library/react";
import { useDictionary } from "@/i18n/DictionaryProvider";
import EditModal from "./EditModal";
import { SegmentValue } from "@/types/segments";

jest.mock("@/i18n/DictionaryProvider", () => ({
  useDictionary: jest.fn(),
}));

jest.mock("./SegmentValueForm", () => {
  const MockSegmentValueForm = () => <div data-testid="segment-value-form">Mock Form</div>;
  // ESlint reclama por não ter display name, por isso adicinei
  MockSegmentValueForm.displayName = "MockSegmentValueForm"; 
  return MockSegmentValueForm;
});

const mockSegmentValues: SegmentValue = { id: "1", displayName: "Segmento 1", value:"Value 2", description: "Desc Segmento 1", segmentTypeId: "asd", isActive: true };

describe("Create Modal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    (useDictionary as jest.Mock).mockReturnValue({
      dictionary: {
        values: {
          modal: {
            titleEdit: "Editar Valor de Segmento",
          },
        },
      },
    });
  });

  it("render component correctly", () => {
    render(<EditModal segment={mockSegmentValues} open={true} onClose={mockOnClose} />);
    expect(screen.getByText("Editar Valor de Segmento")).toBeInTheDocument();
    expect(screen.getByTestId("segment-value-form")).toBeInTheDocument();
  });
});
