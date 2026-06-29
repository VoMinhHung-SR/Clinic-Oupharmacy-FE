# Metrics baseline (pre plan3)

Captured at Phase 2a commit `24542e9`. Re-measure after UI-6.

## Catalog loading

| Metric | Value | Source |
|--------|-------|--------|
| Default API | `GET /api/store/products/` | `PrescriptionDetailCard/services` → `fetchMedicinesUnit` |
| `PAGE_SIZE` | `12` | `src/lib/constants.js` |
| Typical page count (full catalog) | **~603** | UI observation (pagination) |
| Estimated variant count | ~7 200+ | `603 × 12` (approx.) |
| Load on mount without search | **Yes** | `useMedicine` `useEffect` always fetches |
| Search min length gate | **No** | Empty `kw` still loads page 1 |

## Filter / search

| Param (FE) | Param (BE) | Works? |
|------------|------------|--------|
| `kw` | `kw` (`product__name` icontains) | Partial — no web_name |
| `cate` | expects `category` | **Likely broken** |
| `price` | expects `price_sort` | **Likely broken** |
| `in_stock` | `in_stock` | Not sent by prescribing |

## Prescribing payload (post Phase 2a)

| Field | Status |
|-------|--------|
| `product_variant_id` | Sent via `m.productVariantId ?? m.id` |
| `product_variant_unit_id` | Sent from `enrichVariantForPrescribing` |
| Stock check FE | `quantity × quantity_in_base` vs base stock |

## Target (plan3 UI-6)

| Metric | Before | Target |
|--------|--------|--------|
| Pages on first paint | ~603 | **0** (empty until intent) |
| `page_size` (prescribing) | 12 | 20 |
| Search API | `/products/` only | `/store/search/` + suggest |
| Category filter | Hidden collapse | Visible chips |
| Default `in_stock` | off | **on** (toggleable) |
