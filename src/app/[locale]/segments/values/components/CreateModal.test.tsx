import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import CreateModal from "./CreateModal";

import { DictionaryProvider } from "@/i18n/DictionaryProvider";
import { SegmentType } from "@/types/segments";
import { useSegmentTypes } from "@/hooks/segments/useSegmentTypes";
import { useCreateSegmentValue } from "@/hooks/segments/useSegmentValues";

import { toast } from "react-toastify";

jest.mock("@/hooks/segments/useSegmentTypes", () => ({
  useSegmentTypes: jest.fn(),
}));

jest.mock("@/hooks/segments/useSegmentValues", () => ({
  useCreateSegmentValue:jest.fn(() => ({
    mutate: jest.fn(),
  })),
}));

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/segments/values"),
}));

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockSegmentTypes: SegmentType[] = [
  { id: "1", name: "Segmento 1", description: "Desc Segmento 1", priority: 0, isActive: true },
  { id: "2", name: "Segmento 2", description: "Desc Segmento 2", priority: 1, isActive: true },
];

const renderWithProvider = async () => {
  render(
    <DictionaryProvider namespace="segments">
      <CreateModal open={true} onClose={() => {}} /> />
    </DictionaryProvider>
  );
  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("Modal Create Segment Value", () => {

  it("render modal correctly", async () => {
   (useSegmentTypes as jest.Mock).mockReturnValue({ 
      data: mockSegmentTypes,
    });
    await renderWithProvider()
    expect(screen.getByText("Criar Valor de Segmento")).toBeInTheDocument();   
  });

  it("should display validation errors when submitting empty form", async () => {
    (useSegmentTypes as jest.Mock).mockReturnValue({ data: mockSegmentTypes, isLoading: false });

    await  renderWithProvider();
    fireEvent.click(screen.getByText("Criar"));

    await waitFor(() => {
      expect(screen.getByText("O Tipo de Segmento é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("O Nome de Exibição é obrigatório")).toBeInTheDocument();
      expect(screen.getByText("O Valor é obrigatório")).toBeInTheDocument();
    });
  });

  it("should call API on form submission", async () => {
    (useSegmentTypes as jest.Mock).mockReturnValue({ data: mockSegmentTypes, isLoading: false });
    const mutateAsyncMock = jest.fn().mockResolvedValue({});
    (useCreateSegmentValue as jest.Mock).mockReturnValue({ mutateAsync: mutateAsyncMock });

    await  renderWithProvider();

    fireEvent.mouseDown(screen.getByLabelText("Tipo de Segmento"));
    const option = await screen.findByText("Segmento 1");
    fireEvent.click(option);  
    fireEvent.change(screen.getByLabelText("Nome de Exibição"), { target: { value: "Test Name" } });
    fireEvent.change(screen.getByLabelText("Valor"), { target: { value: "Test Value" } });

    fireEvent.click(screen.getByText("Criar"));

    await waitFor(() => expect(mutateAsyncMock).toHaveBeenCalled());

    expect(toast.success).toHaveBeenCalledWith("Valor de Segmento criado com sucesso!");


  });

  it("should show error toast if API call fails", async () => {
    (useSegmentTypes as jest.Mock).mockReturnValue({ data: mockSegmentTypes, isLoading: false });
    const mutateAsyncMock = jest.fn().mockRejectedValue(new Error("API Error"));
    (useCreateSegmentValue as jest.Mock).mockReturnValue({ mutateAsync: mutateAsyncMock });

    await renderWithProvider();

    fireEvent.mouseDown(screen.getByLabelText("Tipo de Segmento"));
    const option = await screen.findByText("Segmento 1");
    fireEvent.click(option);  
    
    fireEvent.change(screen.getByLabelText("Nome de Exibição"), { target: { value: "Test Name" } });
    fireEvent.change(screen.getByLabelText("Valor"), { target: { value: "Test Value" } });
    fireEvent.click(screen.getByText("Criar"));

    await waitFor(() => expect(mutateAsyncMock).toHaveBeenCalled());

    expect(toast.error).toHaveBeenCalled();
  });


});
