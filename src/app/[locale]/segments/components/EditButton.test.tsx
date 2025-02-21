import { render, screen } from "@testing-library/react";
import { SegmentType } from "@/types/segments";
import EditButton from "./EditButton";

const mockSegment: SegmentType = {
  id:"8912410298139123",
  name: "Segment Type test",
  description: "desc test",
  priority: 1,
  isActive: false,
}

describe("EditButton Segment Type List", () => {

  it("render button correctly", async () => {
    render(<EditButton segment={mockSegment} onEdit={() => jest.fn()} />);
    expect(screen.getByTestId("edit-button")).toBeInTheDocument();   
  });

});
