import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteModal from "./DeleteModal";

type MockEntity = { id: string; name: string };

const mockEntity: MockEntity = {
  id: "abc123",
  name: "Entidade de Teste",
};

describe("<DeleteModal />", () => {
  const renderModal = (props?: Partial<React.ComponentProps<typeof DeleteModal<MockEntity>>>) => {
    const onClose = props?.onClose ?? jest.fn();
    const onDelete = props?.onDelete ?? jest.fn().mockResolvedValue(undefined);
    const entity = props?.entity ?? mockEntity;

    render(
      <DeleteModal
        open={true}
        entityName="Tipo"
        entity={entity}
        getEntityDisplayName={(e) => e.name}
        onClose={onClose}
        onDelete={onDelete}
        {...props}
      />
    );

    return { onClose, onDelete, entity };
  };

  it("renders confirmation message with entity display name", () => {
    renderModal();
    expect(screen.getByTestId("remove-title")).toHaveTextContent(
      "Deseja remover Tipo: Entidade de Teste"
    );
  });

  it("calls onDelete and onClose when confirm is clicked", async () => {
    const user = userEvent.setup();
    const { onDelete, onClose } = renderModal();

    await user.click(screen.getByRole("button", { name: /remover/i }));

    expect(onDelete).toHaveBeenCalledWith(mockEntity.id);
    expect(onClose).toHaveBeenCalled();
  });

  it("calls only onClose when cancel is clicked", async () => {
    const user = userEvent.setup();
    const { onClose, onDelete } = renderModal();

    await user.click(screen.getByRole("button", { name: /cancelar/i }));

    expect(onClose).toHaveBeenCalled();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("shows loading state during deletion", async () => {
    const slowDelete = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 300)));
    const user = userEvent.setup();

    renderModal({ onDelete: slowDelete });

    const button = screen.getByRole("button", { name: /remover/i });
    await user.click(button);

    expect(screen.getByRole("button", { name: /removendo/i })).toBeDisabled();
  });

  it("does not call onDelete if entity.id is missing", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    renderModal({
      entity: { name: "Sem ID" } as any,
      onDelete,
    });

    await user.click(screen.getByRole("button", { name: /remover/i }));

    expect(onDelete).not.toHaveBeenCalled();
  });

  it("does not render modal when open is false", () => {
    render(
      <DeleteModal
        open={false}
        onClose={jest.fn()}
        entity={mockEntity}
        entityName="Tipo"
        getEntityDisplayName={(e) => e.name}
        onDelete={jest.fn()}
      />
    );

    expect(screen.queryByTestId("remove-title")).not.toBeInTheDocument();
  });
});
