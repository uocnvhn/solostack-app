import { createClient } from "@/lib/supabase/server";

export type PlaidItem = {
  id: string;
  institutionName: string | null;
  createdAt: string;
};

export async function savePlaidItem(
  userId: string,
  itemId: string,
  accessToken: string,
  institutionName: string | null,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("plaid_items").insert({
    user_id: userId,
    item_id: itemId,
    access_token: accessToken,
    institution_name: institutionName,
  });

  if (error) {
    throw new Error(`Không lưu được kết nối ngân hàng: ${error.message}`);
  }
}

// Chỉ dùng trong server action (vd. sync-transactions.ts) — access_token
// không bao giờ được trả ra Server Component hay client.
export async function getPlaidItemsWithAccessToken(
  userId: string,
): Promise<{ accessToken: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plaid_items")
    .select("access_token")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Không đọc được kết nối ngân hàng: ${error.message}`);
  }

  return (data ?? []).map((row) => ({ accessToken: row.access_token }));
}

export async function getPlaidItems(): Promise<PlaidItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("plaid_items")
    .select("id, institution_name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Không đọc được danh sách kết nối ngân hàng: ${error.message}`);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    institutionName: row.institution_name,
    createdAt: row.created_at,
  }));
}
