"use client";

import { useActionState } from "react";
import { register, login } from "../actions/auth";
import type { AuthState } from "../actions/auth.type";

const initialState: AuthState = {};

export default function RegisterForm({ mode }: { mode: string }) {
    const [state, formAction, pending] = useActionState(mode === "register"?register:login, initialState);
    const nicknameError = state.errors?.nickname;
    const passwordError = state.errors?.password;

    const inputClassName =
        "peer w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60";

    return (
        <form action={formAction} className="space-y-5" noValidate>
            <div>
                <label htmlFor="nickname" className="mb-2 block text-sm font-semibold text-slate-700">
                    Pseudo
                </label>
                <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 peer-focus:text-indigo-500">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                            <path d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </span>
                    <input
                        className={`${inputClassName} pl-12 ${nicknameError ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                        type="text"
                        name="nickname"
                        id="nickname"
                        placeholder="Votre pseudo"
                        autoComplete="username"
                        minLength={3}
                        required
                        disabled={pending}
                        aria-invalid={nicknameError ? true : undefined}
                        aria-describedby={nicknameError ? "nickname-error" : undefined}
                    />
                </div>
                {nicknameError && (
                    <div id="nickname-error" className="mt-2 space-y-1" aria-live="polite">
                        {nicknameError.map((error) => (
                            <p key={error} className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                <span aria-hidden="true">•</span>
                                {error}
                            </p>
                        ))}
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                    Mot de passe
                </label>
                <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                            <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
                            <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                    </span>
                    <input
                        className={`${inputClassName} pl-12 ${passwordError ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}`}
                        type="password"
                        name="password"
                        id="password"
                        placeholder="6 caractères minimum"
                        autoComplete="new-password"
                        minLength={6}
                        required
                        disabled={pending}
                        aria-invalid={passwordError ? true : undefined}
                        aria-describedby={passwordError ? "password-error" : "password-help"}
                    />
                </div>
                {passwordError ? (
                    <div id="password-error" className="mt-2 space-y-1" aria-live="polite">
                        {passwordError.map((error) => (
                            <p key={error} className="flex items-center gap-1.5 text-xs font-medium text-red-600">
                                <span aria-hidden="true">•</span>
                                {error}
                            </p>
                        ))}
                    </div>
                ) : (
                    <p id="password-help" className="mt-2 text-xs text-slate-400">
                        Utilisez au moins 6 caractères.
                    </p>
                )}
            </div>

            {state.message && (
                <div
                    role="alert"
                    aria-live="polite"
                    className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 7v6M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {state.message}
                </div>
            )}

            <button
                type="submit"
                disabled={pending}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 hover:shadow-indigo-600/30 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30 disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:shadow-none"
            >
                {pending ? (
                    <>
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 animate-spin">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                            <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                        {mode === "register" ? <>Création du compte…</> : <>Connexion</>}
                    </>
                ) : (
                    <>
                        Créer mon compte
                        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4 transition-transform group-hover:translate-x-1">
                            <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </>
                )}
            </button>
            {mode === "register" &&
                <p className="text-center text-xs leading-5 text-slate-400">
                    En créant un compte, vous acceptez les conditions d’utilisation de la plateforme.
                </p>
            }
        </form>
    );
}
