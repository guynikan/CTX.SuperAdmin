import { render, screen } from "@testing-library/react";
import EditModal from "./EditModal";
import { SegmentType } from "@/types/segments";

jest.mock("@/hooks/segments/useSegmentTypes", () => ({
  useUpdateSegmentType:jest.fn(() => ({
    mutate: jest.fn(),
  })),

}));

const mockDictionary = {
  title: "Editar Segment Type",
};

const mockSegment: SegmentType = {
  id:"8912410298139123",
  name: "Segment Type test",
  description: "desc test",
  priority: 1,
  isActive: false,
}

describe("Modal Edit Segment Type", () => {

  it("render modal correctly", async () => {
    render(<EditModal segment={mockSegment} open={true} onClose={() => {}} />);
    expect(screen.getByText(mockDictionary.title)).toBeInTheDocument();   
  });

});
