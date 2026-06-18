import { Navigate } from "react-router";

import { authClient } from "@/api/auth";

import { LoginForm } from "./components/login-form";

export default function LoginPage() {
  const { data } = authClient.useSession();

  // Já autenticado (inclusive logo após o login, mesmo que o ProtectedLayout
  // tenha quicado pra cá por causa do refetch de sessão): vai pra home.
  if (data) {
    return <Navigate to="/home" replace />;
  }

  return (
    <main className="bg-background flex min-h-svh w-full flex-col px-5 pb-8 pt-16">
      <div className="flex w-full max-w-100 flex-col gap-20">
        <img
          src="/logo-goTogheter.png"
          alt="goTogether"
          className="mx-auto h-32 w-auto"
        />
        <LoginForm />
      </div>
    </main>
  );
}
