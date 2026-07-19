"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(requestPasswordReset, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-black dark:text-white">Quên mật khẩu</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Nhập email đã đăng ký, chúng tôi sẽ gửi link để bạn đặt lại mật khẩu.
        </p>
        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-black/70 dark:text-white/70">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:focus:border-white/30"
            />
          </div>
          {state?.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            {pending ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
          </button>
        </form>
        <p className="mt-4 text-sm text-black/60 dark:text-white/60">
          <Link href="/login" className="font-medium text-blue-600 dark:text-blue-400">
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
