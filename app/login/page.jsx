"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import useAuth from "@/Auth/hooks/useAuth";


const LoginPage = () => {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setError("");

      await login(data.email, data.password);

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setError(getAuthErrorMessage(error));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");

      await loginWithGoogle();

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setError(getAuthErrorMessage(error));
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =====================================================
            LEFT SIDE — BRAND
        ===================================================== */}

        <section className="relative hidden overflow-hidden lg:flex">

          {/* Background */}

          <div className="absolute inset-0 bg-zinc-950" />

          <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[120px]" />

          <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />

          {/* Grid */}

          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

            {/* Logo */}

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-zinc-950">
                U
              </div>

              <span className="text-lg font-bold tracking-tight text-white">
                Universal
              </span>
            </div>

            {/* Main Copy */}

            <div className="max-w-lg">

              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur">
                <Sparkles size={13} />
                Universal SaaS Boilerplate
              </div>

              <h2 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Build faster.
                <br />
                <span className="text-zinc-500">
                  Launch sooner.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-zinc-400">
                A clean foundation for building modern applications,
                dashboards, SaaS platforms, and client projects.
              </p>

              {/* Features */}

              <div className="mt-8 space-y-3">

                <Feature text="Authentication ready" />

                <Feature text="Modern dashboard foundation" />

                <Feature text="Built for customization" />

              </div>

            </div>

            {/* Bottom */}

            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <ShieldCheck size={14} />
              Secure authentication powered by Firebase
            </div>

          </div>

        </section>


        {/* =====================================================
            RIGHT SIDE — LOGIN
        ===================================================== */}

        <section className="relative flex min-h-screen items-center justify-center bg-zinc-50 px-5 py-12">

          {/* Mobile Logo */}

          <div className="absolute left-5 top-6 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-950 text-xs font-black text-white">
              U
            </div>

            <span className="font-bold text-zinc-900">
              Universal
            </span>
          </div>

          <div className="w-full max-w-md">

            {/* Heading */}

            <div className="mb-8">

              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-600">
                Welcome back
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
                Sign in to your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-zinc-500">
                Enter your credentials below to continue.
              </p>

            </div>


            {/* Error */}

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                <span>{error}</span>
              </div>
            )}


            {/* Form Card */}

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.12)] sm:p-7">

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
              >

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-zinc-800"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                    })}
                    className={`h-11 w-full rounded-xl border bg-zinc-50 px-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-4 ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-zinc-200 focus:border-zinc-900 focus:ring-zinc-100"
                    }`}
                  />

                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.email.message}
                    </p>
                  )}

                </div>


                {/* Password */}

                <div>

                  <div className="mb-2 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-zinc-800"
                    >
                      Password
                    </label>

                    <Link
                      href="/login/forgot-password"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </Link>

                  </div>

                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className={`h-11 w-full rounded-xl border bg-zinc-50 px-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:bg-white focus:ring-4 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                        : "border-zinc-200 focus:border-zinc-900 focus:ring-zinc-100"
                    }`}
                  />

                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600">
                      {errors.password.message}
                    </p>
                  )}

                </div>


                {/* Submit */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Signing in..."
                    : "Sign in"}

                  {!isSubmitting && (
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  )}
                </button>

              </form>


              {/* Divider */}

              <div className="my-6 flex items-center gap-3">

                <div className="h-px flex-1 bg-zinc-200" />

                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                  Or continue with
                </span>

                <div className="h-px flex-1 bg-zinc-200" />

              </div>


              {/* Google */}

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
              >

                <GoogleIcon />

                Continue with Google

              </button>

            </div>


            {/* Register */}

            <p className="mt-6 text-center text-sm text-zinc-500">

              Don't have an account?{" "}

              <Link
                href="/register"
                className="font-semibold text-zinc-950 hover:underline"
              >
                Create an account
              </Link>

            </p>


            {/* Footer */}

            <p className="mt-8 text-center text-xs text-zinc-400">
              By continuing, you agree to our Terms and Privacy Policy.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
};


// ============================================================
// FEATURE
// ============================================================

const Feature = ({ text }) => {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-400">

      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
        <Check size={11} className="text-white" />
      </div>

      {text}

    </div>
  );
};


// ============================================================
// GOOGLE ICON
// ============================================================

const GoogleIcon = () => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.23a4.47 4.47 0 0 1-1.94 2.93v2.44h3.14c1.84-1.69 2.92-4.18 2.92-7.2Z"
      />

      <path
        fill="#34A853"
        d="M12 21.7c2.63 0 4.84-.87 6.45-2.35l-3.14-2.44c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.28v2.52A9.74 9.74 0 0 0 12 21.7Z"
      />

      <path
        fill="#FBBC05"
        d="M6.53 13.8A5.86 5.86 0 0 1 6.22 12c0-.63.11-1.24.31-1.8V7.68H3.28A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.03 4.32l3.25-2.52Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.17c1.43 0 2.72.49 3.73 1.45l2.8-2.8C16.84 3.27 14.63 2.3 12 2.3a9.74 9.74 0 0 0-8.72 5.38l3.25 2.52C7.3 7.89 9.46 6.17 12 6.17Z"
      />
    </svg>
  );
};


// ============================================================
// FIREBASE ERROR MESSAGES
// ============================================================

function getAuthErrorMessage(error) {
  switch (error?.code) {
    case "auth/invalid-credential":
      return "Invalid email or password.";

    case "auth/user-not-found":
      return "No account was found with this email.";

    case "auth/wrong-password":
      return "Incorrect password.";

    case "auth/too-many-requests":
      return "Too many attempts. Please try again later.";

    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";

    default:
      return (
        error?.message ||
        "Something went wrong. Please try again."
      );
  }
}

export default LoginPage;