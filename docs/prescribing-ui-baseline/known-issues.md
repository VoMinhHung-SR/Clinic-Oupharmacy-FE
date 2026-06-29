# Known issues (pre plan3)

Issues documented at UI-0; plan3 phases address each.

| ID | Issue | Severity | Plan3 phase |
|----|-------|----------|-------------|
| P1 | Full catalog on mount → ~603 pagination pages | High | UI-2 |
| P2 | FE `cate=` vs BE `category=` | High | UI-1 |
| P3 | `kw` only matches `product__name` | Medium | UI-2 (search API) |
| P4 | `/api/store/search/` + suggest unused | Medium | UI-2 |
| P5 | Filters hidden in Collapse | Medium | UI-2 |
| P6 | `groupUnitsByMedicine` groups variants by product | Medium | UI-2 / plan2 2c |
| P7 | Draft sidebar `maxHeight: 320px`, empty doctor note | Low | UI-3 |
| P8 | Categories from `allConfig.categories` (mainApp) may ≠ store IDs | High | UI-1 spike |

## Phase 2a fixes (done in `24542e9`)

- `product_variant_unit_id` null on submit
- Stock validation ignores `quantity_in_base`
- Cart stock reservation counted in sale units not base units
