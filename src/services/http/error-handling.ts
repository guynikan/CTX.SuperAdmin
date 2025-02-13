export const defaultErrorHandling = (error: unknown): never => {
  console.error("Erro na requisição:", error);

  if (error instanceof Error) {
    throw new Error(error.message || "Erro inesperado. Tente novamente mais tarde.");
  }

  throw new Error("Erro desconhecido. Tente novamente mais tarde.");
};
