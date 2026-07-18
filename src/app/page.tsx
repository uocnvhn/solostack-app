import { redirect } from "next/navigation";
import { SummaryStats } from "@/components/SummaryStats";
import { AlertsPanel } from "@/components/AlertsPanel";
import { SubscriptionList } from "@/components/SubscriptionList";
import { AddSubscriptionForm } from "@/components/AddSubscriptionForm";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptions } from "@/lib/supabase/subscriptions";
import { signOut } from "@/app/actions/auth";
import {
  getTotalMonthlyCost,
  getDuplicateGroups,
  getExpiringTrials,
  getPotentialSavings,
} from "@/lib/subscription-insights";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const subscriptions = await getSubscriptions();
  const totalMonthlyCost = getTotalMonthlyCost(subscriptions);
  const duplicateGroups = getDuplicateGroups(subscriptions);
  const expiringTrials = getExpiringTrials(subscriptions);
  const potentialSavings = getPotentialSavings(subscriptions);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="text-lg font-semibold tracking-tight text-black dark:text-white">SoloStack</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-black/60 dark:text-white/60">{user.email}</span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black hover:bg-black/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
              >
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-black dark:text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-black/60 dark:text-white/60">
              {subscriptions.length === 0
                ? "Chưa có subscription nào — thêm thủ công bên dưới (kết nối ngân hàng tự động sẽ có ở bản sau)."
                : "Dữ liệu subscription thật của bạn, lưu trong Supabase."}
            </p>
          </div>
        </div>

        <AddSubscriptionForm />

        {subscriptions.length > 0 && (
          <>
            <SummaryStats
              totalMonthlyCost={totalMonthlyCost}
              subscriptionCount={subscriptions.length}
              potentialSavings={potentialSavings}
            />
            <AlertsPanel duplicateGroups={duplicateGroups} expiringTrials={expiringTrials} />
            <div>
              <h2 className="mb-3 text-sm font-medium text-black/60 dark:text-white/60">
                Tất cả subscription ({subscriptions.length})
              </h2>
              <SubscriptionList subscriptions={subscriptions} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
