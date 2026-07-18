type StatCardProps = {
  label: string;
  value: string;
  hint: string;
  accent?: "default" | "positive";
};

function StatCard({ label, value, hint, accent = "default" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm text-black/60 dark:text-white/60">{label}</p>
      <p
        className={`mt-2 text-3xl font-semibold ${
          accent === "positive" ? "text-emerald-600 dark:text-emerald-400" : "text-black dark:text-white"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-black/40 dark:text-white/40">{hint}</p>
    </div>
  );
}

type SummaryStatsProps = {
  totalMonthlyCost: number;
  subscriptionCount: number;
  potentialSavings: number;
};

export function SummaryStats({ totalMonthlyCost, subscriptionCount, potentialSavings }: SummaryStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard
        label="Tổng chi phí / tháng"
        value={`$${totalMonthlyCost.toFixed(2)}`}
        hint={`${subscriptionCount} subscription đang theo dõi`}
      />
      <StatCard
        label="Đang theo dõi"
        value={`${subscriptionCount}`}
        hint="tool được quét từ giao dịch ngân hàng"
      />
      <StatCard
        label="Tiềm năng tiết kiệm"
        value={`$${potentialSavings.toFixed(2)}/th`}
        hint="nếu huỷ các tool trùng chức năng"
        accent="positive"
      />
    </div>
  );
}
