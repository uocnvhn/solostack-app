"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn } from "@/app/actions/auth";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-black dark:text-white">Đăng nhập SoloStack</h1>
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
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-black/70 dark:text-white/70">
                Mật khẩu
              </label>
              <Link href="/forgot-password" className="text-xs font-medium text-blue-600 dark:text-blue-400">
                Quên mật khẩu?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/10 dark:bg-white/5 dark:focus:border-white/30"
            />
          </div>
          {state?.error && <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/80 disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            {pending ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          <span className="text-xs text-black/40 dark:text-white/40">hoặc</span>
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        </div>
        <GoogleSignInButton />

        <p className="mt-4 text-sm text-black/60 dark:text-white/60">
          Chưa có tài khoản?{" "}
          <Link href="/signup" className="font-medium text-blue-600 dark:text-blue-400">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
