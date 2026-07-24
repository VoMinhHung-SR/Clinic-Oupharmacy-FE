# Clinic-Oupharmacy-FE — Agent & contributor map

**React** + **Vite**, **MUI** + Tailwind, **React Router v6**, **Axios** + JWT. Gọi **Clinic-Oupharmacy-BE** (Django DRF).

## Trình tự đọc (docs-first)

| Workspace | Workspace `PersonalProject` (monorepo) |
|------------------------|----------------------------------------|
| `@AGENTS.md` | `@Clinic-Oupharmacy-FE/AGENTS.md` |
| `@docs/ARCHITECTURE.md` | `@Clinic-Oupharmacy-FE/docs/ARCHITECTURE.md` |

## Cấu trúc chính (`src/`)

| Path | Vai trò |
|------|---------|
| `src/pages/` | Trang theo route (dashboard, booking, login, …) |
| `src/modules/` | Khối UI tái sử dụng (pages/common/providers, …) |
| `src/config/` | API endpoints, Firebase, cấu hình (`APIs.js`, …) |
| `src/lib/services/` | Gọi HTTP, tách khỏi UI |
| `src/lib/hooks/`, `src/lib/context/` | Hooks, context auth/state |
| `src/lib/redux/` | Redux (nếu dùng) |
| `src/assets/`, `src/lib/icon/` | Asset, icon |

## Đi vào đâu theo việc

| Việc | Bắt đầu từ |
|------|------------|
| Route / màn hình mới | `src/pages/`, cấu hình router (file router trong `src/`) |
| Endpoint API | `src/config/APIs.js` (hoặc file config API hiện có) |
| Gọi API / axios | `src/lib/services/` |
| Auth / token | `src/lib/auth/`, storage/local config |

## Lệnh

```bash
npm install
npm run dev
npm run build
```

## Plans

- Plan feat: `Clinic-Oupharmacy-FE/.cursor/plans/` (tạo nếu chưa có) — tên file **`[UnDone]` / `[Done]`** (xem `PersonalProject/.cursor/rules/planning-project-plans-folder.mdc`).

## Bảo mật

- Không commit token; env qua `.env` / biến build phù hợp Vite (`VITE_*` nếu dùng).

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **Clinic-Oupharmacy-FE** (3316 symbols, 5292 relationships, 148 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/Clinic-Oupharmacy-FE/context` | Codebase overview, check index freshness |
| `gitnexus://repo/Clinic-Oupharmacy-FE/clusters` | All functional areas |
| `gitnexus://repo/Clinic-Oupharmacy-FE/processes` | All execution flows |
| `gitnexus://repo/Clinic-Oupharmacy-FE/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
