/** Split free-text signs into display lines (comma, semicolon, pipe, newline). */
export function parseSymptoms(sign) {
  if (!sign?.trim()) return []
  return sign
    .split(/[,;|\n]+/)
    .map((part) => part.trim())
    .filter(Boolean)
}
