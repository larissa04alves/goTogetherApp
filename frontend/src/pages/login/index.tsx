import { LoginForm } from "./components/login-form";

export default function LoginPage() {
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
