import { ApolloProvider } from "@apollo/client";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/auth";
import { apolloClient } from "@/lib/apollo";
import { AppRouter } from "@/routes/router";

export function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <AppRouter />
        <Toaster position="bottom-right" richColors closeButton />
      </AuthProvider>
    </ApolloProvider>
  );
}
