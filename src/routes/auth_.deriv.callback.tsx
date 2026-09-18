import { createFileRoute } from "@tanstack/react-router";
import { DerivCallbackView } from "@/components/app/DerivCallbackView";

export const Route = createFileRoute("/auth_/deriv/callback")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Deriv connection — MiyaraTrader" },
      { name: "description", content: "Deriv account connection status." },
      { property: "og:title", content: "Deriv connection — MiyaraTrader" },
      { property: "og:description", content: "Deriv account connection status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <DerivCallbackView cleanPath="/auth/deriv/callback" />,
});
