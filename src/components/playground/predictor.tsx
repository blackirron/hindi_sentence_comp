"use client";

import * as React from "react";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "next-word" | "complete";

type NextWordResponse = {
  mode: "next-word";
  candidates: { word: string; score: number }[];
  source: "model" | "offline";
};
type CompleteResponse = {
  mode: "complete";
  completion: string;
  source: "model" | "offline";
};

const SAMPLE_PROMPTS = ["भारत एक", "मुझे आज बहुत", "स्कूल जाना", "तुम क्या", "हम कल"];

export function Predictor({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [prompt, setPrompt] = React.useState("भारत एक");
  const [mode, setMode] = React.useState<Mode>("next-word");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [nextWords, setNextWords] = React.useState<NextWordResponse["candidates"]>([]);
  const [completion, setCompletion] = React.useState<string>("");
  const [source, setSource] = React.useState<"model" | "offline" | null>(null);

  const run = React.useCallback(
    async (overridePrompt?: string, overrideMode?: Mode) => {
      const p = (overridePrompt ?? prompt).trim();
      const m = overrideMode ?? mode;
      if (!p) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: p, mode: m, k: 5 }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Something went wrong");
        }
        const data: NextWordResponse | CompleteResponse = await res.json();
        setSource(data.source);
        if (data.mode === "next-word") {
          setNextWords(data.candidates);
          setCompletion("");
        } else {
          setCompletion(data.completion);
          setNextWords([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [prompt, mode]
  );

  React.useEffect(() => {
    if (variant !== "compact") return;
    const timer = setTimeout(() => run("भारत एक", "next-word"), 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  function appendWord(word: string) {
    const next = `${prompt.trim()} ${word}`;
    setPrompt(next);
    run(next, "next-word");
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-border bg-ink p-1 text-sm">
          <button
            type="button"
            onClick={() => {
              setMode("next-word");
              run(undefined, "next-word");
            }}
            className={cn(
              "rounded-full px-3.5 py-1.5 transition-colors",
              mode === "next-word" ? "bg-tulsi text-tulsi-foreground" : "text-muted hover:text-ink-foreground"
            )}
          >
            Predict next word
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("complete");
              run(undefined, "complete");
            }}
            className={cn(
              "rounded-full px-3.5 py-1.5 transition-colors",
              mode === "complete" ? "bg-tulsi text-tulsi-foreground" : "text-muted hover:text-ink-foreground"
            )}
          >
            Complete sentence
          </button>
        </div>
        {source && (
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs",
              source === "model"
                ? "border-tulsi/40 text-tulsi"
                : "border-sindoor/40 text-sindoor"
            )}
          >
            {source === "model" ? "Live model" : "Offline demo"}
          </span>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="हिंदी में एक अधूरा वाक्य लिखिए…"
          dir="auto"
          className="font-display flex-1 rounded-xl border border-border bg-ink px-4 py-3 text-lg text-ink-foreground outline-none placeholder:text-muted focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-tulsi px-5 py-3 text-sm font-medium text-tulsi-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
          {mode === "next-word" ? "Predict" : "Complete"}
        </button>
      </form>

      {variant === "full" && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setPrompt(s);
                run(s);
              }}
              className="font-display rounded-full border border-border px-3 py-1 text-sm text-muted transition-colors hover:border-tulsi hover:text-tulsi"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 min-h-[88px]">
        {error && (
          <p className="rounded-lg border border-sindoor/40 bg-sindoor/10 px-3 py-2 text-sm text-sindoor">
            {error}
          </p>
        )}

        {!error && mode === "next-word" && nextWords.length > 0 && (
          <ul className="flex flex-col gap-2">
            {nextWords.map((c, i) => (
              <li key={c.word + i}>
                <button
                  type="button"
                  onClick={() => appendWord(c.word)}
                  className="group flex w-full items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 text-left transition-colors hover:border-border"
                >
                  <span className="font-display w-8 text-sm text-muted">{i + 1}.</span>
                  <span className="font-display flex-1 text-lg text-ink-foreground group-hover:text-tulsi">
                    {c.word}
                  </span>
                  <span className="h-1.5 w-24 overflow-hidden rounded-full bg-ink">
                    <span
                      className="block h-full rounded-full bg-tulsi"
                      style={{ width: `${Math.round(c.score * 100)}%` }}
                    />
                  </span>
                  <span className="w-10 text-right text-xs text-muted">{Math.round(c.score * 100)}%</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {!error && mode === "complete" && completion && (
          <p className="font-display rise-in rounded-xl bg-ink px-4 py-4 text-xl leading-relaxed text-ink-foreground">
            <Sparkles className="mb-1 mr-2 inline h-4 w-4 text-tulsi" />
            {completion}
          </p>
        )}
      </div>
    </div>
  );
}
