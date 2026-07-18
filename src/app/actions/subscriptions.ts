"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AddSubscriptionState = { error: string } | null;

export async function addSubscription(
  _prevState: AddSubscriptionState,
  formData: FormData,
): Promise<AddSubscriptionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const monthlyCost = Number(formData.get("monthlyCost"));
  const renewalDate = String(formData.get("renewalDate") ?? "");
  const trialEndsAt = String(formData.get("trialEndsAt") ?? "");

  // Server-side validation — không tin dữ liệu từ form, dù front-end đã có required/min.
  if (!name || !category || !renewalDate || Number.isNaN(monthlyCost) || monthlyCost < 0) {
    return { error: "Điền đủ tên, danh mục, chi phí hợp lệ (>= 0), và ngày gia hạn." };
  }

  const { error } = await supabase.from("subscriptions").insert({
    user_id: user.id,
    name,
    category,
    monthly_cost: monthlyCost,
    renewal_date: renewalDate,
    trial_ends_at: trialEndsAt || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return null;
}
