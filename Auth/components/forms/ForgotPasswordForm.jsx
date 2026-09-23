"use client";

import useAuth from "@/Auth/hooks/useAuth";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

const ForgotPasswordForm = () => {
  const { resetPassword } = useAuth();

  const [success, setSuccess] = useState("");
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
    },
  });

  const onSubmit = async (data) => {
    try {
      setError("");
      setSuccess("");

      await resetPassword(data.email);

      setSuccess(
        "Password reset email sent. Check your inbox."
      );
    } catch (error) {
      console.error(error);

      switch (error?.code) {
        case "auth/user-not-found":
          setError(
            "No account was found with this email."
          );
          break;

        case "auth/invalid-email":
          setError(
            "Please enter a valid email address."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many attempts. Please try again later."
          );
          break;

        default:
          setError(
            error?.message ||
              "Something went wrong. Please try again."
          );
      }
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">
          Reset password
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Enter your email and we'll send you a
          password reset link.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}

      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Form */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
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
            {...register("email", {
              required: "Email is required",
            })}
            className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:ring-2 ${
              errors.email
                ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                : "border-zinc-300 focus:border-blue-500 focus:ring-blue-100"
            }`}
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Sending..."
            : "Send reset link"}
        </button>
      </form>

      {/* Back to Login */}

      <div className="mt-5 text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to login
        </Link>
      </div>

    </div>
  );
};

export default ForgotPasswordForm;