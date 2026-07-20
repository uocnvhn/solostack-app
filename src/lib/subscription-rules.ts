import { Transaction } from "plaid";

type MerchantRule = {
  match: string[];
  category: string;
  duplicateGroup?: string;
};

// Bảng tra cứu tĩnh — không gọi AI API. Đủ dùng cho các SaaS phổ biến,
// merchant lạ sẽ rơi vào category "Khác" (xem classifyMerchant).
const MERCHANT_RULES: MerchantRule[] = [
  { match: ["notion", "coda", "evernote"], category: "Ghi chú", duplicateGroup: "note-taking" },
  { match: ["netflix", "disney", "hulu", "hbo"], category: "Giải trí", duplicateGroup: "streaming-video" },
  { match: ["spotify", "apple music", "tidal"], category: "Giải trí", duplicateGroup: "streaming-music" },
  { match: ["dropbox", "google drive", "google one", "icloud"], category: "Lưu trữ", duplicateGroup: "cloud-storage" },
  { match: ["figma", "canva", "adobe"], category: "Thiết kế", duplicateGroup: "design" },
  { match: ["slack", "zoom", "microsoft teams"], category: "Giao tiếp", duplicateGroup: "communication" },
  { match: ["github", "gitlab", "vercel", "aws", "amazon web services"], category: "Dev tools" },
  { match: ["openai", "chatgpt", "anthropic", "claude"], category: "AI tools" },
  { match: ["hubspot", "mailchimp", "salesforce"], category: "Marketing" },
];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function classifyMerchant(merchantName: string): { category: string; duplicateGroup?: string } {
  const normalized = normalize(merchantName);
  for (const rule of MERCHANT_RULES) {
    if (rule.match.some((keyword) => normalized.includes(keyword))) {
      return { category: rule.category, duplicateGroup: rule.duplicateGroup };
    }
  }
  return { category: "Khác" };
}

export type RecurringCandidate = {
  merchantKey: string;
  displayName: string;
  monthlyCost: number;
  lastDate: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function detectRecurringCandidates(transactions: Transaction[]): RecurringCandidate[] {
  const groups = new Map<string, Transaction[]>();

  for (const tx of transactions) {
    const displayName = tx.merchant_name ?? tx.name;
    if (!displayName) continue;
    const key = normalize(displayName);
    const existing = groups.get(key) ?? [];
    existing.push(tx);
    groups.set(key, existing);
  }

  const candidates: RecurringCandidate[] = [];

  for (const [merchantKey, txs] of groups) {
    if (txs.length < 2) continue;

    const sorted = [...txs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let isRecurring = false;

    for (let i = 1; i < sorted.length; i++) {
      const daysBetween = (new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime()) / DAY_MS;
      const amountA = Math.abs(sorted[i - 1].amount);
      const amountB = Math.abs(sorted[i].amount);
      const amountDiffRatio = Math.abs(amountA - amountB) / Math.max(amountA, amountB);

      if (daysBetween >= 20 && daysBetween <= 40 && amountDiffRatio < 0.15) {
        isRecurring = true;
        break;
      }
    }

    if (!isRecurring) continue;

    const latest = sorted[sorted.length - 1];
    candidates.push({
      merchantKey,
      displayName: latest.merchant_name ?? latest.name,
      monthlyCost: Math.abs(latest.amount),
      lastDate: latest.date,
    });
  }

  return candidates;
}
