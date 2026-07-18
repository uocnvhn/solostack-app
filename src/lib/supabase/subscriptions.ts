import { createClient } from "@/lib/supabase/server";
import { Subscription } from "@/lib/types";

type SubscriptionRow = {
  id: string;
  name: string;
  category: string;
  monthly_cost: number;
  renewal_date: string;
  trial_ends_at: string | null;
  duplicate_group: string | null;
};

function mapRow(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    monthlyCost: Number(row.monthly_cost),
    renewalDate: row.renewal_date,
    trialEndsAt: row.trial_ends_at ?? undefined,
    duplicateGroup: row.duplicate_group ?? undefined,
  };
}

export async function getSubscriptions(): Promise<Subscription[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, name, category, monthly_cost, renewal_date, trial_ends_at, duplicate_group")
    .order("renewal_date", { ascending: true });

  if (error) {
    throw new Error(`Không đọc được subscriptions: ${error.message}`);
  }

  return (data ?? []).map(mapRow);
}
