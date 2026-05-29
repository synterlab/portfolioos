import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Monitor, ArrowRight, Zap, Globe, Pencil } from "lucide-react";

function RetroMonitorPreview() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 560,
        background: "#c0c0c0",
        borderRadius: "16px 16px 8px 8px",
        padding: "12px 12px 24px",
        boxShadow: "6px 6px 0 #555, -3px -3px 0 #eee, 0 0 0 2px #999, 0 40px 80px rgba(0,0,0,0.6)",
        margin: "0 auto",
      }}
    >
      <div
        className="crt-screen"
        style={{
          background: "#001a00",
          borderRadius: "6px",
          border: "4px inset #808080",
          height: 320,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Fake Win95 window */}
        <div style={{ background: "#008080", flex: 1, display: "flex", flexDirection: "column", padding: 12 }}>
          <div style={{ background: "#c0c0c0", border: "2px solid", borderColor: "#fff #808080 #808080 #fff", flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ background: "linear-gradient(to right, #000080, #1084d0)", padding: "2px 6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "white", fontFamily: "monospace", fontSize: 10, fontWeight: "bold" }}>Your Portfolio — sinalytica.life 2026</span>
              <div className="flex gap-0.5">
                {["_", "□", "×"].map((c) => <div key={c} style={{ width: 14, height: 12, background: "#c0c0c0", border: "1px solid", borderColor: "#fff #808080 #808080 #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>{c}</div>)}
              </div>
            </div>
            <div style={{ padding: 8, display: "flex", gap: 12, borderBottom: "1px solid #aaa" }}>
              {["About", "Experience", "Projects", "Contact"].map((t) => (
                <span key={t} style={{ fontFamily: "monospace", fontSize: 10, cursor: "pointer", textDecoration: "underline", textDecorationStyle: "dashed" }}>{t}</span>
              ))}
            </div>
            <div style={{ flex: 1, background: "white", padding: 10 }}>
              <div style={{ border: "2px inset #808080", padding: 8, background: "#f0f0f0", fontFamily: "Georgia, serif" }}>
                <div style={{ fontSize: 18, fontWeight: "bold" }}>Your Name Here</div>
                <div style={{ fontSize: 10, color: "#333", marginTop: 2, fontFamily: "monospace" }}>Software Engineer · Designer · Entrepreneur</div>
                <div style={{ marginTop: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {["React", "TypeScript", "Python", "ML"].map((s) => (
                    <span key={s} style={{ background: "#000080", color: "white", fontSize: 8, padding: "1px 4px", fontFamily: "monospace" }}>{s}</span>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 8, display: "flex", justifyContent: "center" }}>
                <div style={{ background: "#cc0000", color: "white", fontFamily: "monospace", fontWeight: "bold", fontSize: 9, padding: "3px 12px", border: "1px solid", borderColor: "#ff4444 #880000 #880000 #ff4444" }}>
                  FOR HIRE — Contact Me
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ width: 40, height: 12, background: "#c0c0c0", margin: "0 auto" }} />
      <div style={{ width: 120, height: 10, background: "#c0c0c0", margin: "0 auto", borderRadius: "0 0 4px 4px" }} />
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Nav */}
      <header className="border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2 font-bold text-base tracking-tight">
          <Monitor size={18} className="text-primary" />
          sinalytica.life
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/sign-in" data-testid="link-sign-in">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/sign-up" data-testid="link-sign-up">Get Started</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 text-xs text-muted-foreground mb-8">
            <Zap size={10} />
            Portfolio experience from 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Your career as a<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">cinematic experience</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Create your portfolio in minutes. Visitors experience it through a 1990s retro computer — boot screen, 3D desk, and a Windows 95 interface. Unforgettable.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="px-8 gap-2" asChild>
              <Link href="/sign-up" data-testid="link-cta-primary">
                Create Portfolio <ArrowRight size={16} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8" asChild>
              <Link href="/p/demo" data-testid="link-demo">View Demo</Link>
            </Button>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 w-full max-w-2xl"
        >
          <RetroMonitorPreview />
        </motion.div>
      </section>

      {/* Features */}
      <section className="border-t border-white/10 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Pencil, title: "Build in minutes", desc: "Sign up, add your experience, education, and projects through a clean dashboard." },
              { icon: Globe, title: "Share anywhere", desc: "Your portfolio lives at /p/yourname — share it on LinkedIn, in emails, or your resume." },
              { icon: Monitor, title: "An experience, not a page", desc: "Visitors boot up a retro OS, explore a 3D desk, and discover your life through a vintage computer interface." },
            ].map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <Icon size={15} />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10 py-24 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to be remembered?</h2>
          <p className="text-muted-foreground mb-8">Join and create your cinematic portfolio in minutes. Free to start.</p>
          <Button size="lg" className="px-10 gap-2" asChild>
            <Link href="/sign-up" data-testid="link-cta-bottom">
              Create Portfolio <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-6 text-center text-xs text-muted-foreground">
        sinalytica.life — Built on Replit
      </footer>
    </div>
  );
}
