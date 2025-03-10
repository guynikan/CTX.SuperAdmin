import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CreateModuleModal from "./CreateModal";

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();
const mockSetValue = jest.fn();

type ModuleFormData = {
  name: string;
  description?: string;
  parentId?: string; 
};

type CreateModuleModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ModuleFormData) => void;
  parentId?: string; 
  setModuleData: (data: { name: string; description: string }) => void;
  loading: boolean;
}

const renderCreateModal = (props: Partial<CreateModuleModalProps> = {}) => {
  render(
    <CreateModuleModal
      open={true}
      onClose={mockOnClose}
      onSubmit={mockOnSubmit}
      moduleData={{ name: "", description: "" }} // Corrigido
      setModuleData={mockSetValue}
      loading={false}
      {...props}
    />
  );
};
describe("CreateModuleModal Component", () => {
  it("should render correctly when open", () => {
   
    renderCreateModal();

    expect(screen.getByText("Adicionar Novo Módulo")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();
  });

  it("should call onSubmit when clicking the add button", async () => {    
    renderCreateModal();
    await userEvent.type(screen.getByLabelText("Nome"), "Novo Módulo");

    await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("should call onClose when clicking the cancel button", async () => {
    renderCreateModal();
    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should display 'Adicionar Novo Submódulo' when parentId is provided", () => {
    renderCreateModal({ parentId: "123" });
  
    expect(screen.getByText("Adicionar Novo Submódulo")).toBeInTheDocument();
  });
  
  it("should show validation error if 'Nome' is empty and submit is clicked", async () => {
    renderCreateModal();
  
    await userEvent.click(screen.getByRole("button", { name: "Adicionar" }));
    
    expect(await screen.findByText("O nome do módulo é obrigatório")).toBeInTheDocument();
  });
  
  it("should close modal when ESC is pressed", async () => {
    renderCreateModal();
  
    await userEvent.keyboard("{Escape}");
    expect(mockOnClose).toHaveBeenCalled();
  });
});
