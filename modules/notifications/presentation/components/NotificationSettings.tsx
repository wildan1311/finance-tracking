"use client";

import * as React from "react";
import { Bell, BellOff, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldDescription, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Response } from "@/modules/shared/domain/Response";
import { sendDailyReminderNow, sendTestNotification } from "../actions/notifications.actions";
import { usePushSubscription } from "../hooks/usePushSubscription";

/**
 * Opt-in surface for Web Push, plus the manual triggers.
 *
 * Enabling is always a click, never on mount: browsers reject a permission
 * prompt that was not triggered by a user gesture.
 */
export function NotificationSettings() {
  const { support, permission, subscribed, pending, error, hint, enable, disable } =
    usePushSubscription();

  const [testing, setTesting] = React.useState(false);
  const [reminding, setReminding] = React.useState(false);

  React.useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const withFeedback = React.useCallback(
    async (setter: (v: boolean) => void, action: () => Promise<Response>) => {
      setTesting(true);
      try {
        const result = await action();
        if (result.status) toast.success(result.message);
        else toast.error(result.message);
      } catch {
        toast.error("Something went wrong. Check the server logs.");
      } finally {
        setter(false);
        setTesting(false);
      }
    },
    [],
  );

  const unsupported = support === "unsupported";
  const iosHint =
    typeof navigator !== "undefined" &&
    /iP(hone|ad|od)/.test(navigator.userAgent) &&
    !("standalone" in navigator);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Get a daily reminder to record your expenses and income.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="push-notifications">Push notifications</FieldLabel>
            <FieldDescription>
              {unsupported
                ? "Not supported in this browser."
                : subscribed
                  ? "Enabled for this device."
                  : "Disabled. You will get one reminder per day."}
            </FieldDescription>
          </div>

          {subscribed ? (
            <Badge variant="outline" className="gap-1.5">
              <Bell data-icon="inline-start" className="size-3" />
              On
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1.5">
              <BellOff data-icon="inline-start" className="size-3" />
              Off
            </Badge>
          )}
        </div>

        {permission === "denied" && (
          <p className="text-sm text-destructive">
            Notifications are blocked. Re-enable them for this site in your browser
            settings, then reload.
          </p>
        )}

        {iosHint && (
          <p className="text-sm text-muted-foreground">
            On iPhone and iPad, Web Push only works after installing this app to
            your home screen (iOS 16.4+). Use Safari&apos;s Share → Add to Home
            Screen, then open it from the icon.
          </p>
        )}

        {hint && !iosHint && <p className="text-sm text-muted-foreground">{hint}</p>}

        <Button
          onClick={subscribed ? disable : enable}
          disabled={unsupported || pending || permission === "denied"}
          className="w-fit"
        >
          {pending && <Loader2 data-icon="inline-start" className="animate-spin" />}
          {subscribed ? "Disable notifications" : "Enable notifications"}
        </Button>

        <Separator />

        <div className="flex flex-col gap-2">
          <FieldLabel>Manual triggers</FieldLabel>
          <FieldDescription>
            For verifying delivery. The daily reminder normally runs on a schedule
            and will not send twice on the same day.
          </FieldDescription>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!subscribed || testing || reminding}
              onClick={() => withFeedback(setTesting, sendTestNotification)}
            >
              {testing ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : (
                <Send data-icon="inline-start" />
              )}
              Send test
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={!subscribed || testing || reminding}
              onClick={() => withFeedback(setReminding, sendDailyReminderNow)}
            >
              {reminding ? (
                <Loader2 data-icon="inline-start" className="animate-spin" />
              ) : (
                <Send data-icon="inline-start" />
              )}
              Run daily reminder
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default NotificationSettings;
