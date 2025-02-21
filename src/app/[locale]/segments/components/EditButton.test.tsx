import { fireEvent, render, screen } from "@testing-library/react";
import { SegmentType, SegmentValue } from "@/types/segments";
import EditButton from "./EditButton";

const mockSegment: SegmentType = {
  id:"8912410298139123",
  name: "Segment Type test",
  description: "desc test",
  priority: 1,
  isActive: false,
}

const mockSegmentValue: SegmentValue = {
  id:"8912410298139123",
  displayName: "Segment Type test",
  description: "desc test",
  segmentTypeId: "123123",
  value: "false",
  isActive: false
}

describe("EditButton Segment Type List", () => {

  it("should render correctly for both SegmentType and SegmentValue", () => {
    const { rerender } = render(<EditButton segment={mockSegment} onEdit={() => {}} />);
    
    expect(screen.getByTestId("edit-button")).toBeInTheDocument();
  
    rerender(<EditButton segment={mockSegmentValue} onEdit={() => {}} />);
    
    expect(screen.getByTestId("edit-button")).toBeInTheDocument();
  });
  

  it("should call onEdit with SegmentValue when clicked", () => {
    const onEditMock = jest.fn();
    
    render(<EditButton segment={mockSegmentValue} onEdit={onEditMock} />);
    
    fireEvent.click(screen.getByTestId("edit-button"));
    
    expect(onEditMock).toHaveBeenCalledTimes(1);
    expect(onEditMock).toHaveBeenCalledWith(mockSegmentValue);
  });

  it("should call onEdit with SegmentType when clicked", () => {
    const onEditMock = jest.fn();
    
    render(<EditButton segment={mockSegment} onEdit={onEditMock} />);
    
    fireEvent.click(screen.getByTestId("edit-button"));
    
    expect(onEditMock).toHaveBeenCalledTimes(1);
    expect(onEditMock).toHaveBeenCalledWith(mockSegment);
  });

});
