import loginAction from "@/modules/auth/presentations/actions/login.actions"
import LoginForm from "@/modules/auth/presentations/components/login-form";

export default function LoginPage() {
  const handleLogin = async (_prevState: any, formData: FormData) => {
      "use server"
      return await loginAction(_prevState, formData);
  };

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4">
      <LoginForm handleLogin={handleLogin} />
    </main>
  )
}
