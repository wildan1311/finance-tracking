import { Logo } from "@/components/logo";

export default function Loading() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="flex animate-pulse flex-col items-center gap-3">
        <Logo showText={false} />
        <span className="text-sm text-muted-foreground">
          Loading your dashboard...
        </span>
      </div>
    </div>
  );
}
