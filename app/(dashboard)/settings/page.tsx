"use client"

import * as React from "react"
import { toast } from "sonner"

import { useAuth } from "@/components/auth-provider"
import { PageHeader } from "@/components/dashboard/page-header"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export default function SettingsPage() {
  const { user } = useAuth()
  const [name, setName] = React.useState(user?.name ?? "")
  const [email, setEmail] = React.useState(user?.email ?? "")

  function handleSave(event: React.FormEvent) {
    event.preventDefault()
    toast.success("Settings saved.")
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage your account and preferences." />

      <Tabs defaultValue="profile" className="gap-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleSave}>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <Avatar className="size-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {initials(name || "U")}
                    </AvatarFallback>
                  </Avatar>
                  <Button type="button" variant="outline" size="sm">
                    Change avatar
                  </Button>
                </div>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Full name</FieldLabel>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="capitalize"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <FieldDescription>
                      Used for sign in and account notifications.
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </CardContent>
              <CardFooter className="border-t">
                <Button type="submit">Save changes</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Customize how the dashboard behaves.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
              <SettingRow
                label="Compact tables"
                description="Reduce row height in transaction lists."
              />
              <Separator />
              <SettingRow
                label="Show cents"
                description="Display exact amounts including decimals."
                defaultChecked
              />
              <Separator />
              <SettingRow
                label="Weekly summary"
                description="Roll up your spending into a weekly view."
                defaultChecked
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose what you want to hear about.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col">
              <SettingRow
                label="Budget alerts"
                description="Notify me when I approach a budget limit."
                defaultChecked
              />
              <Separator />
              <SettingRow
                label="Large transactions"
                description="Alert me about transactions over $500."
                defaultChecked
              />
              <Separator />
              <SettingRow
                label="Product updates"
                description="Occasional emails about new features."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

function SettingRow({
  label,
  description,
  defaultChecked,
}: {
  label: string
  description: string
  defaultChecked?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground text-pretty">{description}</span>
      </div>
      <Switch
        defaultChecked={defaultChecked}
        onCheckedChange={() => toast.success("Preference updated.")}
      />
    </div>
  )
}
