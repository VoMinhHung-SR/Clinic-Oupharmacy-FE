# Prescribing UI baseline (UI-0)

Snapshot **trước** plan3 redesign (`feat/prescribing-ui-redesign`).

| Field | Value |
|-------|-------|
| **Date** | 2026-06-29 |
| **Branch** | `refactor/clinic-fe-store-architecture` |
| **Commit (Phase 2a)** | `24542e9` — `refactor(prescribing): map store unit_options to prescription payload` |
| **Plan** | `PersonalProject/plans/[UnDone] clinic-fe-prescribing-ui-redesign.plan.md` |

## Post plan3 verification (2026-07-01)

Manual smoke trên nhánh `refactor/clinic-fe-store-native` (base `dev` @ `9998f11` + plan2 2d–5).

| Area | Status | Notes |
|------|--------|-------|
| Catalog + QuickAdd (trái) | ✅ OK | SearchCombobox, gợi ý nhanh gộp, packing xám + đơn vị read-only khi 1 sale unit |
| Draft panel (phải) | ✅ OK | `PrescriptionDraftPanel`, tạm tính từ `unit_options.price_value` |
| Submit → phiếu thật | ✅ OK | Ví dụ phiếu `#044` — `PrescribingSuccessPanel` + `PrescriptionDetailCard` |
| Category filter (local DB) | ⏳ | Cần sync DB + `backfill_product_categories` (xem known-issues P12) |
| Giá thuốc (`cate: thuoc`) | ⏳ | Một số variant sai giá/qib — follow-up BE (known-issues P11) |

**Route:** `/dashboard/prescribing/:diagnosisId` (param = diagnosis ID).

## Contents

| File | Purpose |
|------|---------|
| [feature-parity-checklist.md](./feature-parity-checklist.md) | F01–F23 — regression matrix; cột **UI-6** cập nhật sau smoke |
| [known-issues.md](./known-issues.md) | UX/data gaps; resolved plan3 + follow-up BE/ops |
| [metrics-baseline.md](./metrics-baseline.md) | “Before” metrics + mục tiêu plan3 |
| [screenshots/](./screenshots/) | Visual baseline (UI-0) |

## How to extend baseline

1. Open `/dashboard/prescribing/:diagnosisId` on staging/local (doctor role).
2. Capture: empty draft, search results, draft with lines, post-submit print, patient modal.
3. Name: `NN-description-viewport.png` (e.g. `02-draft-with-lines-desktop.png`).
4. Re-run checklist trước khi đóng plan2 / rename `[Done]`.

## Screenshot index

| File | Description |
|------|-------------|
| `01-prescribing-workspace-desktop.png` | Full workspace: catalog list + pagination ~603 pages + empty draft sidebar |
