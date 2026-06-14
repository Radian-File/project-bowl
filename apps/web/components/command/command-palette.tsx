"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { buildCommandItems, filterCommandItems, type CommandGroup, type CommandItem } from "@/lib/command-items";
import { profile } from "@/lib/portfolio-data";

const GROUP_ORDER: CommandGroup[] = ["Navigation", "Actions", "Projects"];

export function CommandPalette() {
  const router = useRouter();
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const items = useMemo(
    () =>
      buildCommandItems({
        navigate: (href) => {
          close();
          router.push(href);
        },
        copyEmail: () => {
          void navigator.clipboard?.writeText(profile.email);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        },
        openExternal: (href) => {
          close();
          window.open(href, "_blank", "noreferrer");
        },
        toggleLanguage: () => setLocale(locale === "id" ? "en" : "id"),
      }),
    [router, close, setLocale, locale],
  );

  const filtered = useMemo(() => filterCommandItems(items, query), [items, query]);

  // Global ⌘K / Ctrl+K listener. This component only mounts on public pages
  // (via Navbar), so the dashboard never registers this shortcut.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    const openHandler = () => setOpen(true);
    window.addEventListener("open-command-palette", openHandler);
    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("open-command-palette", openHandler);
    };
  }, []);

  useEffect(() => {
    if (open) {
      window.requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = filtered[activeIndex];
      if (item) item.perform();
    }
  };

  if (!open) return null;

  let runningIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-ink-border bg-ink-surface shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-ink-border px-4">
          <Search className="h-4 w-4 shrink-0 text-ink-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Cari halaman, aksi, atau project…"
            className="w-full bg-transparent py-4 text-sm text-ink-text placeholder:text-ink-faint focus:outline-none"
          />
          {copied ? <span className="font-mono text-xs text-ink-accent">copied</span> : <kbd className="rounded border border-ink-border px-1.5 py-0.5 font-mono text-[10px] text-ink-faint">ESC</kbd>}
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="px-3 py-8 text-center font-mono text-xs text-ink-faint">Tidak ada hasil untuk "{query}"</p>
          ) : (
            GROUP_ORDER.map((group) => {
              const groupItems = filtered.filter((item) => item.group === group);
              if (groupItems.length === 0) return null;
              return (
                <div key={group} className="mb-1">
                  <p className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-faint">{group}</p>
                  {groupItems.map((item) => {
                    runningIndex += 1;
                    const index = runningIndex;
                    const isActive = index === activeIndex;
                    return <CommandRow key={item.id} item={item} active={isActive} onHover={() => setActiveIndex(index)} onSelect={() => item.perform()} />;
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function CommandRow({ item, active, onHover, onSelect }: { item: CommandItem; active: boolean; onHover: () => void; onSelect: () => void }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
        active ? "bg-ink-surfaceHover text-ink-text" : "text-ink-muted"
      }`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? "text-ink-accent" : "text-ink-faint"}`} />
      <span className="truncate">{item.label}</span>
    </button>
  );
}
