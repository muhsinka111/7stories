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
  title: string,
  hook: string,
  style: string,
  categoryLabel: string
): string {
  const styleDesc: Record<string, string> = {
    cinematic: "ultra-realistic cinematic film still, 35mm, shallow depth of field, dramatic golden-hour lighting, anamorphic, high detail, movie-quality color grade",
    photoreal: "ultra-photorealistic, professional studio photography, natural light, tack-sharp detail, 50mm lens",
    anime: "high-end anime key visual, Studio Ghibli inspired, rich painterly backgrounds, expressive, cinematic composition",
    illustration: "beautiful hand-painted book illustration, storybook style, warm textures, whimsical, detailed",
    vintage: "vintage film photograph, warm faded tones, film grain, nostalgic 1970s aesthetic, soft light",
    dreamy: "dreamy ethereal aesthetic, soft focus, pastel tones, gentle light, romantic atmosphere",
    documentary: "cinematic documentary still, naturalistic, candid, authentic, gritty real-world texture",
  };
  const styleText = styleDesc[style] ?? styleDesc.cinematic;
  return `A ${styleText} key visual for a ${categoryLabel.toLowerCase()} story titled "${title}". ${hook}. Aim for emotional impact and cinematic composition, no text in the image.`;
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

async function imageViaFAL(prompt: string, model?: string, referenceUrls?: string[], aspectRatio?: string): Promise<string> {
  const key = process.env.FAL_KEY!;
  // High-quality cinematic image model (configurable via FAL_IMAGE_MODEL or the user's choice).
  const chosen = model ?? process.env.FAL_IMAGE_MODEL ?? "fal-ai/flux-pro/v1.1-ultra";
  const payload: any = { prompt, num_images: 1 };
  if (referenceUrls?.length) payload.reference_image_urls = referenceUrls;
  if (aspectRatio) payload.aspect_ratio = aspectRatio;
  const res = await fetch(`https://queue.fal.run/${chosen}`, {
    method: "POST",
    headers: {
      Authorization: `Key ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
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

const AR_TO_SIZE: Record<string, string> = {
  "1:1": "1024x1024",
  "16:9": "1536x1024",
  "9:16": "1024x1536",
  "4:3": "1024x1024",
};

async function imageViaOpenAI(prompt: string, aspectRatio?: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY!;
  const baseURL = (process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/$/, "");
  const res = await fetch(`${baseURL}/images/generations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      n: 1,
      size: AR_TO_SIZE[aspectRatio ?? "1:1"] ?? "1024x1024",
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

export async function generateImage(prompt: string, model?: string, referenceUrls?: string[], aspectRatio?: string): Promise<MediaAsset> {
  const chosen = model ?? IMAGE_MODELS[0].key;
  // Route by the MODEL's provider (not the global config), so users can pick
  // between ChatGPT Image (OpenAI) and FAL models freely.
  if (imageModelProvider(chosen) === "openai") {
    const url = await imageViaOpenAI(prompt, aspectRatio);
    return { kind: "image", url, provider: "openai", prompt };
  }
  if (!process.env.FAL_KEY) {
    throw new MediaConfigError("This image model needs FAL_KEY in .env.");
  }
  const url = await imageViaFAL(prompt, chosen, referenceUrls, aspectRatio);
  return { kind: "image", url, provider: "fal", prompt };
}

// ─────────────────────────── Video generation ───────────────────────────

/** Selectable video models available on FAL. Users can pick any of these. */
export interface VideoModelOption {
  key: string;
  label: string;
  vendor: string;
  hint: string;
}
export const VIDEO_MODELS: VideoModelOption[] = [
  { key: "sora-2", label: "Sora 2", vendor: "OpenAI", hint: "ChatGPT's video model" },
  { key: "sora-1", label: "Sora 1", vendor: "OpenAI", hint: "OpenAI video" },
  { key: "fal-ai/veo3", label: "Veo 3", vendor: "Google", hint: "Premium cinematic motion" },
  { key: "fal-ai/veo3/v1.0", label: "Veo 3 v1.0", vendor: "Google", hint: "Latest Veo" },
  { key: "fal-ai/veo-2", label: "Veo 2", vendor: "Google", hint: "Strong cinematic" },
  { key: "fal-ai/kling-video/v1.6", label: "Kling 1.6", vendor: "Kuaishou", hint: "Strong motion & realism" },
  { key: "fal-ai/kling-video/v1.5", label: "Kling 1.5", vendor: "Kuaishou", hint: "Balanced quality/speed" },
  { key: "fal-ai/kling-video/v1.0", label: "Kling 1.0", vendor: "Kuaishou", hint: "Fast classic" },
  { key: "fal-ai/minimax-video", label: "MiniMax H3", vendor: "MiniMax", hint: "One model for all modalities" },
  { key: "fal-ai/minimax/video-01", label: "MiniMax 01", vendor: "MiniMax", hint: "Text/image to video" },
  { key: "fal-ai/seedance/v2.5", label: "Seedance 2.5", vendor: "ByteDance", hint: "Most advanced video model" },
  { key: "fal-ai/seedance/v2.0", label: "Seedance 2.0", vendor: "ByteDance", hint: "High-quality, controllable" },
  { key: "fal-ai/seedance/v5.0", label: "Seedance 5.0", vendor: "ByteDance", hint: "Latest generation" },
  { key: "fal-ai/seedance/v1.5-pro", label: "Seedance 1.5 Pro", vendor: "ByteDance", hint: "High-quality controllable" },
  { key: "fal-ai/seedance/v1.0", label: "Seedance 1.0", vendor: "ByteDance", hint: "Reliable" },
  { key: "fal-ai/seedance", label: "Seedance", vendor: "ByteDance", hint: "General" },
  { key: "fal-ai/wan/v2.2", label: "Wan 2.2", vendor: "Alibaba", hint: "Open, expressive, artistic" },
  { key: "fal-ai/wan/v2.1", label: "Wan 2.1", vendor: "Alibaba", hint: "Fast open model" },
  { key: "fal-ai/wan/2.1-t2v", label: "Wan 2.1 T2V", vendor: "Alibaba", hint: "Text to video" },
  { key: "fal-ai/ltx-video", label: "LTX Video", vendor: "Lightricks", hint: "Fast, lightweight" },
  { key: "fal-ai/ltx-video/v0.9.6", label: "LTX 0.9.6", vendor: "Lightricks", hint: "Stable" },
  { key: "fal-ai/hunyuan-video", label: "Hunyuan", vendor: "Tencent", hint: "Detail-rich" },
  { key: "fal-ai/mochi-v1", label: "Mochi 1", vendor: "Genmo", hint: "Open, motion-rich" },
  { key: "fal-ai/cogvideox/v5", label: "CogVideoX 5", vendor: "Zhipu", hint: "Balanced" },
  { key: "fal-ai/runway-gen3/turbo", label: "Runway Gen3 Turbo", vendor: "Runway", hint: "Fast premium" },
  { key: "fal-ai/runway/gen4-turbo", label: "Runway Gen4 Turbo", vendor: "Runway", hint: "Latest premium" },
  { key: "fal-ai/pika/v1", label: "Pika 1.0", vendor: "Pika", hint: "Creative motion" },
];
export function getVideoModel(key: string): VideoModelOption {
  return VIDEO_MODELS.find((v) => v.key === key) ?? VIDEO_MODELS[0];
}
/** Route a video model key to its provider. */
export function videoModelProvider(key: string): "openai" | "fal" {
  return key.startsWith("sora") ? "openai" : "fal";
}

/** Selectable image models. FAL models need FAL_KEY; OpenAI models need OPENAI_API_KEY. */
export const IMAGE_MODELS: { key: string; label: string; vendor: string; hint: string }[] = [
  { key: "gpt-image-1", label: "ChatGPT Image (GPT-4o)", vendor: "OpenAI", hint: "ChatGPT's image model" },
  { key: "fal-ai/flux-pro/v1.1-ultra", label: "Flux Pro Ultra", vendor: "Black Forest", hint: "Highest quality cinematic" },
  { key: "fal-ai/nano-banana", label: "Nano Banana (Gemini 2.5 Flash)", vendor: "Google", hint: "Consistent characters across scenes" },
  { key: "fal-ai/seedream/4.5", label: "Seedream 4.5", vendor: "ByteDance", hint: "Most consistent characters/scenes" },
  { key: "fal-ai/flux-pro/v1.1", label: "Flux Pro 1.1", vendor: "Black Forest", hint: "High quality" },
  { key: "fal-ai/recraft-v3", label: "Recraft V3", vendor: "Recraft", hint: "Great for illustration" },
  { key: "fal-ai/ideogram/v3", label: "Ideogram V3", vendor: "Ideogram", hint: "Great typography" },
  { key: "fal-ai/imagen3", label: "Imagen 3", vendor: "Google", hint: "Photoreal" },
  { key: "fal-ai/sd3.5-large", label: "SD 3.5 Large", vendor: "Stability", hint: "Open" },
  { key: "fal-ai/flux/dev", label: "Flux Dev", vendor: "Black Forest", hint: "Open, fast" },
  { key: "fal-ai/flux/schnell", label: "Flux Schnell", vendor: "Black Forest", hint: "Fastest" },
];
/** Route an image model key to its provider. */
export function imageModelProvider(key: string): "openai" | "fal" {
  return key === "gpt-image-1" ? "openai" : "fal";
}
export function getImageModel(key: string) {
  return IMAGE_MODELS.find((m) => m.key === key) ?? IMAGE_MODELS[0];
}

async function videoViaFAL(prompt: string, model?: string, inputImage?: string, resolution?: string): Promise<string> {
  const key = process.env.FAL_KEY!;
  // Use the requested model, else env override, else default Veo 3.
  const chosen = model ?? process.env.FAL_VIDEO_MODEL ?? "fal-ai/veo3";
  const payload: any = { prompt };
  if (inputImage) payload.input_image = inputImage; // image-to-video
  if (resolution) payload.resolution = resolution; // e.g. 1080p
  const res = await fetch(`https://queue.fal.run/${chosen}`, {
    method: "POST",
    headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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

async function videoViaOpenAI(prompt: string, model: string): Promise<string> {
  const key = process.env.OPENAI_API_KEY!;
  const res = await fetch("https://api.openai.com/v1/videos", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, input: prompt }),
  });
  if (!res.ok) throw new Error(`Sora video failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const url = data?.url || data?.output?.[0]?.url || data?.data?.[0]?.url;
  if (url) return url;
  if (data?.id) return `https://api.openai.com/v1/videos/${data.id}/content`;
  throw new Error("Sora returned no video URL (async job may need setup).");
}

export async function generateVideo(prompt: string, model?: string, inputImage?: string, resolution?: string): Promise<MediaAsset> {
  const chosen = model ?? VIDEO_MODELS[0].key;
  // Route by the MODEL's provider so users can pick between Sora (OpenAI) and FAL models freely.
  if (videoModelProvider(chosen) === "openai") {
    const url = await videoViaOpenAI(prompt, chosen);
    return { kind: "video", url, provider: "openai", prompt };
  }
  if (!process.env.FAL_KEY) {
    throw new MediaConfigError("This video model needs FAL_KEY in .env.");
  }
  const url = await videoViaFAL(prompt, chosen, inputImage, resolution);
  return { kind: "video", url, provider: "fal", prompt };
}

/**
 * Generate assets for a finished story. Returns the generated media + which
 * providers were used. Throws MediaConfigError if a requested mode needs a
 * provider that isn't configured.
 */
export async function generateStoryAssets(
  mode: AssetMode,
  opts: { category: string; style: string; title: string; hook: string; videoModel?: string; imageModel?: string; referenceImages?: string[]; aspectRatio?: string; resolution?: string }
): Promise<MediaResult> {
  if (mode === "text") return { assets: [], providers: mediaProviders() };
  const providers = mediaProviders();
  const prompt = visualPrompt(opts.title, opts.hook, opts.style, opts.category);
  const ref = opts.referenceImages?.filter(Boolean) ?? [];
  const assets: MediaAsset[] = [];

  if (mode === "image" || mode === "both") {
    assets.push(await generateImage(prompt, opts.imageModel, ref, opts.aspectRatio));
  }
  if (mode === "video" || mode === "both") {
    assets.push(await generateVideo(prompt, opts.videoModel, ref[0], opts.resolution));
  }
  return { assets, providers };
}
