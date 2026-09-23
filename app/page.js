export default function Home() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-zinc-50 px-6">
      <div className="mx-auto w-full max-w-3xl text-center">

        {/* Badge */}

        <div className="mb-6 inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm">
          Ready to build
        </div>

        {/* Heading */}

        <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">
          Build something great.
        </h1>

        {/* Description */}

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-zinc-500 sm:text-lg">
          A clean, flexible foundation for your next project.
          Customize the pages, components, and features to fit
          exactly what you need.
        </p>

        {/* Actions */}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

          <a
            href="/dashboard"
            className="rounded-lg bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Go to dashboard
          </a>

          <a
            href="/login"
            className="rounded-lg border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
          >
            Sign in
          </a>

        </div>

      </div>
    </main>
  );
}
