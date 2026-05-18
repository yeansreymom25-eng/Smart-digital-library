const CATEGORY_META_PREFIX = "<!--SDL_CATEGORY_META:";
const CATEGORY_META_SUFFIX = "-->";

export const DEFAULT_CATEGORY_ACCENT_COLOR = "#4f9df6";

type StoredCategoryMeta = {
  accentColor?: string;
};

function isHexColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mixChannel(start: number, end: number, amount: number) {
  return Math.round(start + (end - start) * amount);
}

function hexToRgb(value: string) {
  const normalized = sanitizeCategoryAccentColor(value);
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const toHex = (channel: number) => clamp(channel, 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixColor(baseColor: string, targetColor: string, amount: number) {
  const base = hexToRgb(baseColor);
  const target = hexToRgb(targetColor);

  return rgbToHex({
    r: mixChannel(base.r, target.r, amount),
    g: mixChannel(base.g, target.g, amount),
    b: mixChannel(base.b, target.b, amount),
  });
}

export function sanitizeCategoryAccentColor(value: string | null | undefined) {
  if (!value) {
    return DEFAULT_CATEGORY_ACCENT_COLOR;
  }

  const normalized = value.trim();
  return isHexColor(normalized) ? normalized : DEFAULT_CATEGORY_ACCENT_COLOR;
}

export function parseStoredCategoryDescription(rawValue: string | null | undefined) {
  const raw = rawValue ?? "";

  if (!raw.startsWith(CATEGORY_META_PREFIX)) {
    return {
      description: raw,
      accentColor: null as string | null,
    };
  }

  const metaEndIndex = raw.indexOf(CATEGORY_META_SUFFIX);
  if (metaEndIndex === -1) {
    return {
      description: raw,
      accentColor: null as string | null,
    };
  }

  try {
    const metaJson = raw.slice(CATEGORY_META_PREFIX.length, metaEndIndex);
    const meta = JSON.parse(metaJson) as StoredCategoryMeta;

    return {
      description: raw.slice(metaEndIndex + CATEGORY_META_SUFFIX.length).trim(),
      accentColor: meta.accentColor ? sanitizeCategoryAccentColor(meta.accentColor) : null,
    };
  } catch {
    return {
      description: raw,
      accentColor: null as string | null,
    };
  }
}

export function encodeStoredCategoryDescription(
  description: string,
  accentColor: string | null | undefined
) {
  const meta: StoredCategoryMeta = {
    accentColor: sanitizeCategoryAccentColor(accentColor),
  };

  return `${CATEGORY_META_PREFIX}${JSON.stringify(meta)}${CATEGORY_META_SUFFIX}${description.trim()}`;
}

export function getCategoryFallbackColor(seed: string) {
  const palette = [
    "#4f9df6",
    "#d85f58",
    "#5faa39",
    "#1d2bca",
    "#cb7a73",
    "#db5bc8",
    "#d5ad56",
    "#6954f0",
    "#cb3b2e",
    "#b2be4d",
    "#402420",
    "#5dcf69",
    "#6cf0ca",
    "#334e73",
  ];

  const index = Array.from(seed).reduce((total, character) => total + character.charCodeAt(0), 0) % palette.length;
  return palette[index];
}

export function getCategoryGradient(accentColor: string) {
  const normalized = sanitizeCategoryAccentColor(accentColor);
  const start = mixColor(normalized, "#ffffff", 0.14);
  const end = mixColor(normalized, "#000000", 0.26);
  return `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
}
