"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { createLinkToken, exchangePublicToken } from "@/app/actions/plaid";

export function ConnectBankButton() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    createLinkToken()
      .then(setLinkToken)
      .catch(() => setError("Không tạo được kết nối tới Plaid. Thử lại sau."));
  }, []);

  const onSuccess = useCallback(async (publicToken: string, metadata: { institution: { name: string } | null }) => {
    setConnecting(true);
    const result = await exchangePublicToken(publicToken, metadata.institution?.name ?? null);
    setConnecting(false);
    if (result?.error) {
      setError(result.error);
    }
  }, []);

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
  });

  return (
    <div>
      <button
        type="button"
        onClick={() => open()}
        disabled={!ready || connecting}
        className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
      >
        {connecting ? "Đang kết nối..." : "Kết nối ngân hàng"}
      </button>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
