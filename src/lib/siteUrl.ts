const LOCAL_HOST_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

function normalizeOrigin(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim().replace(/\/+$/, "");
  return trimmed || null;
}

function isLocalOrigin(origin: string | null) {
  return !!origin && LOCAL_HOST_PATTERN.test(origin);
}

export function getPreferredAppOrigin(currentOrigin?: string | null) {
  const normalizedCurrentOrigin = normalizeOrigin(currentOrigin);
  const configuredOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL);

  if (isLocalOrigin(normalizedCurrentOrigin)) {
    return normalizedCurrentOrigin!;
  }

  if (configuredOrigin) {
    return configuredOrigin;
  }

  if (normalizedCurrentOrigin) {
    return normalizedCurrentOrigin;
  }

  return "http://localhost:3000";
}

export function getClientAppOrigin() {
  if (typeof window === "undefined") {
    return getPreferredAppOrigin(null);
  }

  return getPreferredAppOrigin(window.location.origin);
}

export function getRequestAppOrigin(req: Request) {
  return getPreferredAppOrigin(req.headers.get("origin"));
}
