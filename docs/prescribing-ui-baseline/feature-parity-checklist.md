# Feature parity checklist (F01–F23)

Regression trước/sau plan3. Cột **UI-6** = smoke `refactor/clinic-fe-store-native` (2026-07-01).

**Baseline commit:** `24542e9`  
**Route:** `/dashboard/prescribing/:diagnosisId` (param = diagnosis ID)

Legend: ✅ verified · ⬜ not run · 🔧 fixed in plan3 · ⏳ blocked data/ops

## Prescribing workspace

| ID | Feature | Component / hook | Manual test step | Baseline | UI-6 |
|----|---------|------------------|------------------|----------|------|
| F01 | Load diagnosis + examination | `usePrescriptionDetail` | Open valid diagnosis URL | ⬜ | ✅ |
| F02 | Null prescription → booking link | `PrescribingWorkspace` | Invalid/missing diagnosis | ⬜ | ⬜ |
| F03 | Dialog if prescription already exists | `ConfirmAlert` | Diagnosis with existing prescribing | ⬜ | ⬜ |
| F04 | Patient header (name + birth year) | `PrescribingShell` | Visible on workspace | ✅ | ✅ |
| F05 | Patient info modal | header actions | Click "Thông tin bệnh nhân" | ⬜ | ✅ |
| F06 | Medical records modal | `useMedicalRecordsModal` | Open modal → history | ⬜ | ⬜ |
| F07 | Keyword search | `SearchCombobox` + `usePrescribingCatalog` | Submit search term | ✅ | ✅ |
| F08 | Category filter | `CatalogPanel` filters | Select category + search | ⬜ | ⏳ local DB |
| F09 | Price sort | catalog params | asc/desc | ⬜ | ⬜ |
| F10 | Catalog pagination | compact list | Navigate page 2 | ✅ | ✅ |
| F11 | Name, packing, stock badge | `CatalogCompactList` | Row renders | ✅ | ✅ |
| F12 | Sale unit select / read-only | `MedicineQuickAdd` | Multi vs single unit | ⬜ | ✅ |
| F13 | Uses + quantity + add | `MedicineQuickAdd` | Fill + THÊM THUỐC | ⬜ | ✅ |
| F14 | Stock validation | `getMaxSaleQuantity` | Qty > available | ⬜ | ⬜ |
| F15 | Draft list panel | `PrescriptionDraftPanel` | Lines after add | ⬜ | ✅ |
| F16 | Edit uses/qty per line | `PrescriptionDraftLineItem` | Edit icon → save | ⬜ | ⬜ |
| F17 | Remove line / delete all | `PrescribingContext` | Delete + confirm all | ⬜ | ⬜ |
| F18 | Submit prescription | `handleAddPrescriptionDetail` | Confirm → success | ⬜ | ✅ (#044) |
| F19 | Backdrop on submit | `isBackdropLoading` | Loading overlay | ⬜ | ✅ |
| F20 | Unsaved navigation guard | `useCustomNavigate` | Leave with draft → prompt | ⬜ | ⬜ |
| F21 | Post-submit prescription card | `PrescribingSuccessPanel` | Card after submit | ⬜ | ✅ |
| F22 | Print | `window.print` | Print action | ⬜ | ⬜ |
| F23 | Doctor role only | route guard | Non-doctor blocked | ⬜ | ⬜ |

## API verification (F18)

After submit, DevTools → `POST /prescription-details/`:

- [x] `product_variant_id` present
- [x] `product_variant_unit_id` present (Phase 2a)
- [x] `quantity`, `uses`, `prescribing` present

## Out of scope (plan3 v1 — do not regress)

| Route | Note |
|-------|------|
| `/dashboard/prescribing` | List table — UI-7 |
| `/dashboard/prescribing/:diagnosisId/payments` | Param renamed from `:prescribingId` |

## File map (current — `refactor/clinic-fe-store-native`)

```
features/prescribing/
  pages/PrescribingWorkspace.jsx          # orchestrator
  catalog/PrescribingCatalogSection.jsx   # search + browse + quick access
  catalog/MedicineQuickAdd.jsx            # quick-add form
  catalog/mergeQuickAccessEntries.js      # dedupe frequent/recent
  draft/PrescriptionDraftPanel.jsx        # draft sidebar
  draft/usePrescriptionDraft.js
  draft/draftLine.js
lib/context/PrescribingContext.jsx
lib/adapters/storeProduct.js              # unit_options, enrich, display names
modules/pages/PrescriptionDetailComponents/
  services/prescribingActions.js          # POST prescription-details
pages/dashboard/prescribing/id/index.jsx
```
