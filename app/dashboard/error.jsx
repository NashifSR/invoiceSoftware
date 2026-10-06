"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
        <AlertTriangle size={32} />
      </div>

      <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
        Something went wrong!
      </h2>
      <p className="mt-2 max-w-md text-sm text-zinc-500">
        An unexpected error occurred while loading this section of the portal. You can try reloading or return to the dashboard.
      </p>

      <div className="mt-6 flex items-center gap-3">
        {/* Attempt to recover by trying to re-render the segment */}
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          <RefreshCw size={16} />
          Try again
        </button>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <Home size={16} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}