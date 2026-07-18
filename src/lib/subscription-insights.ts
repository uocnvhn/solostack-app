import { Subscription } from "./mock-data";

const DAY_MS = 24 * 60 * 60 * 1000;

export function getTotalMonthlyCost(subs: Subscription[]): number {
  return subs.reduce((sum, sub) => sum + sub.monthlyCost, 0);
}

export type DuplicateGroup = {
  key: string;
  category: string;
  members: Subscription[];
};

export function getDuplicateGroups(subs: Subscription[]): DuplicateGroup[] {
  const groups = new Map<string, Subscription[]>();
  for (const sub of subs) {
    if (!sub.duplicateGroup) continue;
    const existing = groups.get(sub.duplicateGroup) ?? [];
    existing.push(sub);
    groups.set(sub.duplicateGroup, existing);
  }
  return Array.from(groups.entries())
    .filter(([, members]) => members.length > 1)
    .map(([key, members]) => ({ key, category: members[0].category, members }));
}

export function getExpiringTrials(subs: Subscription[], today = new Date()): Subscription[] {
  return subs
    .filter((sub) => sub.trialEndsAt)
    .filter((sub) => {
      const daysLeft = Math.ceil((new Date(sub.trialEndsAt!).getTime() - today.getTime()) / DAY_MS);
      return daysLeft >= 0 && daysLeft <= 3;
    });
}

export function daysUntil(dateStr: string, today = new Date()): number {
  return Math.ceil((new Date(dateStr).getTime() - today.getTime()) / DAY_MS);
}

export function getPotentialSavings(subs: Subscription[]): number {
  const duplicateGroups = getDuplicateGroups(subs);
  return duplicateGroups.reduce((sum, group) => {
    const sorted = [...group.members].sort((a, b) => a.monthlyCost - b.monthlyCost);
    const removable = sorted.slice(1);
    return sum + removable.reduce((s, sub) => s + sub.monthlyCost, 0);
  }, 0);
}
