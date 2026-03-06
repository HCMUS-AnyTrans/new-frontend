export function normalizePercentage(value: number | null | undefined): number | null {
  if (value == null || Number.isNaN(value)) return null

  const normalized = value > 0 && value < 1 ? value * 100 : value

  if (Number.isInteger(normalized)) return normalized

  return Number.parseFloat(normalized.toFixed(2))
}
