# Known issues

## Resolved (plan3 + plan2 FE)

| ID | Issue | Was | Fixed in |
|----|-------|-----|----------|
| P1 | Full catalog on mount → ~603 pages | High | UI-2 — idle until search/intent; combobox + browse |
| P2 | FE `cate=` vs BE `category=` | High | UI-1 — store category params |
| P4 | `/api/store/search/` unused | Medium | UI-2 — SearchCombobox primary |
| P5 | Filters hidden in Collapse | Medium | UI-2 — visible filter row in catalog |
| P6 | `groupUnitsByMedicine` legacy grouping | Medium | plan2 2c — variant row SoT |
| P7 | Draft sidebar cramped | Low | UI-3 — `PrescriptionDraftPanel` full height |
| P8 | Categories from mainApp ≠ store | High | plan2 5 — `GET /api/store/categories/` read-only |

## Phase 2a (done `24542e9`)

- `product_variant_unit_id` null on submit
- Stock validation uses `quantity × quantity_in_base`
- Cart stock reservation in sale units

## Open — data / BE / ops (ngoài scope FE branch)

| ID | Issue | Severity | Owner |
|----|-------|----------|-------|
| P3 | `kw` only matches `product__name` (not `web_name`) | Medium | BE search |
| P9 | QuickAdd `(×N)` removed — qib vẫn dùng nội bộ stock/tồn | Info | FE done |
| P10 | Draft tạm tính = `unit_options.price_value` — sai nếu DB sai | Medium | BE/catalog |
| P11 | `quantity_in_base` sai packing nhiều tầng (vd. Hộp 3×10 viên → Hộp ×10 thay vì ×30) | High | BE `store_import_packaging` |
| P12 | Local DB: `category=` filter rỗng thiếu M2M backfill | High | Ops — sync container + `backfill_product_categories` |
| P13 | Giá thuốc `cate: thuoc` scrape/import (vd. Cozaar hộp 6.000đ) | High | BE/catalog + sync DB |

Plan2 todo: `be-fix-thuoc-price-sync-db` (`.cursor/plans/[UnDone] plan2-clinic-fe-architecture-refactor.plan.md`).
