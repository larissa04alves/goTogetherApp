import { useState } from "react";

import { RegisterForm } from "./components/register-form";
import { VerifyIdentityForm } from "./components/verify-identity-form";
import type { RegisterStep1Data } from "./types";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<RegisterStep1Data | null>(null);

  return (
    <main className="bg-background flex min-h-svh w-full flex-col px-5 pb-6 pt-8">
      <div className="mx-auto flex w-full max-w-100 flex-col gap-8">
        {step === 2 && step1Data ? (
          <VerifyIdentityForm basicData={step1Data} onBack={() => setStep(1)} />
        ) : (
          <RegisterForm
            defaultValues={step1Data ?? undefined}
            onContinue={(data) => {
              setStep1Data(data);
              setStep(2);
            }}
          />
        )}
      </div>
    </main>
  );
}
