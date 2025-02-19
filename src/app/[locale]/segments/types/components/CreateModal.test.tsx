import { render, screen } from "@testing-library/react";
import CreateModal from "./CreateModal";

jest.mock("@/hooks/segments/useSegmentTypes", () => ({
  useCreateSegmentType:jest.fn(() => ({
    mutate: jest.fn(),
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
