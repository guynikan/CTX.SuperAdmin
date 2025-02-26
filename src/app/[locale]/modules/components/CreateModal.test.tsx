import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateModal from "./CreateModal";

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();
const mockSetValue = jest.fn();

type CreateModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  value: string;
  setValue: (value: string) => void;
  loading: boolean;
}

const renderCreateModal = (props: Partial<CreateModalProps> = {}) => {
  render(
    <CreateModal
      open={true}
      onClose={mockOnClose}
      onSubmit={mockOnSubmit}
      value=""
      setValue={mockSetValue}
      loading={false}
      {...props} 
    />
  );
};

describe("CreateModal Component", () => {
  it("should render correctly when open", () => {
   
    renderCreateModal();

    expect(screen.getByText("Adicionar Novo Módulo")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();
  });

  it("should call setValue when typing in input", async () => {
    render(
      <CreateModal 
        open={true} 
        onClose={mockOnClose} 
        onSubmit={mockOnSubmit} 
        value="" setValue={mockSetValue} 
        loading={false} />
    );

    await userEvent.type(screen.getByLabelText("Nome"), "Novo Módulo");
    expect(mockSetValue).toHaveBeenCalledWith("N");
  });

  it("should call onSubmit when clicking the add button", async () => {
    
    renderCreateModal();


    await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("should disable add button when loading", () => {
    renderCreateModal({ loading: true });

    expect(screen.getByRole("button", { name: "Adicionar" })).toBeDisabled();
  });

  it("should call onClose when clicking the cancel button", async () => {
    renderCreateModal();
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
