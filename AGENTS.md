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
