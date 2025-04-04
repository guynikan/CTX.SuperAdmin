import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DeleteButton from "./DeleteButton";

describe("<DeleteButton />", () => {
  const renderButton = (onDelete = jest.fn()) => {
    render(<DeleteButton onDelete={onDelete} />);
    return { onDelete };
  };

  it("renders correctly with correct attributes", () => {
    renderButton();

    const button = screen.getByTestId("delete-button");

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "delete");
    expect(button).toHaveAttribute("data-testid", "delete-button");
  });

  it("calls onDelete when clicked", async () => {
    const user = userEvent.setup();
    const { onDelete } = renderButton();

    await user.click(screen.getByTestId("delete-button"));

    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
