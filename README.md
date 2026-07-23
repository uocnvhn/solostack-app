# SoloStack

SaaS giúp freelancer và small team theo dõi subscription đang trả tiền (qua giao dịch ngân hàng/thẻ), phát hiện gói trùng chức năng và trial sắp hết hạn.

**Production:** [solostack-app-two.vercel.app](https://solostack-app-two.vercel.app)  
**Repo:** [github.com/VanQuocThin/solostack-app](https://github.com/VanQuocThin/solostack-app)

## Tính năng

- Đăng ký / đăng nhập (email + Google OAuth), quên mật khẩu
- Dashboard subscription (Supabase + RLS)
- Thêm subscription thủ công
- Kết nối ngân hàng/thẻ qua Plaid Link (Sandbox)
- Đồng bộ giao dịch và nhận diện subscription (rule-based theo merchant)
- Cảnh báo trial sắp hết / gói có thể trùng chức năng

> Plaid chưa hỗ trợ ngân hàng Việt Nam. Thị trường mục tiêu ban đầu: US/EU.

## Stack

| Thành phần | Công nghệ |
|---|---|
| App | Next.js 16 (App Router) + TypeScript |
| UI | Tailwind CSS 4 |
| Database + Auth | Supabase (Postgres, Auth, RLS) |
| Banking | Plaid |
| Deploy | Vercel |

## Yêu cầu

- Node.js 20+ (LTS khuyến nghị)
- Tài khoản [Supabase](https://supabase.com)
- Tài khoản [Plaid](https://dashboard.plaid.com) (Sandbox đủ cho dev)

## Cài đặt nhanh

```bash
git clone https://github.com/VanQuocThin/solostack-app.git
cd solostack-app
npm install
cp .env.example .env.local   # hoặc tạo tay file .env.local
```

Điền biến môi trường, chạy migration SQL, rồi:

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Scripts

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Build production |
| `npm run start` | Chạy bản đã build |
| `npm run lint` | ESLint |

## Biến môi trường

Tạo `.env.local` (đã nằm trong `.gitignore` — **không commit**):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox
```

| Biến | Nguồn |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API / trang tổng quan project |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API Keys → **Publishable** (hoặc Legacy `anon` `public`) |
| `PLAID_CLIENT_ID` / `PLAID_SECRET` | [Plaid Dashboard](https://dashboard.plaid.com) → Keys |
| `PLAID_ENV` | `sandbox` khi dev; `production` khi live |

App chạy được login/dashboard chỉ với cặp Supabase. Plaid chỉ cần khi test nối ngân hàng.

## Database (bắt buộc trước khi dùng dashboard)

Trong Supabase SQL Editor, chạy lần lượt:

1. `supabase/migrations/0001_init.sql` — `profiles`, `subscriptions`, RLS, trigger tạo profile
2. `supabase/migrations/0002_plaid_items.sql` — `plaid_items` + RLS
3. `supabase/migrations/0003_subscriptions_merchant_key.sql` — cột `merchant_key`

Nếu đã đăng ký user **trước** khi có bảng `profiles`, chạy thêm:

```sql
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;
```

## Cấu hình Auth (Supabase)

**Authentication → URL Configuration**

- Site URL: `http://localhost:3000` (local) hoặc domain Vercel
- Redirect URLs:
  - `http://localhost:3000/auth/confirm`
  - `http://localhost:3000/auth/callback`
  - tương ứng trên production

**Email templates** (Confirm signup / Reset password): link phải trỏ `/auth/confirm` kèm `token_hash` và `type`.

**Google OAuth** (tuỳ chọn): bật provider Google trong Supabase + OAuth Client trên Google Cloud. Callback Supabase: `https://<project-ref>.supabase.co/auth/v1/callback`.

## Test Plaid Sandbox

1. Đăng nhập → kết nối ngân hàng  
2. Credentials sandbox: `user_good` / `pass_good`  
3. Bấm **Đồng bộ giao dịch** để nhận diện subscription  

## Cấu trúc

```
src/
  app/              # Pages, auth routes, server actions
  components/       # UI
  lib/
    supabase/       # Client/server + queries
    plaid/          # Plaid client + transactions
    subscription-rules.ts
    subscription-insights.ts
  proxy.ts          # Session + bảo vệ route
supabase/migrations/
public/             # Static assets (nếu có)
```

## Deploy (Vercel)

Push `main` sẽ tự deploy nếu đã nối GitHub ↔ Vercel.

Trên Vercel: khai báo cùng biến môi trường như `.env.local`, rồi cập nhật Supabase Site URL / Redirect URLs cho domain production.

## Ghi chú

- Validate quan trọng chạy lại ở **server**, không chỉ client.
- Nhận diện subscription hiện **rule-based** (`subscription-rules.ts`), chưa gọi AI API.
- Không hard-code secret vào code.
- Không có tài khoản demo sẵn — tự **Đăng ký** hoặc đăng nhập Google.

## License

Private / chưa công bố license công khai.
