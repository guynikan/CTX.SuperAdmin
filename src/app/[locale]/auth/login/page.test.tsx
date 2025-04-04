import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "./page";
import { DictionaryProvider } from "@/i18n/DictionaryProvider";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/pt_BR/login"),
}));

const mockDictionary = {
  signIn: "Entrar",
  username: "Usuário",
  password: "Senha",
  required: "Campo obrigatório",
  forgot_password: "Esqueci minha senha",
};

const renderWithProvider = async () => {
  render(
    <DictionaryProvider namespaces={["auth","common"]}>
      <LoginPage />
    </DictionaryProvider>
  );
  await waitFor(() => {
    expect(screen.queryByText("Carregando traduções...")).not.toBeInTheDocument();
  });
};

describe("LoginPage", () => {
  it("render page correctly", async () => {
    await renderWithProvider();
    
    expect(screen.getByText(mockDictionary.signIn)).toBeInTheDocument();
    expect(screen.getByLabelText(mockDictionary.username)).toBeInTheDocument();
    expect(screen.getByLabelText(mockDictionary.password)).toBeInTheDocument();
    expect(screen.getByText(mockDictionary.forgot_password)).toBeInTheDocument();
  });

  it("shows error messages when trying to submit without filling the fields", async () => {
    await renderWithProvider();
    fireEvent.click(screen.getByTestId('signin-button'));
    await waitFor(() => {
      expect(screen.queryAllByText(mockDictionary.required)[0]).toBeInTheDocument();
    });
  });

  it("should not allow form submission if there are validation errors", async () => {
    await renderWithProvider();
    
    const submitButton = screen.getByTestId("signin-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryAllByText(mockDictionary.required)[0]).toBeInTheDocument();
    });
  });

  it("fill in the fields correctly", async () => {
    await renderWithProvider();

    const username = screen.getByLabelText(mockDictionary.username);
    const passwordInput = screen.getByLabelText(mockDictionary.password);

    fireEvent.change(username, { target: { value: "lincolixavier@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "senha123" } });

    expect(username).toHaveValue("lincolixavier@gmail.com");
    expect(passwordInput).toHaveValue("senha123");
  });

  it("shows and hides password when clicking on icon", async () => {
    await renderWithProvider();

    const passwordInput = screen.getByLabelText(mockDictionary.password);
    const toggleButton = screen.getByTestId("show-password-button");
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("submit the form correctly with valid values", async () => {
    await renderWithProvider();

    const username = screen.getByLabelText(mockDictionary.username);
    const passwordInput = screen.getByLabelText(mockDictionary.password);
    const submitButton = screen.getByTestId("signin-button");

    fireEvent.change(username, { target: { value: "lincolixavier@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "senha123" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(mockDictionary.required)).not.toBeInTheDocument();
    });
  });
});
