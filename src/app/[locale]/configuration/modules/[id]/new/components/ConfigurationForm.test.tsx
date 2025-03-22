import { render, screen, fireEvent } from "@testing-library/react";
import ConfigurationForm from "./ConfigurationForm";
import { Item, Section } from "@/types/configuration";

jest.mock("./ConfigurationFields", () => jest.fn(() => <div data-testid="fields-component">ConfigurationFields</div>));
jest.mock("./ConfigurationSections", () => jest.fn(() => <div data-testid="sections-component">ConfigurationSections</div>));

const mockFields: Partial<Item>[] = [
  { id: "field1", name: "Campo 1", order: 0, properties: "{}" },
  { id: "field2", name: "Campo 2", order: 1, properties: "{}" },
];

const mockSections: Partial<Section>[] = [
  { id: "section1", name: "Seção 1", items: [{id: "123",name:"field1", order:1, properties:""}] },
  { id: "section2", name: "Seção 2", items: [{id: "1223",name:"field2", order:0, properties:""}] },
];

const mockSetFields = jest.fn();
const mockSetSections = jest.fn();

describe("ConfigurationForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component with tabs", () => {
    render(
      <ConfigurationForm 
        fields={mockFields} 
        sections={mockSections} 
        setFields={mockSetFields} 
        setSections={mockSetSections} 
      />
    );

    expect(screen.getByText("CAMPOS")).toBeInTheDocument();
    expect(screen.getByText("SEÇÕES")).toBeInTheDocument();
    expect(screen.getByText("REGRAS")).toBeInTheDocument();
  });

  it("should render ConfigurationFields when 'CAMPOS' tab is active", () => {
    render(
      <ConfigurationForm 
        fields={mockFields} 
        sections={mockSections} 
        setFields={mockSetFields} 
        setSections={mockSetSections} 
      />
    );

    expect(screen.getByTestId("fields-component")).toBeInTheDocument();
    expect(screen.queryByTestId("sections-component")).not.toBeInTheDocument();
  });

  it("should render ConfigurationSections when 'SEÇÕES' tab is clicked", () => {
    render(
      <ConfigurationForm 
        fields={mockFields} 
        sections={mockSections} 
        setFields={mockSetFields} 
        setSections={mockSetSections} 
      />
    );

    fireEvent.click(screen.getByText("SEÇÕES"));

    expect(screen.getByTestId("sections-component")).toBeInTheDocument();
    expect(screen.queryByTestId("fields-component")).not.toBeInTheDocument();
  });

  it("should call setFields when updating fields", () => {
    render(
      <ConfigurationForm 
        fields={mockFields} 
        sections={mockSections} 
        setFields={mockSetFields} 
        setSections={mockSetSections} 
      />
    );

    fireEvent.click(screen.getByText("CAMPOS"));

    expect(mockSetFields).not.toHaveBeenCalled();
  });

  it("should call setSections when updating sections", () => {
    render(
      <ConfigurationForm 
        fields={mockFields} 
        sections={mockSections} 
        setFields={mockSetFields} 
        setSections={mockSetSections} 
      />
    );

    fireEvent.click(screen.getByText("SEÇÕES"));

    expect(mockSetSections).not.toHaveBeenCalled();
  });
});
