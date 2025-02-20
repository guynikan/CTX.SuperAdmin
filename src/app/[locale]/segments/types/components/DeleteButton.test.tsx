import { render, screen } from "@testing-library/react";
import { SegmentType } from "@/types/segments";
import DeleteButton from "./DeleteButton";

const mockSegment: SegmentType = {
  id:"8912410298139123",
  name: "Segment Type test",
  description: "desc test",
  priority: 1,
  isActive: false,
}

describe("DeleteButton Segment Type List", () => {

  it("render button correctly", async () => {
    render(<DeleteButton segment={mockSegment} onDelete={() => jest.fn()} />);
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();   
  });

});
