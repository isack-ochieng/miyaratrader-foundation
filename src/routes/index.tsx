import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Zap, LineChart, Lock, Sparkles, Globe, BarChart3, Bot, Users, Wallet, GraduationCap, Copy, LayoutDashboard, HelpCircle, Mail, CheckCircle2 } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/Nav";
import { SiteFooter } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "MiyaraTrader — Cloud trading platform for the Deriv ecosystem" },
      { name: "description", content: "Register, connect your Deriv account, and access a modern trading workspace built for serious traders. Analytics, automation, and education — all in one platform." },
      { property: "og:title", content: "MiyaraTrader — Cloud trading platform for the Deriv ecosystem" },
      { property: "og:description", content: "A modern fintech workspace for traders on Deriv. Connect, analyze, and grow." },
    ],
  }),
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Hero />
      <Logos />
      <What />
      <Features />
      <Why />
      <Ecosystem />
      <Roadmap />
      <FAQSection />
      <Contact />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-hero">
      <div className="absolute inset-0 grid-fade opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Phase 1 — foundation of the MiyaraTrader ecosystem
        </div>
        <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto">
          Trade the <span className="text-gradient-emerald">Deriv ecosystem</span><br />with a modern workspace.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          MiyaraTrader is a cloud-based platform that connects to your Deriv account and gives you a clean,
          professional environment for analysis, automation, and growth.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-full h-12 px-6 glow-emerald">
            <Link to="/auth">Get started free <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-6">
            <a href="#features">Explore the platform</a>
          </Button>
        </div>
        <div className="mt-12 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-primary" /> Bank-grade security</span>
          <span className="flex items-center gap-1.5"><Lock className="h-4 w-4 text-primary" /> Encrypted keys</span>
          <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-primary" /> Low latency</span>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="mt-16 relative max-w-5xl mx-auto">
      <div className="glass rounded-2xl p-4 md:p-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-1.5 mb-4">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2 rounded-xl bg-card/60 border border-border/60 p-5 h-72 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-muted-foreground">EUR / USD</div>
                <div className="text-2xl font-semibold mt-1">1.0872 <span className="text-sm text-primary">+0.42%</span></div>
              </div>
              <div className="text-xs text-muted-foreground">Live</div>
            </div>
            <FakeChart />
          </div>
          <div className="grid gap-4">
            <StatCard label="Portfolio" value="$24,382" delta="+3.2%" />
            <StatCard label="Open positions" value="7" delta="2 profitable" />
            <StatCard label="Win rate" value="68%" delta="last 30d" />
          </div>
        </div>
      </div>
      <div className="absolute -inset-20 -z-10 opacity-30 blur-3xl" style={{ background: "var(--gradient-emerald)" }} />
    </div>
  );
}

function FakeChart() {
  const points = "0,140 40,130 80,120 120,135 160,110 200,95 240,105 280,80 320,88 360,60 400,70 440,45 480,55 520,30";
  return (
    <svg viewBox="0 0 520 200" className="mt-4 w-full h-48">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.72 0.16 160)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="oklch(0.72 0.16 160)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke="oklch(0.8 0.14 160)" strokeWidth="2" />
      <polygon points={`${points} 520,200 0,200`} fill="url(#g)" />
    </svg>
  );
}

function StatCard({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="rounded-xl bg-card/60 border border-border/60 p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold mt-1">{value}</div>
      <div className="text-xs text-primary mt-1">{delta}</div>
    </div>
  );
}

function Logos() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 opacity-70">
      <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-6">Powered by industry-leading infrastructure</p>
      <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 text-muted-foreground font-display text-lg">
        <span>Deriv API</span><span>·</span><span>PostgreSQL</span><span>·</span><span>Edge Functions</span><span>·</span><span>TanStack</span><span>·</span><span>OAuth 2.0</span>
      </div>
    </div>
  );
}

function What() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="text-xs uppercase tracking-widest text-primary mb-3">What is MiyaraTrader</div>
          <h2 className="text-4xl font-display font-bold">A serious workspace for serious traders.</h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            MiyaraTrader is an independent trading platform designed to sit on top of the Deriv ecosystem.
            It brings your account, analytics, and workflow into one refined interface — the way a professional
            trading desk should feel.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Unified dashboard for every Deriv account", "Fast, encrypted, and privacy-first", "Built to scale into a full fintech ecosystem"].map(t => (
              <li key={t} className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0" /> {t}</li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6 space-y-4">
          <StatRow icon={<LineChart className="h-4 w-4" />} label="Real-time market data" value="Streaming" />
          <StatRow icon={<Lock className="h-4 w-4" />} label="OAuth-based connection" value="Deriv official" />
          <StatRow icon={<Zap className="h-4 w-4" />} label="Latency" value="< 80 ms" />
          <StatRow icon={<Globe className="h-4 w-4" />} label="Global CDN" value="Edge-hosted" />
        </div>
      </div>
    </section>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border/60 last:border-0">
      <div className="flex items-center gap-3 text-sm">
        <span className="h-8 w-8 rounded-lg bg-primary/15 text-primary flex items-center justify-center">{icon}</span>
        {label}
      </div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

const featureItems = [
  { icon: LayoutDashboard, title: "Unified dashboard", body: "One place for balance, positions, and account health across every connected Deriv account." },
  { icon: LineChart, title: "Pro-grade charts", body: "Clean, low-latency charts with the tools traders actually use — not another cluttered terminal." },
  { icon: ShieldCheck, title: "Secure by default", body: "OAuth-based Deriv login, encrypted API tokens, RLS-protected data. No shortcuts." },
  { icon: BarChart3, title: "Performance analytics", body: "Track P&L, win rate, and drawdown over time. Understand what actually moves your account." },
  { icon: Bot, title: "Ready for automation", body: "Foundation built so bots, signals, and strategies plug in cleanly in Phase 2." },
  { icon: Sparkles, title: "Refined interface", body: "Minimal, calm, and fast — designed for long sessions, not dopamine hits." },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader eyebrow="Features" title="Everything you need to trade with clarity." />
      <div className="grid gap-4 md:grid-cols-3">
        {featureItems.map(({ icon: Icon, title, body }) => (
          <div key={title} className="group glass rounded-2xl p-6 hover:border-primary/40 transition">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary mb-4">
              <Icon className="h-5 w-5" />
            </span>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Why() {
  const rows = [
    { t: "Built for the Deriv ecosystem", d: "Deep, native integration — not a generic wrapper." },
    { t: "Cloud-first architecture", d: "Nothing to install. Access your workspace from any device, anywhere." },
    { t: "Designed like fintech should be", d: "Inspired by Bloomberg, Stripe, and Linear. No noise, no gimmicks." },
    { t: "Scalable foundation", d: "Ready to add automation, education, wallets, and mentorship as Phase 2 unfolds." },
  ];
  return (
    <section id="why" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeader eyebrow="Why MiyaraTrader" title="A platform that respects your time and your capital." />
      <div className="grid gap-4 md:grid-cols-2">
        {rows.map(r => (
          <div key={r.t} className="glass rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <div className="font-semibold">{r.t}</div>
                <div className="text-sm text-muted-foreground mt-1">{r.d}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Ecosystem() {
  const items = [
    { icon: LayoutDashboard, title: "Phase 1 — Trading Core", now: true, items: ["Auth & profiles", "Deriv connection", "Trading workspace", "Notifications"] },
    { icon: GraduationCap, title: "Education", now: false, items: ["Courses", "Mentorship", "Community rooms"] },
    { icon: Bot, title: "Automation", now: false, items: ["Trading bots", "Signals", "Strategy builder"] },
    { icon: Wallet, title: "Wallet & Payments", now: false, items: ["Deposits", "Withdrawals", "Multi-currency"] },
    { icon: Users, title: "Affiliate & Commissions", now: false, items: ["Referral tracking", "Payout engine"] },
    { icon: Copy, title: "Copy trading", now: false, items: ["Follow leaders", "Auto-mirror trades"] },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader eyebrow="The ecosystem" title="One roadmap. A full fintech stack." />
      <div className="grid gap-4 md:grid-cols-3">
        {items.map(({ icon: Icon, title, now, items: subs }) => (
          <div key={title} className={`rounded-2xl p-6 ${now ? "bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/30" : "glass"}`}>
            <div className="flex items-center justify-between">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${now ? "bg-primary text-primary-foreground" : "bg-primary/15 text-primary"}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className={`text-xs font-semibold rounded-full px-2 py-1 ${now ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {now ? "Live" : "Coming soon"}
              </span>
            </div>
            <h3 className="mt-4 font-semibold">{title}</h3>
            <ul className="mt-3 text-sm text-muted-foreground space-y-1.5">
              {subs.map(s => <li key={s}>• {s}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Roadmap() {
  const phases = [
    { p: "Phase 1", t: "Foundation", d: "Public site, auth, Deriv connection, dashboard, trading workspace shell.", live: true },
    { p: "Phase 2", t: "Automation & analytics", d: "Trading bots, signals, strategy builder, deeper analytics." },
    { p: "Phase 3", t: "Education & community", d: "Courses, mentorship, live rooms, community feeds." },
    { p: "Phase 4", t: "Wallet & commissions", d: "Multi-currency wallets, affiliate management, payout engine." },
    { p: "Phase 5", t: "White-label SaaS", d: "Mentor portals, branded workspaces, tenant management." },
  ];
  return (
    <section id="roadmap" className="mx-auto max-w-5xl px-6 py-24">
      <SectionHeader eyebrow="Roadmap" title="From foundation to full fintech ecosystem." />
      <div className="relative pl-6 md:pl-8">
        <div className="absolute left-2 md:left-3 top-0 bottom-0 w-px bg-border" />
        {phases.map(ph => (
          <div key={ph.p} className="relative mb-6">
            <div className={`absolute -left-[3px] md:-left-[1px] top-3 h-2.5 w-2.5 rounded-full ${ph.live ? "bg-primary shadow-[0_0_0_4px_oklch(0.72_0.16_160/0.2)]" : "bg-muted"}`} />
            <div className="ml-4 glass rounded-2xl p-5">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="text-xs uppercase tracking-widest text-primary">{ph.p}</span>
                <span className="font-semibold text-lg">{ph.t}</span>
                {ph.live && <span className="text-xs rounded-full bg-primary/20 text-primary px-2 py-0.5">Live</span>}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{ph.d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const faqs = [
    { q: "What is MiyaraTrader?", a: "A modern cloud-based trading platform built to work with your existing Deriv account, with a scalable foundation for future automation, education, and community features." },
    { q: "Do I need a Deriv account?", a: "Yes. MiyaraTrader connects to your Deriv account via official OAuth. You keep full control — we never see your Deriv password." },
    { q: "Is my data safe?", a: "All account data is stored encrypted, protected by row-level security, and only ever accessible to you. API tokens are stored server-side." },
    { q: "Is this a copy trading service?", a: "Not in Phase 1. Copy trading, signals, and mentor portals will arrive in later phases." },
    { q: "How much does it cost?", a: "Phase 1 is free while we roll out the foundation. Pricing for advanced features will be announced with Phase 2." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-24">
      <SectionHeader eyebrow="FAQ" title="Answers to common questions." />
      <Accordion type="single" collapsible className="glass rounded-2xl px-4">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`i${i}`} className="border-border/60">
            <AccordionTrigger className="text-left"><span className="flex items-center gap-3"><HelpCircle className="h-4 w-4 text-primary" />{f.q}</span></AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-24">
      <div className="glass rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-30" style={{ background: "var(--gradient-hero)" }} />
        <div className="text-xs uppercase tracking-widest text-primary mb-3">Get in touch</div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">Ready to trade with a serious platform?</h2>
        <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
          Create your account, connect your Deriv account, and step into the new MiyaraTrader workspace.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg" className="rounded-full h-12 px-6 glow-emerald">
            <Link to="/auth">Create free account <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-6">
            <a href="mailto:hello@miyaratrader.com"><Mail className="mr-2 h-4 w-4"/> Contact us</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl mb-10">
      <div className="text-xs uppercase tracking-widest text-primary mb-3">{eyebrow}</div>
      <h2 className="font-display text-3xl md:text-5xl font-bold">{title}</h2>
    </div>
  );
}
