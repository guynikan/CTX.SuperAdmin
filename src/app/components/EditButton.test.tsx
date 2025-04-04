import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditButton from "./EditButton";

describe("<EditButton />", () => {
  const setup = (props?: Partial<Parameters<typeof EditButton>[0]>) => {
    const item = props?.item ?? { id: "1", name: "Test" };
    const onEdit = props?.onEdit ?? jest.fn();

    render(<EditButton item={item} onEdit={onEdit} />);
    const button = screen.getByTestId("edit-button");

    return {
      button,
      item,
      onEdit,
    };
  };

  it("renders the edit icon button with correct attributes", () => {
    const { button } = setup();

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "edit");
    expect(button).toHaveClass("MuiIconButton-sizeSmall");
  });

  it("calls onEdit with the provided item when clicked", async () => {
    const user = userEvent.setup();
    const { button, item, onEdit } = setup();

    await user.click(button);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(item);
  });

  it("calls onEdit with undefined if no item is provided", async () => {
    const user = userEvent.setup();
    const onEditMock = jest.fn();

    render(<EditButton onEdit={onEditMock} />);
    const button = screen.getByTestId("edit-button");

    await user.click(button);

    expect(onEditMock).toHaveBeenCalledTimes(1);
    expect(onEditMock).toHaveBeenCalledWith(undefined);
  });
});
