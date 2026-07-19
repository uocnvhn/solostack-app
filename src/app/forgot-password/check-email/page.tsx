export default function ForgotPasswordCheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-center dark:bg-black">
      <div className="max-w-sm">
        <h1 className="text-2xl font-semibold text-black dark:text-white">Kiểm tra email của bạn</h1>
        <p className="mt-3 text-sm text-black/60 dark:text-white/60">
          Nếu email đó có tài khoản, chúng tôi đã gửi link đặt lại mật khẩu. Bấm vào link trong email để đặt mật khẩu
          mới.
        </p>
      </div>
    </div>
  );
}
