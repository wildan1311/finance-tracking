import { ProtectedShell } from "@/components/dashboard/protected-shell"
import { Toaster } from "@/components/ui/sonner"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedShell>
    {children}
  </ProtectedShell>
}
