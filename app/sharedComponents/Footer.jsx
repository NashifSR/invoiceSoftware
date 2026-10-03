import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm sm:flex-row lg:px-8">
        
        {/* Copyright & Credits */}
        <div className="flex flex-col items-center gap-1 text-center sm:items-start sm:text-left">
          <p className="text-zinc-500" suppressHydrationWarning>
            © {currentYear} Universal. All rights reserved.
          </p>
          <p className="text-xs text-zinc-400">
            Crafted by{" "}
            <span className="font-medium text-zinc-700">Ahmed Nashif</span> at{" "}
            <span className="font-medium text-zinc-700">
              Frame House Creative
            </span>
          </p>
        </div>

        {/* Footer Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-zinc-500 transition hover:text-zinc-950"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-zinc-500 transition hover:text-zinc-950"
          >
            Terms
          </Link>
          <Link
            href="/help"
            className="text-zinc-500 transition hover:text-zinc-950"
          >
            Help
          </Link>
        </div>

      </div>
    </footer>
  );
}