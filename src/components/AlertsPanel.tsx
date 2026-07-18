import { DuplicateGroup } from "@/lib/subscription-insights";
import { Subscription } from "@/lib/mock-data";
import { daysUntil } from "@/lib/subscription-insights";

type AlertsPanelProps = {
  duplicateGroups: DuplicateGroup[];
  expiringTrials: Subscription[];
};

export function AlertsPanel({ duplicateGroups, expiringTrials }: AlertsPanelProps) {
  if (duplicateGroups.length === 0 && expiringTrials.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {duplicateGroups.length > 0 && (
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-5 dark:border-orange-900/40 dark:bg-orange-950/30">
          <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
            Trùng lặp chức năng ({duplicateGroups.length})
          </p>
          <ul className="mt-3 space-y-2">
            {duplicateGroups.map((group) => (
              <li key={group.key} className="text-sm text-orange-900 dark:text-orange-200">
                <span className="font-medium">{group.category}:</span>{" "}
                {group.members.map((m) => m.name).join(", ")} — cân nhắc giữ lại 1
              </li>
            ))}
          </ul>
        </div>
      )}
      {expiringTrials.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-900/40 dark:bg-amber-950/30">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
            Trial sắp hết hạn ({expiringTrials.length})
          </p>
          <ul className="mt-3 space-y-2">
            {expiringTrials.map((sub) => {
              const days = daysUntil(sub.trialEndsAt!);
              return (
                <li key={sub.id} className="text-sm text-amber-900 dark:text-amber-200">
                  <span className="font-medium">{sub.name}</span> — hết hạn trong{" "}
                  {days === 0 ? "hôm nay" : `${days} ngày`}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
