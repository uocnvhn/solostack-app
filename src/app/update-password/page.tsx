"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/actions/auth";

export default function UpdatePasswordPage() {
  const [state, formAction, pending] = useActionState(updatePassword, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-black dark:text-white">Đặt mật khẩu mới</h1>
        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="text-sm font-medium text-black/70 dark:text-white/70">
              Mật khẩu mới
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:focus:border-white/30"
            />
            <p className="mt-1 text-xs text-black/40 dark:text-white/40">Ít nhất 6 ký tự.</p>
          </div>
          {state?.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            {pending ? "Đang lưu..." : "Lưu mật khẩu mới"}
          </button>
        </form>
      </div>
    </div>
  );
}
