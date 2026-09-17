import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader, Card } from "@/components/app/AppUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, User as UserIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My account — MiyaraTrader" },
      { name: "description", content: "Manage your MiyaraTrader profile and password." },
      { property: "og:title", content: "My account — MiyaraTrader" },
      { property: "og:description", content: "Manage your MiyaraTrader profile and password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  country: string | null;
  timezone: string | null;
  phone: string | null;
}

function ProfilePage() {
  const [p, setP] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.user.id)
        .maybeSingle();
      setP(
        (data as Profile) ?? {
          id: u.user.id,
          email: u.user.email ?? null,
          full_name: null,
          avatar_url: null,
          country: null,
          timezone: null,
          phone: null,
        },
      );
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!p) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        country: p.country,
        timezone: p.timezone,
        phone: p.phone,
      })
      .eq("id", p.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile saved");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    setNewPassword("");
  }

  if (!p)
    return (
      <PageContainer>
        <div className="p-8 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading profile…
        </div>
      </PageContainer>
    );

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Account"
        title="My account"
        subtitle="Manage your personal information and security."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col items-center text-center">
          <div className="h-24 w-24 rounded-full bg-primary/20 text-primary flex items-center justify-center text-3xl font-bold">
            {p.avatar_url?.startsWith("https://") ? (
              <img
                src={p.avatar_url}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              (p.full_name?.[0]?.toUpperCase() ??
              p.email?.[0]?.toUpperCase() ?? <UserIcon className="h-8 w-8" />)
            )}
          </div>
          <div className="mt-4 font-semibold">{p.full_name || "Unnamed trader"}</div>
          <div className="text-xs text-muted-foreground mt-1">{p.email}</div>
        </Card>
        <Card className="md:col-span-2">
          <form onSubmit={save} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Full name</Label>
                <Input
                  value={p.full_name ?? ""}
                  onChange={(e) => setP({ ...p, full_name: e.target.value })}
                  className="mt-1.5 h-10"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={p.email ?? ""} disabled className="mt-1.5 h-10" />
              </div>
              <div>
                <Label>Country</Label>
                <Input
                  value={p.country ?? ""}
                  onChange={(e) => setP({ ...p, country: e.target.value })}
                  placeholder="e.g. Sri Lanka"
                  className="mt-1.5 h-10"
                />
              </div>
              <div>
                <Label>Timezone</Label>
                <Input
                  value={p.timezone ?? ""}
                  onChange={(e) => setP({ ...p, timezone: e.target.value })}
                  placeholder="e.g. Asia/Colombo"
                  className="mt-1.5 h-10"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={p.phone ?? ""}
                  onChange={(e) => setP({ ...p, phone: e.target.value })}
                  className="mt-1.5 h-10"
                />
              </div>
              <div>
                <Label>Avatar URL</Label>
                <Input
                  value={p.avatar_url ?? ""}
                  onChange={(e) => setP({ ...p, avatar_url: e.target.value })}
                  className="mt-1.5 h-10"
                />
              </div>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </Card>
      </div>

      <Card>
        <h2 className="font-display text-lg font-semibold">Security</h2>
        <p className="text-sm text-muted-foreground mt-1">Update your password.</p>
        <form onSubmit={changePassword} className="mt-4 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <Label>New password</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1.5 h-10"
            />
          </div>
          <Button type="submit" variant="outline">
            Update password
          </Button>
        </form>
      </Card>
    </PageContainer>
  );
}
