@AGENTS.md

# CLAUDE.md — SoloStack

## Tuyệt đối không được làm

- Không bao giờ hard-code API key/secret trực tiếp vào code — luôn dùng biến môi trường trong `.env.local`, không commit `.env.local` lên Git.
- Không xóa hoặc ghi đè file trong `supabase/migrations/` (khi thư mục này được tạo).
- Không tự ý cài package mới nếu chưa xác nhận với tôi, trừ khi tôi yêu cầu rõ.
- Không tự động hoá việc huỷ subscription hộ user (browser automation thay mặt user) — ở giai đoạn hiện tại chỉ hướng dẫn từng bước, không tự bấm huỷ hộ.

## Dự án này là gì

SoloStack — SaaS B2B nhỏ giúp freelancer/small team quét toàn bộ SaaS đang trả tiền (qua giao dịch ngân hàng/thẻ), tự động phát hiện subscription trùng chức năng và trial sắp hết hạn, để tiết kiệm chi phí. Lấy cảm hứng từ tính năng "Concierge Cancellation" của Rocket Money nhưng nhắm đúng nhóm freelancer/SME chưa ai phục vụ tốt.

Chi tiết ý tưởng gốc và bảng điểm: xem `~/saas-ideashunter-agent.md` (Ý tưởng #1).

## Stack đang dùng

- Next.js 16 (App Router) + TypeScript — front-end và back-end (route handlers trong `app/api/`)
- Tailwind CSS 4 — style
- Supabase — database + authentication (sẽ thêm ở giai đoạn Database, chưa nối lúc này)
- Plaid — kết nối ngân hàng/thẻ, thị trường mục tiêu ban đầu là US/EU (Plaid không hỗ trợ ngân hàng Việt Nam)
- Vercel — deploy

## Quy tắc code

- Component viết bằng TypeScript, đặt tên PascalCase.
- Tách riêng theo lớp: phần front-end để riêng file, phần back-end/route handler để riêng file, phần gọi database để riêng file, phần authentication để riêng file, phần nhúng AI (phân loại giao dịch, phát hiện trùng lặp) để riêng file — không gộp nhiều lớp vào một file.
- Mọi validate quan trọng (dữ liệu giao dịch, quyền truy cập) phải chạy lại ở server, không chỉ ở client.
- Giai đoạn MVP hiện tại: dùng dữ liệu giả (JSON cục bộ trong `src/lib/mock-data.ts`), CHƯA nối Supabase/Plaid thật — xem mục "Trạng thái hiện tại" bên dưới.
- Sau mỗi tính năng lớn, tự chạy `npm run build` để chắc chắn không lỗi build trước khi báo xong.

## Quy trình làm việc

- Luôn dùng Plan Mode trước khi sửa từ 3 file trở lên cùng lúc.
- Sau khi sửa UI, tự chụp màn hình so sánh với thiết kế mẫu nếu có.
- Khi thêm Supabase (database thật), bật Row Level Security (RLS) ngay từ lúc tạo bảng, và chạy lại audit bảo mật (xem checklist trong `~/saas-ideashunter-agent.md` nếu có, hoặc tự đối chiếu 5 mục: env key, RLS, server-side validation, package lỗi thời, middleware auth).
- Làm Authentication SAU CÙNG (sau khi các trang chính đã ổn định), không làm đầu tiên.

## Trạng thái hiện tại

- [x] Scaffold Next.js + Tailwind
- [x] Nối Supabase database — client (`src/lib/supabase/`), schema `profiles`/`subscriptions` với RLS đã chạy trong Supabase SQL Editor, kết nối đã verify OK
- [x] Authentication (đăng ký/đăng nhập/đăng xuất qua `src/app/actions/auth.ts`, `proxy.ts` bảo vệ trang `/`) — đã test tay với email thật, xác nhận email hoạt động đúng (đã sửa email template Supabase để khớp route `/auth/confirm`, xem lịch sử chat)
- [x] Dashboard đọc dữ liệu Supabase thật (`src/lib/supabase/subscriptions.ts`), không còn dùng `mock-data.ts` (file này vẫn giữ lại làm tham khảo, không còn được import bởi app)
- [x] Form thêm subscription thủ công (`AddSubscriptionForm` + server action `addSubscription`, có validate server-side)
- [x] Google OAuth (`GoogleSignInButton` + `src/app/auth/callback/route.ts`) — user đã tạo OAuth Client ID trên Google Cloud Console + bật provider trong Supabase Dashboard
- [ ] "Quên mật khẩu" chưa có UI (theo tài liệu Giai đoạn 4c nên có, backlog)
- [ ] Nối Plaid (kết nối ngân hàng thật)
- [ ] Tính năng AI phân loại giao dịch + phát hiện trùng lặp
- [ ] Deploy Vercel
