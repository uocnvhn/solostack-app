import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Google (hoặc bất kỳ OAuth provider nào) redirect trình duyệt về đây sau khi
// user đồng ý đăng nhập, kèm 1 "code" trong URL — route này đổi code đó
// lấy session thật (khác /auth/confirm — chỗ đó dùng cho link xác nhận email).
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      redirect(next);
    }
  }

  redirect("/login");
}
