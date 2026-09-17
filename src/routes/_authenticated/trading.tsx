import { createFileRoute } from "@tanstack/react-router";
import { PageContainer, PageHeader, ComingSoon, Card } from "@/components/app/AppUI";
import { LineChart, Activity, Wallet2, History, Signal, Bot, Wrench, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/trading")({
  head: () => ({ meta: [
    { title: "Trading workspace — MiyaraTrader" },
    { name: "description", content: "MiyaraTrader trading workspace. Trading execution is not available." },
    { property: "og:title", content: "Trading workspace — MiyaraTrader" },
    { property: "og:description", content: "MiyaraTrader trading workspace. Trading execution is not available." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: TradingPage,
});

function TradingPage() {
  return (
    <PageContainer>
      <PageHeader eyebrow="Trading workspace" title="Trading" subtitle="Trading execution is not available in this release." />
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 min-h-[380px] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Trading chart</div>
              <div className="text-2xl font-semibold mt-1">—</div>
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-widest rounded-full bg-primary/20 text-primary px-2 py-1">Coming in Phase 2</div>
          </div>
          <FakeChart />
          <div className="mt-3 text-xs text-muted-foreground">Illustrative chart · No live market data.</div>
        </Card>
        <ComingSoon title="Market Watch" description="Curated instruments and live quotes at a glance." icon={TrendingUp} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ComingSoon title="Trade Panel" description="Fast one-click order entry with risk controls." icon={Activity} />
        <ComingSoon title="Open Positions" description="Manage every open position across accounts." icon={Wallet2} />
        <ComingSoon title="Trade History" description="Complete audit trail of your trading activity." icon={History} />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ComingSoon title="Signals" description="Curated signal streams from the MiyaraTrader network." icon={Signal} />
        <ComingSoon title="Bot Trading" description="Deploy strategies that run 24/7 on your behalf." icon={Bot} />
        <ComingSoon title="Strategy Builder" description="Visually design and back-test your own strategies." icon={Wrench} />
      </div>
    </PageContainer>
  );
}

function FakeChart() {
  const pts = "0,140 40,130 80,120 120,135 160,110 200,95 240,105 280,80 320,88 360,60 400,70 440,45 480,55 520,30";
  return (
    <svg viewBox="0 0 520 200" className="mt-4 w-full h-56">
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke="var(--primary)" strokeWidth="2" />
      <polygon points={`${pts} 520,200 0,200`} fill="url(#tg)" />
    </svg>
  );
}
