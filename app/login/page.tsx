import loginAction from "@/modules/auth/presentation/actions/login.action"
import LoginForm from "@/modules/auth/presentation/components/LoginForm";

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
