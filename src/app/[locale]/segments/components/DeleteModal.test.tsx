import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteModal from "./DeleteModal";
import { toast } from "react-toastify";
import { useDeleteSegmentType } from "@/hooks/segments/useSegmentTypes";
import { useDeleteSegmentValue } from "@/hooks/segments/useSegmentValues";

jest.mock("@/hooks/segments/useSegmentTypes");
jest.mock("@/hooks/segments/useSegmentValues");
jest.mock("react-toastify", () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

describe("DeleteModal", () => {
  const onClose = jest.fn();
  const segmentTypeMock = { id: "1", name: "Segmento A" };
  const segmentValueMock = { id: "2", displayName: "Valor X", segmentTypeId: "1" };

  let deleteSegmentTypeMock: jest.Mock;
  let deleteSegmentValueMock: jest.Mock;

  beforeEach(() => {
    deleteSegmentTypeMock = jest.fn().mockResolvedValue(undefined);
    deleteSegmentValueMock = jest.fn().mockResolvedValue(undefined);
    
    (useDeleteSegmentType as jest.Mock).mockReturnValue({ mutateAsync: deleteSegmentTypeMock });
    (useDeleteSegmentValue as jest.Mock).mockReturnValue({ mutateAsync: deleteSegmentValueMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the modal with the correct text", () => {
    render(<DeleteModal open={true} onClose={onClose} segment={segmentTypeMock} />);

    expect(screen.getByTestId("remove-title")).toHaveTextContent("Deseja remover O Tipo de Segmento: Segmento A?");
    expect(screen.getByRole("button", { name: "Remover" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
  });

  it("should calls deleteSegmentType when removing a SegmentType", async () => {
    render(<DeleteModal open={true} onClose={onClose} segment={segmentTypeMock} />);
    
    fireEvent.click(screen.getByRole("button", { name: "Remover" }));

    await waitFor(() => expect(deleteSegmentTypeMock).toHaveBeenCalledWith("1"));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Tipo de Segmento removido com sucesso!"));
    expect(onClose).toHaveBeenCalled();
  });

  it("should calls delete Segment Value when removing a Segment Value", async () => {
    render(<DeleteModal open={true} onClose={onClose} segment={segmentValueMock} />);
    
    fireEvent.click(screen.getByRole("button", { name: "Remover" }));

    await waitFor(() => expect(deleteSegmentValueMock).toHaveBeenCalledWith("2"));
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Valor de Segmento removido com sucesso!"));
    expect(onClose).toHaveBeenCalled();
  });

  it("should show error if removal fails", async () => {
    deleteSegmentTypeMock.mockRejectedValue(new Error("Erro ao deletar"));
    
    render(<DeleteModal open={true} onClose={onClose} segment={segmentTypeMock} />);
    
    fireEvent.click(screen.getByRole("button", { name: "Remover" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Erro ao remover!"));
    expect(onClose).not.toHaveBeenCalled(); 
  });

  it("should close modal when clicking cancel", () => {
    render(<DeleteModal open={true} onClose={onClose} segment={segmentTypeMock} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onClose).toHaveBeenCalled();
  });

});
