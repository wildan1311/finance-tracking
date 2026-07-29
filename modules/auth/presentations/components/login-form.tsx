"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import FieldFormInput from "@/components/ui/forms/field-form-Input";
import { useAuth } from "@/components/auth-provider";
import { Logo } from "@/components/logo";
import { Card } from "@/components/ui/card";
import { useLoginForm } from "../hooks/use-login-form";

const LoginForm = ({
  handleLogin,
}: {
  handleLogin: (prevState: any, formData: FormData) => Promise<any>;
}) => {
  const { formAction, pending } = useLoginForm(handleLogin);
  const { isLoading } = useAuth();

  if (isLoading) {
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

  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <div className="flex justify-center">
        <Logo />
      </div>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your credentials to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <FieldFormInput
                name="name"
                label="Name"
                id="name"
                type="text"
                placeholder="John Doe"
                required
              />
              <FieldFormInput
                name="pin"
                label="Pin"
                id="pin"
                type="password"
                placeholder="******"
                required
              />
              <Button
                type="submit"
                size="lg"
                disabled={pending}
                className="w-full"
              >
                {pending && (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                )}
                {pending ? "Signing in..." : "Sign in"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground text-balance">
        Demo mode — any email and password will sign you in. No account is
        created.
      </p>
    </div>
  );
};

export default LoginForm;
