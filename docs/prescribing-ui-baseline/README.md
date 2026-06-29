# Prescribing UI baseline (UI-0)

Snapshot **trước** plan3 redesign (`feat/prescribing-ui-redesign`).

| Field | Value |
|-------|-------|
| **Date** | 2026-06-29 |
| **Branch** | `refactor/clinic-fe-store-architecture` |
| **Commit (Phase 2a)** | `24542e9` — `refactor(prescribing): map store unit_options to prescription payload` |
| **Plan** | `PersonalProject/plans/[UnDone] clinic-fe-prescribing-ui-redesign.plan.md` |

## Contents

| File | Purpose |
|------|---------|
| [feature-parity-checklist.md](./feature-parity-checklist.md) | F01–F23 — regression matrix for UI-6 |
| [known-issues.md](./known-issues.md) | UX/data gaps motivating plan3 |
| [metrics-baseline.md](./metrics-baseline.md) | Measurable “before” metrics |
| [screenshots/](./screenshots/) | Visual baseline |

## How to extend baseline

1. Open `/dashboard/prescribing/:diagnosisId` on staging/local (doctor role).
2. Capture: empty draft, search results, draft with lines, post-submit print, patient modal.
3. Name: `NN-description-viewport.png` (e.g. `02-draft-with-lines-desktop.png`).
4. Re-run checklist before closing plan3 UI-6.

## Screenshot index

| File | Description |
|------|-------------|
| `01-prescribing-workspace-desktop.png` | Full workspace: catalog list + pagination ~603 pages + empty draft sidebar |
