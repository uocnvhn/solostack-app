import { SummaryStats } from "@/components/SummaryStats";
import { AlertsPanel } from "@/components/AlertsPanel";
import { SubscriptionList } from "@/components/SubscriptionList";
import { subscriptions } from "@/lib/mock-data";
import {
  getTotalMonthlyCost,
  getDuplicateGroups,
  getExpiringTrials,
  getPotentialSavings,
} from "@/lib/subscription-insights";

export default function Home() {
  const totalMonthlyCost = getTotalMonthlyCost(subscriptions);
  const duplicateGroups = getDuplicateGroups(subscriptions);
  const expiringTrials = getExpiringTrials(subscriptions);
  const potentialSavings = getPotentialSavings(subscriptions);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="text-lg font-semibold tracking-tight text-black dark:text-white">
            SoloStack
          </span>
          <button className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80">
            Kết nối ngân hàng
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold text-black dark:text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-black/60 dark:text-white/60">
            Dữ liệu demo (chưa nối ngân hàng thật) — kết nối Plaid để quét giao dịch tự động.
          </p>
        </div>

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
      </main>
    </div>
  );
}
