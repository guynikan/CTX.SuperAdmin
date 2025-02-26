import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteModal from "./DeleteModal";
import userEvent from "@testing-library/user-event";

const mockOnClose = jest.fn();
const mockConfirmDelete = jest.fn();
const mockModule = { id: "mod123", name: "Módulo Teste" };

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/modules"),
}));

type DeleteModalProps = {
  open: boolean;
  onClose: () => void;
  confirmDelete: (nodeId: string) => void;
  module: { id: string; name: string } | null;
  hasChildren: boolean;
};

const renderDeleteModal = (props: Partial<DeleteModalProps> = {}) => {
  render(
    <DeleteModal
      open={true}
      onClose={mockOnClose}
      confirmDelete={mockConfirmDelete}
      module={mockModule}
      hasChildren={false}
      {...props}
    />
  );
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("DeleteModal Component", () => {
  it("should render correctly when opened", () => {
    renderDeleteModal()

    expect(screen.getByText("Deseja remover o módulo?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remover" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar" })).toBeInTheDocument();
  });

  it("should call delete function when confirming", async () => {
    renderDeleteModal();

    await userEvent.click(screen.getByRole("button", { name: "Remover" }));
    await waitFor(() => expect(mockConfirmDelete).toHaveBeenCalled());
  });

  it("should close the modal when clicking the 'Close' button'", () => {
    renderDeleteModal();

    fireEvent.click(screen.getByRole("button", { name: "Fechar" }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should not allow deletion if module has children", () => {
    renderDeleteModal({ hasChildren: true });

    expect(screen.getByText("Não é possível remover o módulo, pois ele contém submódulos.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remover" })).not.toBeInTheDocument();
  });
});
