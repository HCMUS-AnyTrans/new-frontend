export function extractErrorMessage(
  err: unknown,
  fallback = "An unexpected error occurred",
): string {
  if (!err || typeof err !== "object") return fallback

  if ("message" in err) {
    const message = (err as { message?: string | string[] }).message
    if (Array.isArray(message)) return message.join(", ")
    if (typeof message === "string" && message.length > 0) return message
  }

  return fallback
}
