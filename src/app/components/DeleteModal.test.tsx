import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import DeleteModal from "./DeleteModal";
import { useDeleteSegmentType } from "@/hooks/segments/useSegmentTypes";
import { useDeleteSegmentValue } from "@/hooks/segments/useSegmentValues";
import { SegmentType, SegmentValue } from "@/types/segments";
import userEvent from "@testing-library/user-event";

jest.mock("@/hooks/segments/useSegmentTypes", () => ({
  useDeleteSegmentType: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false, 
  })),
}));

jest.mock("@/hooks/segments/useSegmentValues", () => ({
  useDeleteSegmentValue: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false, 
  })),
}));

const mockSegmentType: SegmentType = { id: "erF124o81h31239123", name: "Segmento Type A", isActive: false, priority: 1 };
const mockSegmentValue: SegmentValue = { id: "af444jad98897asdh", segmentTypeId:"asda0987a8sd", displayName: "Segmento Value A", isActive: false, value: "1",  };

const deleteSegmentTypeMock = jest.fn().mockResolvedValue({});
const deleteSegmentValueMock = jest.fn().mockResolvedValue({});

describe("DeleteModa Component", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useDeleteSegmentValue as jest.Mock).mockReturnValue({ mutateAsync: deleteSegmentValueMock });
    (useDeleteSegmentType as jest.Mock).mockReturnValue({ mutateAsync: deleteSegmentTypeMock });
  });

  it("should render component correctly with Segment Type ", () => {
    render(<DeleteModal open={true} onClose={mockOnClose} segment={mockSegmentType} />);
    
    expect(screen.getByTestId("remove-title")).toHaveTextContent("Deseja remover O Tipo de Segmento: Segmento Type A?");
    expect(screen.getByRole("button", { name: "Remover" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument(); 
  });
  
  it("should render component correctly with Segment Value ", () => {
    render(<DeleteModal open={true} onClose={mockOnClose} segment={mockSegmentValue} />);
    
    expect(screen.getByTestId("remove-title")).toHaveTextContent("Deseja remover O Valor do Segmento: Segmento Value A?");
    expect(screen.getByRole("button", { name: "Remover" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument(); 
  });

  it("should call deleteSegmentType when removing a SegmentType", async () => {
    render(<DeleteModal open={true} onClose={mockOnClose} segment={mockSegmentType} />);
  
    await userEvent.click(screen.getByRole("button", { name: "Remover" }));

    await waitFor(() => expect(deleteSegmentTypeMock).toHaveBeenCalledWith("erF124o81h31239123"));
    expect(mockOnClose).toHaveBeenCalled();   
  });

  it("should call deleteSegmentValue when removing a SegmentValue", async () => {
    render(<DeleteModal open={true} onClose={mockOnClose} segment={mockSegmentValue} />);
  
    await userEvent.click(screen.getByRole("button", { name: "Remover" }));

    await waitFor(() => expect(deleteSegmentValueMock).toHaveBeenCalledWith("af444jad98897asdh"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should close the modal when clicking the cancel button", () => {
    render(<DeleteModal open={true} onClose={mockOnClose} segment={mockSegmentValue} />);
    
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(mockOnClose).toHaveBeenCalled();
  });

});




