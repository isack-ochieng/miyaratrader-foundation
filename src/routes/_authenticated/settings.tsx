import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader, Card } from "@/components/app/AppUI";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — MiyaraTrader" },
      { name: "description", content: "Manage MiyaraTrader account preferences." },
      { property: "og:title", content: "Settings — MiyaraTrader" },
      { property: "og:description", content: "Manage MiyaraTrader account preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SettingsPage,
});

interface Settings {
  user_id: string;
  theme: string;
  language: string;
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  two_factor_enabled: boolean;
}

function SettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", u.user.id)
        .maybeSingle();
      setS(
        (data as Settings) ?? {
          user_id: u.user.id,
          theme: "dark",
          language: "en",
          email_notifications: true,
          push_notifications: true,
          marketing_emails: false,
          two_factor_enabled: false,
        },
      );
    })();
  }, []);

  async function save() {
    if (!s) return;
    setSaving(true);
    const { error } = await supabase
      .from("user_settings")
      .upsert({ ...s, marketing_emails: false });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Settings saved");
  }

  if (!s)
    return (
      <PageContainer>
        <div className="p-8 flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading settings…
        </div>
      </PageContainer>
    );

  return (
    <PageContainer>
      <PageHeader eyebrow="Preferences" title="Settings" subtitle="Account preferences" />

      <Card>
        <h2 className="font-display text-lg font-semibold mb-4">Appearance</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Theme</Label>
            <Select value={s.theme} onValueChange={(v) => setS({ ...s, theme: v })}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light" disabled>
                  Light (coming soon)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Language</Label>
            <Select value={s.language} onValueChange={(v) => setS({ ...s, language: v })}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="si" disabled>
                  Sinhala (unavailable)
                </SelectItem>
                <SelectItem value="ta" disabled>
                  Tamil (unavailable)
                </SelectItem>
                <SelectItem value="es" disabled>
                  Spanish (unavailable)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-lg font-semibold mb-4">Notifications</h2>
        <SettingsRow
          label="Email notifications"
          desc="Delivery preferences; notification delivery is not enabled"
          disabled
          checked={s.email_notifications}
          onChange={(v) => setS({ ...s, email_notifications: v })}
        />
        <SettingsRow
          label="Push notifications"
          desc="Browser push alerts are not available"
          disabled
          checked={s.push_notifications}
          onChange={(v) => setS({ ...s, push_notifications: v })}
        />
      </Card>

      <Card>
        <h2 className="font-display text-lg font-semibold mb-4">Security</h2>
        <SettingsRow
          label="Two-factor authentication"
          desc="Extra layer of protection at sign-in (coming soon)"
          checked={s.two_factor_enabled}
          onChange={(v) => setS({ ...s, two_factor_enabled: v })}
          disabled
        />
      </Card>

      <div>
        <Button onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </PageContainer>
  );
}

function SettingsRow({
  label,
  desc,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/60 last:border-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
