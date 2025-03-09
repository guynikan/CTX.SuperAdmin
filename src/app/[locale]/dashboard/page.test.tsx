import { render, screen, waitFor } from "@testing-library/react";
import ModulesPage from "../modules/page";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/modules"),
}));


const renderWithProvider = async () => {
  render(
    <DictionaryProvider namespace="modules">
      <ModulesPage />
    </DictionaryProvider>
  );
  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("Modules Page", () => {
  
  it("render page correctly", async () => {
    await renderWithProvider();
    expect(screen.getByText("HOME MODULES")).toBeInTheDocument();
  });
 
});
