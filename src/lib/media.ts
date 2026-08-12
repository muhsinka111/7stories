// Media generation for 7stories — provider-agnostic image & video generation.
// All calls are server-side (route handlers / server actions only).
// Gated on env keys; returns a clear config error when a provider isn't set so
// the UI can tell the user exactly which key to add.

export type AssetMode = "text" | "image" | "video" | "both";

export type MediaAsset = {
  kind: "image" | "video";
  url: string;
  provider: string;
  prompt?: string;
};

export type MediaResult = {
  assets: MediaAsset[];
  providers: { image?: string; video?: string };
};

export class MediaConfigError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "MediaConfigError";
  }
}

function has(envVar: string): boolean {
  return !!process.env[envVar] && process.env[envVar]!.trim().length > 0;
}

/** Which providers are configured right now. */
export function mediaProviders(): { image?: string; video?: string } {
  const p: { image?: string; video?: string } = {};
  if (has("FAL_KEY")) {
    p.image = "fal";
    p.video = "fal";
  } else if (has("OPENAI_API_KEY")) {
    p.image = "openai";
  } else if (has("REPLICATE_API_TOKEN")) {
    p.image = "replicate";
    p.video = "replicate";
  }
  return p;
}

/** A short, visual, asset-friendly rendering prompt derived from a story. */
export function visualPrompt(
  audience: string,
  title: string,
  hook: string,
  styleHint?: string
): string {
  const style =
    styleHint ||
    (audience === "family"
      ? "warm, nostalgic, cinematic, soft light"
      : audience === "company"
        ? "premium editorial corporate photography, refined"
        : "bold cinematic brand commercial, high contrast");
  return `Cinematic ${style} key visual for a story titled "${title}". ${hook}`;
}

// ─────────────────────────── Image generation ───────────────────────────

/** Poll a FAL queue request until it completes; returns the result JSON. */
async function pollFal(requestUrl: string, key: string, timeoutMs = 120000): Promise<any> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1500));
    const res = await fetch(requestUrl, { headers: { Authorization: `Key ${key}` } });
    if (!res.ok) continue;
    const data = await res.json();
    if (!data || typeof data !== "object") continue;
    // A finished result arrives WITHOUT a "status" field (e.g. { images: [...] }).
    if (!("status" in data)) return data;
    if (data.status === "COMPLETED") return data;
    if (data.status === "FAILED" || data.status === "CANCELLED") {
      throw new Error(`FAL request failed: ${data.status} ${data.error || ""}`);
    }
    // else IN_QUEUE / IN_PROGRESS — keep polling
  }
  throw new Error("FAL request timed out");
}

async function imageViaFAL(prompt: string): Promise<string> {
  const key = process.env.FAL_KEY!;
  // fal-ai/flux/schnell — fast (<5s), decent quality cover images for good UX.
  const res = await fetch("https://queue.fal.run/fal-ai/flux/schnell", {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      num_images: 1,
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`FAL image failed (${res.status}): ${t.slice(0, 200)}`);
  }
  const queued = await res.json();
  if (!queued?.response_url) throw new Error("FAL returned no response_url");
  const data = await pollFal(queued.response_url, key);
  const url = data?.images?.[0]?.url;
  if (!url) throw new Error("FAL returned no image URL");
  return url;
}

async function imageViaOpenAI(prompt: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY!;
  const baseURL = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const res = await fetch(`${baseURL}/images/generations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: "1024x1024",
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenAI image failed (${res.status}): ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  const url = data?.data?.[0]?.url;
  if (url) return url;
  if (b64) {
    // Persist the b64 payload to /public/generated so it's servable.
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const dir = path.join(process.cwd(), "public", "generated");
    await fs.mkdir(dir, { recursive: true });
    const name = `img_${Date.now()}.png`;
    await fs.writeFile(path.join(dir, name), Buffer.from(b64, "base64"));
    return `/generated/${name}`;
  }
  throw new Error("OpenAI returned no image");
}

async function imageViaReplicate(prompt: string): Promise<string> {
  const key = process.env.REPLICATE_API_TOKEN!;
  const res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ input: { prompt } }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Replicate image failed (${res.status}): ${t.slice(0, 200)}`);
  }
  const data = await res.json();
  // Replicate returns a prediction URL; poll for the output.
  const { url } = data;
  if (!url) throw new Error("Replicate returned no prediction URL");
  return await pollReplicateOutput(url, key);
}

export async function generateImage(prompt: string): Promise<MediaAsset> {
  const providers = mediaProviders();
  const provider = providers.image;
  if (!provider) {
    throw new MediaConfigError(
      "Image generation needs FAL_KEY or OPENAI_API_KEY or REPLICATE_API_TOKEN in .env."
    );
  }
  const url =
    provider === "fal"
      ? await imageViaFAL(prompt)
      : provider === "openai"
        ? await imageViaOpenAI(prompt)
        : await imageViaReplicate(prompt);
  return { kind: "image", url, provider, prompt };
}

// ─────────────────────────── Video generation ───────────────────────────

async function videoViaFAL(prompt: string): Promise<string> {
  const key = process.env.FAL_KEY!;
  const res = await fetch("https://queue.fal.run/fal-ai/ltx-video", {
    method: "POST",
    headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, num_frames: 121, resolution: "768x1280" }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`FAL video failed (${res.status}): ${t.slice(0, 200)}`);
  }
  const queued = await res.json();
  if (!queued?.response_url) throw new Error("FAL returned no response_url");
  const data = await pollFal(queued.response_url, key, 180000);
  const videoUrl = data?.video?.url ?? data?.output?.video?.url ?? data?.video_url;
  if (!videoUrl) throw new Error("FAL returned no video URL");
  return videoUrl;
}

async function pollReplicateOutput(predictionUrl: string, key: string): Promise<string> {
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(predictionUrl, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) continue;
    const data = await res.json();
    if (data.status === "succeeded" && data.output) {
      const out = Array.isArray(data.output) ? data.output[0] : data.output;
      return typeof out === "string" ? out : out?.url;
    }
    if (data.status === "failed") throw new Error("Replicate prediction failed");
  }
  throw new Error("Timed out waiting for Replicate");
}

export async function generateVideo(prompt: string): Promise<MediaAsset> {
  const providers = mediaProviders();
  const provider = providers.video;
  if (!provider) {
    throw new MediaConfigError(
      "Video generation needs FAL_KEY or REPLICATE_API_TOKEN in .env."
    );
  }
  const url =
    provider === "fal" ? await videoViaFAL(prompt) : await (async () => {
      const key = process.env.REPLICATE_API_TOKEN!;
      const res = await fetch("https://api.replicate.com/v1/models/wan-video/wan-2.1-t2v/predictions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ input: { prompt } }),
      });
      if (!res.ok) throw new Error("Replicate video failed");
      const data = await res.json();
      return await pollReplicateOutput(data.url, key);
    })();
  return { kind: "video", url, provider, prompt };
}

/**
 * Generate assets for a finished story. Returns the generated media + which
 * providers were used. Throws MediaConfigError if a requested mode needs a
 * provider that isn't configured.
 */
export async function generateStoryAssets(
  mode: AssetMode,
  opts: { audience: string; title: string; hook: string }
): Promise<MediaResult> {
  if (mode === "text") return { assets: [], providers: mediaProviders() };
  const providers = mediaProviders();
  const prompt = visualPrompt(opts.audience, opts.title, opts.hook);
  const assets: MediaAsset[] = [];

  if (mode === "image" || mode === "both") {
    assets.push(await generateImage(prompt));
  }
  if (mode === "video" || mode === "both") {
    assets.push(await generateVideo(prompt));
  }
  return { assets, providers };
}
