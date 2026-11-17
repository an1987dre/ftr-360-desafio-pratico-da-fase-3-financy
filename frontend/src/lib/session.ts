const TOKEN_KEY = "financy:token";

function storage(kind: "local" | "session"): Storage | null {
  try {
    return kind === "local" ? localStorage : sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Token JWT (ADR-0004). "Lembrar-me" decide onde ele fica:
 * localStorage (sobrevive ao fechar o navegador) ou sessionStorage (só a aba atual).
 */
export const session = {
  getToken(): string | null {
    return storage("local")?.getItem(TOKEN_KEY) ?? storage("session")?.getItem(TOKEN_KEY) ?? null;
  },
  setToken(token: string, remember = true) {
    this.clear();
    storage(remember ? "local" : "session")?.setItem(TOKEN_KEY, token);
  },
  clear() {
    storage("local")?.removeItem(TOKEN_KEY);
    storage("session")?.removeItem(TOKEN_KEY);
  },
};
