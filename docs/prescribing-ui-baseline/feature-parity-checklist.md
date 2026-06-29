# Feature parity checklist (F01–F23)

Use for regression before/after plan3. Mark **UI-6** column when plan3 ships.

**Baseline commit:** `24542e9`  
**Route under test:** `/dashboard/prescribing/:diagnosisId` (param = diagnosis ID)

Legend: ✅ verified · ⬜ not run · 🔧 fixed in plan3

## Prescribing workspace

| ID | Feature | Component / hook | Manual test step | Baseline | UI-6 |
|----|---------|------------------|------------------|----------|------|
| F01 | Load diagnosis + examination | `usePrescriptionDetail` | Open valid diagnosis URL | ⬜ | ⬜ |
| F02 | Null prescription → booking link | `prescribing/id/index.jsx` | Invalid/missing diagnosis | ⬜ | ⬜ |
| F03 | Dialog if prescription already exists | `ConfirmAlert` | Diagnosis with existing prescribing | ⬜ | ⬜ |
| F04 | Patient header (name + birth year) | `PrescribingPageHeader` | Visible on workspace | ✅ | ⬜ |
| F05 | Patient info modal | `PrescribingPageHeader` | Click "Thông tin bệnh nhân" | ⬜ | ⬜ |
| F06 | Medical records modal | `useMedicalRecordsModal` | Open modal → history collapses | ⬜ | ⬜ |
| F07 | Keyword search | `MedicineFilter` | Submit search term | ✅ | ⬜ |
| F08 | Category filter | `MedicineFilter` collapse | Select category + search | ⬜ | ⬜ |
| F09 | Price sort | `price` param | asc/desc | ⬜ | ⬜ |
| F10 | Catalog pagination | `useMedicine` + Pagination | Navigate page 2 | ✅ | ⬜ |
| F11 | Image, name, stock chips | `MedicineLineItem` | Row renders | ✅ | ⬜ |
| F12 | Variant / sale unit select | `MedicineLineItem` + Phase 2a | Multi-unit product | ⬜ | ⬜ |
| F13 | Uses + quantity + add | row form | Fill + green + | ⬜ | ⬜ |
| F14 | Stock validation | `getMaxSaleQuantity` | Qty > available | ⬜ | ⬜ |
| F15 | Draft list sidebar | `PrescriptionFormSidebar` | Lines appear after add | ⬜ | ⬜ |
| F16 | Edit uses/qty per line | `PrescriptionDraftLineItem` | Edit icon → save | ⬜ | ⬜ |
| F17 | Remove line / delete all | context + sidebar | Delete + confirm all | ⬜ | ⬜ |
| F18 | Submit prescription | `handleAddPrescriptionDetail` | Confirm → success toast | ⬜ | ⬜ |
| F19 | Backdrop on submit | `isBackdropLoading` | Loading overlay | ⬜ | ⬜ |
| F20 | Unsaved navigation guard | `useCustomNavigate` | Leave with draft → prompt | ⬜ | ⬜ |
| F21 | Post-submit prescription card | `PrescriptionDetailCard` | Card visible after submit | ⬜ | ⬜ |
| F22 | Print | `window.print` | Print action | ⬜ | ⬜ |
| F23 | Doctor role only | `MedicinesHome` `ROLE_DOCTOR` | Non-doctor cannot prescribe view | ⬜ | ⬜ |

## API verification (F18)

After submit, DevTools → `POST /prescription-details/`:

- [ ] `product_variant_id` present
- [ ] `product_variant_unit_id` present (Phase 2a)
- [ ] `quantity`, `uses`, `prescribing` present

## Out of scope (plan3 v1 — do not regress)

| Route | Note |
|-------|------|
| `/dashboard/prescribing` | List table — UI-7 |
| `/dashboard/prescribing/:id/payments` | Unchanged |

## File map (current)

```
pages/dashboard/prescribing/id/index.jsx          # page orchestrator
modules/pages/PrescriptionDetailComponents/       # header, sidebar, layout
modules/pages/ProductComponents/MedicinesHome     # catalog host
modules/pages/ProductComponents/MedicineListPrescribing
modules/pages/ProductComponents/MedicineLineItem
lib/context/PrescribingContext.jsx
lib/adapters/storeProduct.js                      # Phase 2a helpers
modules/pages/PrescriptionDetailComponents/services/prescribingActions.js
```
