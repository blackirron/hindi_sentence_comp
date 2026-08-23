import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const HF_MODEL = process.env.HF_MODEL_ID || "surajp/gpt2-hindi";
const HF_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const HF_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

const SENTENCE_END = ["।", ".", "?", "!"];

type NextWordResult = { mode: "next-word"; prompt: string; candidates: { word: string; score: number }[]; source: "model" | "offline" };
type CompleteResult = { mode: "complete"; prompt: string; completion: string; source: "model" | "offline" };

// Small offline fallback so the demo still responds with zero setup.
// Keyed on the exact sample prompts from the project notebook.
const OFFLINE_NEXT_WORD: Record<string, string[]> = {
  "भारत एक": ["देश", "बड़ा", "सुंदर", "अलग", "विशाल"],
  "मुझे आज बहुत": ["खुशी", "अच्छा", "काम", "थकान", "मज़ा"],
  "स्कूल जाना": ["है", "था", "पड़ेगा", "चाहिए", "होगा"],
  "तुम क्या": ["कर", "सोच", "कह", "चाहते", "बोल"],
  "हम कल": ["मिलेंगे", "जाएंगे", "आएंगे", "बात", "चलेंगे"],
};
const OFFLINE_COMPLETIONS: Record<string, string> = {
  "भारत एक": "भारत एक विशाल और विविधताओं से भरा देश है। यहाँ कई भाषाएँ और संस्कृतियाँ एक साथ रहती हैं।",
  "मुझे आज बहुत": "मुझे आज बहुत अच्छा लगा। सुबह से ही मौसम बहुत सुहावना था।",
  "स्कूल जाना": "स्कूल जाना हर बच्चे के लिए ज़रूरी है। वहाँ से हमें नई बातें सीखने को मिलती हैं।",
};

function offlineNextWord(prompt: string, k: number): NextWordResult {
  const key = Object.keys(OFFLINE_NEXT_WORD).find((p) => prompt.trim().startsWith(p));
  const words = key ? OFFLINE_NEXT_WORD[key] : ["है", "था", "की", "और", "एक"];
  const total = words.length + 1;
  return {
    mode: "next-word",
    prompt,
    candidates: words.slice(0, k).map((word, i) => ({ word, score: (words.length - i) / total })),
    source: "offline",
  };
}

function offlineComplete(prompt: string): CompleteResult {
  const key = Object.keys(OFFLINE_COMPLETIONS).find((p) => prompt.trim().startsWith(p));
  const completion = key ? OFFLINE_COMPLETIONS[key] : `${prompt} ... (जोड़िए एक Hugging Face API टोकन असली मॉडल आउटपुट देखने के लिए)`;
  return { mode: "complete", prompt, completion, source: "offline" };
}

async function callHF(inputs: string, params: Record<string, unknown>) {
  const res = await fetch(HF_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(HF_TOKEN ? { Authorization: `Bearer ${HF_TOKEN}` } : {}),
    },
    body: JSON.stringify({ inputs, parameters: params, options: { wait_for_model: true } }),
  });
  if (!res.ok) {
    throw new Error(`HF API ${res.status}`);
  }
  const data = await res.json();
  const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
  if (typeof text !== "string") throw new Error("Unexpected HF response shape");
  return text as string;
}

function firstWholeWord(prompt: string, generated: string): string | null {
  const rest = generated.startsWith(prompt) ? generated.slice(prompt.length) : generated;
  const trimmed = rest.replace(/^[\s.,!?।]+/, "");
  const match = trimmed.match(/^[^\s.,!?।]+/);
  return match ? match[0] : null;
}

function trimToSentences(prompt: string, generated: string, maxSentences = 3): string {
  let text = generated.startsWith(prompt) ? generated : `${prompt}${generated}`;
  let count = 0;
  let cutIndex = text.length;
  for (let i = 0; i < text.length; i++) {
    if (SENTENCE_END.includes(text[i])) {
      count++;
      if (count >= maxSentences) {
        cutIndex = i + 1;
        break;
      }
    }
  }
  text = text.slice(0, cutIndex).trim();
  return text;
}

export async function POST(req: NextRequest) {
  let body: { prompt?: string; mode?: string; k?: number; maxSentences?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const prompt = (body.prompt || "").trim();
  const mode = body.mode === "complete" ? "complete" : "next-word";
  const k = Math.min(Math.max(body.k ?? 5, 1), 8);

  if (!prompt) {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }
  if (prompt.length > 300) {
    return NextResponse.json({ error: "prompt is too long (max 300 characters)" }, { status: 400 });
  }

  if (!HF_TOKEN) {
    return NextResponse.json(mode === "complete" ? offlineComplete(prompt) : offlineNextWord(prompt, k));
  }

  try {
    if (mode === "complete") {
      const generated = await callHF(prompt, {
        max_new_tokens: 45,
        do_sample: true,
        top_k: 50,
        top_p: 0.95,
        temperature: 0.8,
        return_full_text: true,
      });
      const completion = trimToSentences(prompt, generated, body.maxSentences ?? 3);
      const result: CompleteResult = { mode: "complete", prompt, completion, source: "model" };
      return NextResponse.json(result);
    }

    // next-word: sample several short continuations and tally the first
    // whole word from each as an approximation of top-k probability,
    // since the hosted inference endpoint doesn't expose raw logits.
    const SAMPLES = 10;
    const calls = Array.from({ length: SAMPLES }, () =>
      callHF(prompt, {
        max_new_tokens: 6,
        do_sample: true,
        top_k: 50,
        top_p: 0.95,
        temperature: 0.9,
        return_full_text: true,
      }).catch(() => null)
    );
    const results = await Promise.all(calls);
    const tally = new Map<string, number>();
    for (const r of results) {
      if (!r) continue;
      const word = firstWholeWord(prompt, r);
      if (word) tally.set(word, (tally.get(word) ?? 0) + 1);
    }
    const totalHits = Array.from(tally.values()).reduce((a, b) => a + b, 0);
    if (totalHits === 0) {
      return NextResponse.json(offlineNextWord(prompt, k));
    }
    const candidates = Array.from(tally.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, k)
      .map(([word, count]) => ({ word, score: count / totalHits }));

    const result: NextWordResult = { mode: "next-word", prompt, candidates, source: "model" };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(mode === "complete" ? offlineComplete(prompt) : offlineNextWord(prompt, k));
  }
}
