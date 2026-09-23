"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import useAuth from "@/Auth/hooks/useAuth";

const RegisterForm = () => {
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const [error, setError] = useState("");

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setError("");

      await register({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setError(getAuthErrorMessage(error));
    }
  };

  const handleGoogleRegister = async () => {
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
    <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">
          Create account
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Create your account to get started.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >

        {/* Name */}

        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Name
          </label>

          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            {...registerField("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters.",
              },
            })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.name && (
            <p className="mt-1 text-xs text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...registerField("email", {
              required: "Email is required",
            })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            {...registerField("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters.",
              },
            })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            {...registerField("confirmPassword", {
              required: "Please confirm your password.",
              validate: (value) =>
                value === password ||
                "Passwords do not match.",
            })}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Register */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Creating account..."
            : "Create account"}
        </button>

      </form>

      {/* Divider */}

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-200" />

        <span className="text-xs text-zinc-400">
          OR
        </span>

        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      {/* Google */}

      <button
        type="button"
        onClick={handleGoogleRegister}
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
      >
        Continue with Google
      </button>

      {/* Login */}

      <p className="mt-5 text-center text-sm text-zinc-500">
        Already have an account?{" "}

        <Link
          href="/login"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Sign in
        </Link>
      </p>

    </div>
  );
};

function getAuthErrorMessage(error) {
  switch (error?.code) {
    case "auth/email-already-in-use":
      return "An account already exists with this email.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/weak-password":
      return "The password is too weak.";

    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";

    default:
      return (
        error?.message ||
        "Something went wrong. Please try again."
      );
  }
}

export default RegisterForm;