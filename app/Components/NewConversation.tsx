"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import {
  createConversation,
  searchContacts,
  type ContactSearchResult,
  type CreateConversationState,
} from "../actions/conversation";

export default function NewConversation() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ContactSearchResult[]>([]);
  const [selected, setSelected] = useState<ContactSearchResult[]>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const [state, formAction, isCreating] = useActionState<CreateConversationState, FormData>(
    createConversation,
    {},
  );

  useEffect(() => {
    if (!isOpen || query.trim().length < 2) {
      return;
    }

    const timeout = window.setTimeout(() => {
      startSearchTransition(async () => {
        const contacts = await searchContacts(query);
        setResults(contacts);
      });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [isOpen, query]);

  function toggleContact(contact: ContactSearchResult) {
    setSelected((current) =>
      current.some(({ id }) => id === contact.id)
        ? current.filter(({ id }) => id !== contact.id)
        : [...current, contact],
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Nouvelle conversation
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-conversation-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 id="new-conversation-title" className="text-xl font-bold text-slate-900">
                  Nouvelle conversation
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Recherchez et sélectionnez un ou plusieurs contacts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                  <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <form action={formAction} className="px-6 py-5">
              {selected.map((contact) => (
                <input key={contact.id} type="hidden" name="contactIds" value={contact.id} />
              ))}

              {selected.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {selected.map((contact) => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() => toggleContact(contact)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      {contact.nickname}
                      <span aria-hidden="true" className="text-indigo-400">×</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="relative">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => {
                    const value = event.target.value;
                    setQuery(value);
                    if (value.trim().length < 2) setResults([]);
                  }}
                  placeholder="Rechercher par pseudo…"
                  autoFocus
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
                {isSearching && (
                  <svg aria-label="Recherche en cours" viewBox="0 0 24 24" fill="none" className="absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-indigo-600">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" className="opacity-20" />
                    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                )}
              </div>

              <div className="mt-3 min-h-48 overflow-y-auto rounded-xl border border-slate-100">
                {query.trim().length < 2 ? (
                  <p className="px-4 py-8 text-center text-sm text-slate-400">
                    Saisissez au moins 2 caractères.
                  </p>
                ) : !isSearching && results.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-slate-400">
                    Aucun contact trouvé.
                  </p>
                ) : (
                  results.map((contact) => {
                    const isSelected = selected.some(({ id }) => id === contact.id);
                    return (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => toggleContact(contact)}
                        className="flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-0 hover:bg-slate-50"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold uppercase text-white">
                          {contact.nickname.slice(0, 1)}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">
                          {contact.nickname}
                        </span>
                        <span className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${isSelected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"}`}>
                          {isSelected && <span aria-hidden="true" className="text-xs">✓</span>}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {state.message && (
                <p role="status" className={`mt-3 text-sm font-medium ${state.success ? "text-emerald-600" : "text-red-600"}`}>
                  {state.message}
                </p>
              )}

              <div className="mt-5 flex items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                  {selected.length} contact{selected.length > 1 ? "s" : ""} sélectionné{selected.length > 1 ? "s" : ""}
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={selected.length === 0 || isCreating}
                    className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isCreating ? "Création…" : "Créer"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
