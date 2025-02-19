import { render, screen } from "@testing-library/react";
import DeleteModal from "./DeleteModal";
import { SegmentType } from "@/types/segments";

jest.mock("@/hooks/segments/useSegmentTypes", () => ({
  useDeleteSegmentType:jest.fn(() => ({
    mutate: jest.fn(),
  })),

}));

const mockSegment: SegmentType = {
  id:"8912410298139123",
  name: "Segment Type test",
  description: "desc test",
  priority: 1,
  isActive: false,
}

describe("Modal Delete Segment Type", () => {

  it("render modal correctly", async () => {
    render(<DeleteModal open={true} segment={mockSegment} onClose={() => {}} />);
    expect(screen.getByTestId("remove-title")).toBeInTheDocument();   
  });

});
