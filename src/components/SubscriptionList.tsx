import { Subscription } from "@/lib/types";
import { daysUntil } from "@/lib/subscription-insights";

type SubscriptionListProps = {
  subscriptions: Subscription[];
};

export function SubscriptionList({ subscriptions }: SubscriptionListProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-black/10 dark:border-white/10">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="border-b border-black/10 bg-black/[0.02] text-black/60 dark:border-white/10 dark:bg-white/[0.03] dark:text-white/60">
          <tr>
            <th className="px-4 py-3 font-medium">Tên</th>
            <th className="px-4 py-3 font-medium">Danh mục</th>
            <th className="px-4 py-3 font-medium">Chi phí/tháng</th>
            <th className="px-4 py-3 font-medium">Gia hạn</th>
            <th className="px-4 py-3 font-medium">Trạng thái</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub.id} className="border-b border-black/5 last:border-0 dark:border-white/5">
              <td className="px-4 py-3 font-medium">{sub.name}</td>
              <td className="px-4 py-3 text-black/60 dark:text-white/60">{sub.category}</td>
              <td className="px-4 py-3">${sub.monthlyCost.toFixed(2)}</td>
              <td className="px-4 py-3 text-black/60 dark:text-white/60">
                {new Date(sub.renewalDate).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-4 py-3">
                {sub.trialEndsAt && daysUntil(sub.trialEndsAt) <= 3 && (
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                    Trial sắp hết hạn
                  </span>
                )}
                {sub.duplicateGroup && (
                  <span className="ml-1 rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800 dark:bg-orange-950/40 dark:text-orange-300">
                    Trùng lặp
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <button className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400">
                  Huỷ hộ tôi
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
