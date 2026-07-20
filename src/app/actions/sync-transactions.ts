"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getPlaidItemsWithAccessToken } from "@/lib/supabase/plaid-items";
import { fetchTransactions } from "@/lib/plaid/transactions";
import { detectRecurringCandidates, classifyMerchant } from "@/lib/subscription-rules";

const DAY_MS = 24 * 60 * 60 * 1000;

export type SyncTransactionsState = { error: string; count?: never } | { count: number; error?: never };

export async function syncTransactions(): Promise<SyncTransactionsState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Bạn cần đăng nhập." };
  }

  const plaidItems = await getPlaidItemsWithAccessToken(user.id);
  if (plaidItems.length === 0) {
    return { error: "Chưa kết nối ngân hàng nào." };
  }

  let syncedCount = 0;

  for (const item of plaidItems) {
    const transactions = await fetchTransactions(item.accessToken);
    const candidates = detectRecurringCandidates(transactions);

    for (const candidate of candidates) {
      const { category, duplicateGroup } = classifyMerchant(candidate.displayName);
      const renewalDate = new Date(new Date(candidate.lastDate).getTime() + 30 * DAY_MS)
        .toISOString()
        .slice(0, 10);

      const { error } = await supabase.from("subscriptions").upsert(
        {
          user_id: user.id,
          merchant_key: candidate.merchantKey,
          name: candidate.displayName,
          category,
          monthly_cost: candidate.monthlyCost,
          renewal_date: renewalDate,
          duplicate_group: duplicateGroup ?? null,
        },
        { onConflict: "user_id,merchant_key" },
      );

      if (error) {
        return { error: `Không lưu được subscription "${candidate.displayName}": ${error.message}` };
      }

      syncedCount += 1;
    }
  }

  revalidatePath("/");
  return { count: syncedCount };
}
