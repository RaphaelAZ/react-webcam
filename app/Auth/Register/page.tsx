import type { Metadata } from "next";
import RegisterForm from "../../Components/Register";

export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez votre compte et rejoignez la plateforme.",
};

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 translate-y-1/3 rounded-full bg-cyan-400/20 blur-3xl"
      />

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl shadow-black/40 lg:grid-cols-[1.05fr_1fr]">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-500 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full border-[48px] border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-white/10 blur-sm"
          />

          <div className="relative">
            <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur-sm">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <path d="M7 17 17 7M8 7h9v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-white/70">
              Bienvenue
            </p>
            <h1 className="max-w-sm text-4xl font-bold leading-tight tracking-tight">
              Votre espace commence ici.
            </h1>
            <p className="mt-5 max-w-sm text-base leading-7 text-white/75">
              Créez votre compte en quelques secondes et accédez à toutes les fonctionnalités de la plateforme.
            </p>
          </div>

          <div className="relative flex items-center gap-3 text-sm text-white/80">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                <path d="m7 12 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Simple, rapide et sécurisé
          </div>
        </div>

        <div className="px-6 py-10 sm:px-12 sm:py-14 lg:px-14">
          <div className="mb-9 lg:hidden">
            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              Bienvenue
            </span>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Créer un compte
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Renseignez vos informations pour commencer.
            </p>
          </div>

          <RegisterForm mode="register" />
        </div>
      </section>
    </main>
  );
}
