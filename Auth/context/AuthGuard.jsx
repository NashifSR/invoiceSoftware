"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/Auth/hooks/useAuth";

const AuthGuard = ({ children }) => {
  const router = useRouter();

  const {
    user,
    loading,
  } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-zinc-500">
          Loading...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return children;
};

export default AuthGuard;