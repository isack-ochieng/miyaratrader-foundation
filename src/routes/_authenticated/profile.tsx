import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader, Card } from "@/components/app/AppUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Camera, Loader2, User as UserIcon, Upload } from "lucide-react";

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
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      setP((data as Profile) ?? {
        id: u.user.id,
        email: u.user.email ?? null,
        full_name: null,
        avatar_url: null,
        country: null,
        timezone: null,
        phone: null,
      });
    })();
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!p) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      full_name: p.full_name,
      avatar_url: p.avatar_url,
      country: p.country,
      timezone: p.timezone,
      phone: p.phone,
    }).eq("id", p.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile saved");
  }

  async function uploadAvatar(file: File) {
    if (!p) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile images must be 5 MB or smaller");
      return;
    }

    setUploadingAvatar(true);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${p.id}/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) {
      setUploadingAvatar(false);
      toast.error(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const { error: profileError } = await supabase.from("profiles").update({
      avatar_url: data.publicUrl,
    }).eq("id", p.id);

    setUploadingAvatar(false);
    if (profileError) {
      toast.error(profileError.message);
      return;
    }

    setP({ ...p, avatar_url: data.publicUrl });
    toast.success("Profile photo updated");
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated");
    setNewPassword("");
  }

  if (!p) {
    return (
      <PageContainer>
        <div className="flex items-center gap-2 p-8 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading profile…
        </div>
      </PageContainer>
    );
  }

  const initial = p.full_name?.[0]?.toUpperCase() ?? p.email?.[0]?.toUpperCase();

  return (
    <PageContainer>
      <PageHeader eyebrow="Account" title="My account" subtitle="Manage your personal information and security." />

      <div className="grid items-start gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Card className="flex flex-col items-center text-center lg:sticky lg:top-20">
          <div className="relative">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-border/80 bg-primary/10 text-primary shadow-[0_0_0_6px_oklch(0.72_0.16_160/0.06)] transition hover:border-primary/50"
              aria-label="Upload profile photo"
            >
              {p.avatar_url ? (
                <img src={p.avatar_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <span className="text-3xl font-bold">{initial || <UserIcon className="h-8 w-8" />}</span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-white opacity-0 transition group-hover:opacity-100">
                <Camera className="h-5 w-5" />
              </span>
            </button>
            {uploadingAvatar && (
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/55 text-white">
                <Loader2 className="h-5 w-5 animate-spin" />
              </span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadAvatar(file);
              e.currentTarget.value = "";
            }}
          />
          <Button type="button" variant="outline" size="sm" className="mt-5" onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar}>
            {uploadingAvatar ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {uploadingAvatar ? "Uploading…" : "Upload photo"}
          </Button>
          <p className="mt-2 text-[11px] text-muted-foreground">PNG, JPG or WebP · Max 5 MB</p>
          <div className="mt-4 font-semibold">{p.full_name || "Unnamed trader"}</div>
          <div className="mt-1 break-all text-xs text-muted-foreground">{p.email}</div>
        </Card>

        <Card>
          <form onSubmit={save} className="space-y-5">
            <div>
              <h2 className="font-display text-lg font-semibold">Personal information</h2>
              <p className="mt-1 text-sm text-muted-foreground">Keep your account details current.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Full name">
                <Input value={p.full_name ?? ""} onChange={(e) => setP({ ...p, full_name: e.target.value })} className="mt-1.5 h-10" />
              </Field>
              <Field label="Email">
                <Input value={p.email ?? ""} disabled className="mt-1.5 h-10" />
              </Field>
              <Field label="Country">
                <Input value={p.country ?? ""} onChange={(e) => setP({ ...p, country: e.target.value })} placeholder="e.g. Kenya" className="mt-1.5 h-10" />
              </Field>
              <Field label="Timezone">
                <Input value={p.timezone ?? ""} onChange={(e) => setP({ ...p, timezone: e.target.value })} placeholder="e.g. Africa/Nairobi" className="mt-1.5 h-10" />
              </Field>
              <Field label="Phone">
                <Input value={p.phone ?? ""} onChange={(e) => setP({ ...p, phone: e.target.value })} placeholder="+254..." className="mt-1.5 h-10" />
              </Field>
            </div>

            <div className="flex justify-start border-t border-border/60 pt-4">
              <Button type="submit" disabled={saving} className="min-w-36">
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <Card>
        <h2 className="font-display text-lg font-semibold">Security</h2>
        <p className="mt-1 text-sm text-muted-foreground">Update your account password.</p>
        <form onSubmit={changePassword} className="mt-4 max-w-xl space-y-3">
          <div>
            <Label>New password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" className="mt-1.5 h-10" />
          </div>
          <Button type="submit" variant="outline" disabled={saving} className="min-w-40">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? "Updating…" : "Update password"}
          </Button>
        </form>
      </Card>
    </PageContainer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><Label>{label}</Label>{children}</div>;
}
