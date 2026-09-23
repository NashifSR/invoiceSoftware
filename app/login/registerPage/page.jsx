"use client";

import RegisterForm from "@/Auth/components/forms/RegistrationForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4 py-10">
      <RegisterForm />
    </main>
  );
}