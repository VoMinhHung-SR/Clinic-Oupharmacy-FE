# Consultation Hub — Clinic FE (pharmacist queue)

Clinic dashboard half of the storefront **pharmacist** branch. Doctor/medicine booking run on the store; Clinic FE only handles human consult queue + Firestore chat.

## Role & routing

- `ROLE_PHARMACIST` in `src/lib/constants.js`.
- `getPostLoginPath` / nav: pharmacist lands on dashboard home / conversations (see `src/lib/auth/permissions.js`, dashboard `nav.jsx`).

## Queue UI

- Inbox tab in `SidebarInbox` lists waiting `ConsultationSession` rows from store API.
- Store `POST` create is idempotent while a session is still open (anti-spam); queue should not grow on every chat open.
- Hook: `SidebarInbox/hooks/usePharmacistConsultQueue.js`
- Service: `SidebarInbox/services/consultationSessions.js` → store `/api/store/consultation-sessions/`
- **Claim** attaches pharmacist to Firestore conversation `members`, then opens existing chat window patterns.

## Env

| Var | Role |
|-----|------|
| Store API base (existing clinic store client) | list/claim/complete sessions |
| `VITE_APP_ENV` | Must equal store `NEXT_PUBLIC_APP_ENV` for Firestore collection names |
| Firebase (existing `config/firebase.js`) | Same chat transport as clinic conversations |

## Key files

| Path | Why |
|------|-----|
| `src/config/APIs.js` | Consultation session endpoints |
| `src/lib/constants.js` | `ROLE_PHARMACIST` |
| `src/lib/auth/permissions.js` | Post-login / access |
| `src/modules/pages/ConversationListComponents/SidebarInbox/*` | Queue + claim UX |
| `public/locales/*/conversation.json` | Copy |

## Out of scope (Clinic FE)

- Doctor booking form (store `BookingActionBubble` + MAIN_API).
- Medicine search/cart (store only).

## Plans

- `PersonalProject/plans/[Done] consultation-hub-mvp.plan.md`
- Store doc: `oupharmacy-store/docs/consultation-hub.md`
- BE doc: `Clinic-Oupharmacy-BE/docs/consultation-hub.md`
