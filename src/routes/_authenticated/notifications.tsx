import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader, Card } from "@/components/app/AppUI";
import { Bell, CheckCheck, Info, TrendingUp, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — MiyaraTrader" },
      { name: "description", content: "MiyaraTrader account notifications." },
      { property: "og:title", content: "Notifications — MiyaraTrader" },
      { property: "og:description", content: "MiyaraTrader account notifications." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NotificationsPage,
});

interface Notif {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

function iconFor(type: string) {
  if (type === "news") return Megaphone;
  if (type === "trade") return TrendingUp;
  if (type === "system") return Info;
  return Bell;
}

function NotificationsPage() {
  const [items, setItems] = useState<Notif[]>([]);

  async function refresh() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", u.user.id)
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Unable to load notifications");
      return;
    }
    setItems(((data ?? []) as Notif[]).filter((n) => n.title !== "Phase 2 preview"));
  }
  useEffect(() => {
    refresh();
  }, []);

  async function markAll() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", u.user.id)
      .eq("read", false);
    if (error) {
      toast.error(error.message);
      return;
    }
    refresh();
  }

  const unread = items.filter((i) => !i.read).length;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Inbox"
        title="Notifications"
        subtitle={`${unread} unread`}
        action={
          unread > 0 && (
            <Button variant="outline" onClick={markAll}>
              <CheckCheck className="h-4 w-4 mr-2" /> Mark all read
            </Button>
          )
        }
      />
      <div className="space-y-2">
        {items.length === 0 && (
          <Card>
            <div className="text-sm text-muted-foreground">No notifications yet.</div>
          </Card>
        )}
        {items.map((n) => {
          const Icon = iconFor(n.type);
          return (
            <div
              key={n.id}
              className={`glass rounded-2xl p-5 flex gap-4 items-start ${!n.read ? "border-primary/30" : ""}`}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary shrink-0">
                <Icon className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <div className="font-semibold">{n.title}</div>
                  {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{n.message}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  {new Date(n.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
