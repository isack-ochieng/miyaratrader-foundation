import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => { throw redirect({ to: "/auth" }); },
  head: () => ({ meta: [
    { title: "MiyaraTrader — Account access" },
    { name: "description", content: "Access your MiyaraTrader account." },
    { property: "og:title", content: "MiyaraTrader — Account access" },
    { property: "og:description", content: "Access your MiyaraTrader account." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});
