import { useApolloClient, useQuery } from "@apollo/client";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ME } from "@/graphql/auth";
import type { AuthPayload, User } from "@/graphql/types";
import { onUnauthenticated } from "@/lib/apollo";
import { session } from "@/lib/session";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  /** Persiste o token e o usuário retornados por signIn/signUp. `remember` = "Lembrar-me". */
  signIn: (payload: AuthPayload, remember?: boolean) => void;
  signOut: () => void;
};

type SessionActions = Pick<AuthContextValue, "signIn" | "signOut">;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient();
  const [token, setToken] = useState(session.getToken);

  const signOut = useCallback(() => {
    session.clear();
    setToken(null);
    // Limpa o cache para não vazar dados entre contas (RF-F03).
    void client.clearStore();
  }, [client]);

  const signIn = useCallback(
    ({ token: newToken, user }: AuthPayload, remember = true) => {
      session.setToken(newToken, remember);
      client.writeQuery({ query: ME, data: { me: user } });
      setToken(newToken);
    },
    [client],
  );

  useEffect(() => onUnauthenticated(signOut), [signOut]);

  // `key` remonta a sessão a cada troca de token: nenhum estado de hook
  // (ex.: o último resultado da query `me`) sobrevive entre contas.
  return (
    <Session key={token ?? "anonymous"} token={token} signIn={signIn} signOut={signOut}>
      {children}
    </Session>
  );
}

function Session({ token, signIn, signOut, children }: SessionActions & { token: string | null; children: ReactNode }) {
  const { data, loading, error } = useQuery(ME, { skip: !token });

  const user = token ? (data?.me ?? null) : null;
  const status: AuthStatus = !token
    ? "unauthenticated"
    : user
      ? "authenticated"
      : loading || !error
        ? "loading"
        : "unauthenticated";

  const value = useMemo(() => ({ status, user, signIn, signOut }), [status, user, signIn, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return context;
}
