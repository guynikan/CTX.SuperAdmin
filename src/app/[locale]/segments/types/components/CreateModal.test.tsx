import { render, screen } from "@testing-library/react";
import CreateModal from "./CreateModal";

jest.mock("@/hooks/segments/useSegmentValues", () => ({
  useCreateSegmentValue: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false, 
  })),
  useUpdateSegmentValue: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

jest.mock("@/hooks/segments/useSegmentTypes", () => ({
  useCreateSegmentType:jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false, 
  })),
  useUpdateSegmentType: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
}));

const mockDictionary = {
  title: "Criar Segment Type",
};

describe("Modal Create Segment Type", () => {

  it("render modal correctly", async () => {

    render(<CreateModal open={true} onClose={() => {}} />);
    expect(screen.getByText(mockDictionary.title)).toBeInTheDocument();   
  });

});
