import Link from "next/link";
import { Wifi, ArrowRight, ShieldCheck, CreditCard, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 selection:bg-zinc-900 selection:text-white">
 
      {/* Hero Section */}
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-20">
        <div className="mx-auto w-full max-w-4xl text-center">
          
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3.5 py-1 text-xs font-medium text-zinc-600 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>ISP Billing & Subscriber Management</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-6xl">
            Run your ISP business <br />
            <span className="text-zinc-500">without the administrative friction.</span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-500 sm:text-lg">
            Automate PPPoE provisioning, streamline recurring billing cycles, monitor network bandwidth, and empower your clients with a seamless self-service portal.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 shadow-sm"
            >
              Go to dashboard <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 shadow-sm"
            >
              Sign in to portal
            </Link>
          </div>

        </div>
      </main>

      {/* Features Preview Section */}
      <section id="features" className="border-t border-zinc-200 bg-white py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl">
              Engineered for modern network operators
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Everything you need to scale subscribers from hundreds to hundreds of thousands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-900 mb-4 shadow-sm">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-950 mb-2">Automated Billing</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Generate invoices, handle local or global payment gateways, and suspend unpaid accounts automatically.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-900 mb-4 shadow-sm">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-950 mb-2">Mikrotik & RADIUS</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Direct sync with core routers for bandwidth profiles, static IP management, and real-time session tracking.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white border border-zinc-200 text-zinc-900 mb-4 shadow-sm">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-zinc-950 mb-2">Client Self-Portal</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Let customers track their data usage, view payment histories, upgrade packages, and open support tickets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}