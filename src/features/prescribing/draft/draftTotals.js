/** @param {import('../model/types').DraftLineItem | Record<string, unknown>} item */
export function getDraftLineUnitPrice(item) {
  const n = Number(item?.unitPrice ?? 0)
  return Number.isFinite(n) ? n : 0
}

/** @param {import('../model/types').DraftLineItem | Record<string, unknown>} item */
export function getDraftLineAmount(item) {
  const qty = Number(item?.quantity ?? 0) || 0
  return getDraftLineUnitPrice(item) * qty
}

/** @param {Array<import('../model/types').DraftLineItem | Record<string, unknown>>} items */
export function getDraftSubtotal(items) {
  return (items ?? []).reduce((sum, item) => sum + getDraftLineAmount(item), 0)
}

/** @param {Array<import('../model/types').DraftLineItem | Record<string, unknown>>} items */
export function hasDraftPricing(items) {
  return (items ?? []).some((item) => getDraftLineUnitPrice(item) > 0)
}

export function formatVnd(amount) {
  return `${Math.round(amount).toLocaleString('vi-VN')}₫`
}
