"use client";

import { useState, useTransition } from "react";
import { syncTransactions } from "@/app/actions/sync-transactions";

export function SyncTransactionsButton() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const handleClick = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await syncTransactions();
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage(`Đã đồng bộ ${result.count} subscription từ giao dịch ngân hàng.`);
      }
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-black hover:bg-black/5 disabled:opacity-50 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
      >
        {isPending ? "Đang đồng bộ..." : "Đồng bộ giao dịch"}
      </button>
      {message && <p className="mt-2 text-sm text-black/60 dark:text-white/60">{message}</p>}
    </div>
  );
}
