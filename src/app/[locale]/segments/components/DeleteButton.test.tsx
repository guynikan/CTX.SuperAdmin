import { render, screen, fireEvent } from "@testing-library/react";
import DeleteButton from "./DeleteButton";

describe("DeleteButton Component", () => {
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the delete button", () => {
    render(<DeleteButton onDelete={mockOnDelete} />);
    
    const button = screen.getByTestId("delete-button");
    expect(button).toBeInTheDocument();
  });

  it("should call onDelete when clicked", () => {
    render(<DeleteButton onDelete={mockOnDelete} />);

    const button = screen.getByTestId("delete-button");
    fireEvent.click(button);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it("should have the correct color and size", () => {
    render(<DeleteButton onDelete={mockOnDelete} />);

    const button = screen.getByTestId("delete-button");

    expect(button).toHaveAttribute("aria-label", "delete");
    expect(button).toHaveClass("MuiIconButton-sizeSmall"); 
  });
});
