"use client";

import { useActionState } from "react";
import { addSubscription } from "@/app/actions/subscriptions";

export function AddSubscriptionForm() {
  const [state, formAction, pending] = useActionState(addSubscription, null);

  return (
    <details className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <summary className="cursor-pointer text-sm font-medium text-black dark:text-white">
        + Thêm subscription
      </summary>
      <form action={formAction} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-xs font-medium text-black/60 dark:text-white/60">
            Tên tool
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Notion"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:focus:border-white/30"
          />
        </div>
        <div>
          <label htmlFor="category" className="text-xs font-medium text-black/60 dark:text-white/60">
            Danh mục
          </label>
          <input
            id="category"
            name="category"
            type="text"
            required
            placeholder="Productivity"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:focus:border-white/30"
          />
        </div>
        <div>
          <label htmlFor="monthlyCost" className="text-xs font-medium text-black/60 dark:text-white/60">
            Chi phí/tháng ($)
          </label>
          <input
            id="monthlyCost"
            name="monthlyCost"
            type="number"
            step="0.01"
            min="0"
            required
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:focus:border-white/30"
          />
        </div>
        <div>
          <label htmlFor="renewalDate" className="text-xs font-medium text-black/60 dark:text-white/60">
            Ngày gia hạn
          </label>
          <input
            id="renewalDate"
            name="renewalDate"
            type="date"
            required
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:focus:border-white/30"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="trialEndsAt" className="text-xs font-medium text-black/60 dark:text-white/60">
            Ngày hết hạn trial (nếu có)
          </label>
          <input
            id="trialEndsAt"
            name="trialEndsAt"
            type="date"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:focus:border-white/30"
          />
        </div>
        {state?.error && (
          <p className="text-sm text-red-600 sm:col-span-2 dark:text-red-400">{state.error}</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50 sm:col-span-2 dark:bg-white dark:text-black dark:hover:bg-white/80"
        >
          {pending ? "Đang lưu..." : "Lưu subscription"}
        </button>
      </form>
    </details>
  );
}
