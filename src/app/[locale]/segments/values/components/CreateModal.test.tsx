import { render, screen } from "@testing-library/react";
import CreateModal from "./CreateModal";
import { useDictionary } from "@/i18n/DictionaryProvider";

jest.mock("@/i18n/DictionaryProvider", () => ({
  useDictionary: jest.fn(),
}));

jest.mock("./SegmentValueForm", () => {
  const MockSegmentValueForm = () => <div data-testid="segment-value-form">Mock Form</div>;
  // ESlint reclama por não ter display name, por isso adicinei
  MockSegmentValueForm.displayName = "MockSegmentValueForm"; 
  return MockSegmentValueForm;
});

describe("Create Modal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    (useDictionary as jest.Mock).mockReturnValue({
      dictionary: {
        values: {
          modal: {
            titleCreate: "Criar Novo Segmento",
          },
        },
      },
    });
  });

  it("render component correctly", () => {
    render(<CreateModal open={true} onClose={mockOnClose} />);
    expect(screen.getByText("Criar Novo Segmento")).toBeInTheDocument();
    expect(screen.getByTestId("segment-value-form")).toBeInTheDocument();
  });
});
