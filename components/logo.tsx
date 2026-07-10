import { cn } from "@/lib/utils"
import { ChartSpline } from "lucide-react"

export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <ChartSpline className="size-5" />
      </div>
      {showText && (
        <span className="text-lg font-semibold tracking-tight">Ledgerly</span>
      )}
    </div>
  )
}
