"use client";

import { useAuth } from "@/components/auth-provider";
import { DEFAULT_RESPONSE } from "@/modules/shared/constants";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export function useLoginForm(
  handleLogin: (prevState: any, formData: FormData) => Promise<any>,
) {
  const [state, formAction, pending] = React.useActionState(
    handleLogin,
    DEFAULT_RESPONSE,
  );
  const { signIn, user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [isLoading, user, router]);

  React.useEffect(() => {
    console.log(user);
    if (user) {
      router.replace("/");
    }
    if (!state.status) {
      if (state.message) {
        toast.error(state.message);
      }
      return;
    }

    signIn(state.data.name);
    toast.success(state.message ?? "Login berhasil");
    router.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return { formAction, pending };
}
