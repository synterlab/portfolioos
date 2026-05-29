import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Terminal, Globe, Pencil, Zap, Github, Twitter } from "lucide-react";

function SinalyticaLogo({ size = 32 }: { size?: number }) {
  return (
    <img
      src="/sinalytica-logo.png"
      alt="Sinalytica"
      width={size}
      height={size}
      style={{ imageRendering: "pixelated" }}
    />
  );
}

function TerminalPreview() {
  return (
    <div
      style={{
        background: "#000",
        border: "2px solid #00ff41",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 0 40px rgba(0,255,65,0.15), 0 20px 60px rgba(0,0,0,0.8)",
        maxWidth: 580,
        margin: "0 auto",
        fontFamily: "'Share Tech Mono', 'Courier New', monospace",
      }}
    >
      {/* Terminal title bar */}
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ff5f57","#febc2e","#28c840"].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <span style={{ color: "#555", fontSize: 11, marginLeft: 8 }}>sinalytica.life — portfolio viewer</span>
      </div>
      {/* Terminal body */}
      <div style={{ padding: "18px 20px", minHeight: 240 }}>
        {[
          { delay: 0.1, color: "#00ff41", text: "$ whoami" },
          { delay: 0.3, color: "#e0e0e0", text: "  Your Name Here" },
          { delay: 0.4, color: "#555", text: "  Full-Stack Developer · Designer" },
          { delay: 0.6, color: "#00ff41", text: "$ ls skills/" },
          { delay: 0.8, color: "#00cc33", text: "  react/  typescript/  python/  design/" },
          { delay: 1.0, color: "#00ff41", text: "$ cat bio.txt" },
          { delay: 1.2, color: "#aaa", text: "  Building products at the intersection" },
          { delay: 1.3, color: "#aaa", text: "  of design and engineering." },
          { delay: 1.5, color: "#00ff41", text: "$ ls projects/" },
          { delay: 1.7, color: "#00cc33", text: "  sinalytica/  portfolio-os/  devtools/" },
          { delay: 1.9, color: "#00ff41", text: "$ █" },
        ].map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: line.delay, duration: 0.2 }}
            style={{ color: line.color, fontSize: 13, lineHeight: 1.7, display: "block" }}
          >
            {line.text}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#000", color: "#e0e0e0", fontFamily: "system-ui, sans-serif" }}>

      {/* Nav */}
      <header style={{ borderBottom: "1px solid #111", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(8px)", zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <SinalyticaLogo size={28} />
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.3px", color: "#fff" }}>sinalytica.life</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/sign-in">
            <button style={{ background: "transparent", border: "none", color: "#666", fontSize: 13, cursor: "pointer", padding: "6px 12px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "#666")}
            >
              Sign In
            </button>
          </Link>
          <Link href="/sign-up">
            <button
              style={{ background: "#00ff41", color: "#000", border: "none", borderRadius: 6, padding: "7px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", letterSpacing: "0.3px" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#00cc33")}
              onMouseLeave={e => (e.currentTarget.style.background = "#00ff41")}
            >
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px 60px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ maxWidth: 720, margin: "0 auto" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, border: "1px solid #1a2e1a", borderRadius: 99, padding: "4px 12px", fontSize: 11, color: "#00ff41", background: "rgba(0,255,65,0.05)", marginBottom: 28, letterSpacing: "1px", fontFamily: "monospace" }}
          >
            <span style={{ width: 6, height: 6, background: "#00ff41", borderRadius: "50%", display: "inline-block" }} />
            TERMINAL PORTFOLIO BUILDER
          </motion.div>

          {/* Headline */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <SinalyticaLogo size={72} />
            <h1 style={{ fontSize: "clamp(36px, 7vw, 72px)", fontWeight: 900, lineHeight: 1.05, margin: "20px 0 0", color: "#fff", letterSpacing: "-2px" }}>
              Your career as a<br />
              <span style={{ color: "#00ff41" }}>terminal experience</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
            style={{ fontSize: 17, color: "#666", maxWidth: 520, margin: "20px auto 36px", lineHeight: 1.65 }}
          >
            Build your developer portfolio in minutes. Visitors experience it through a
            retro CRT terminal — boot screen, 3D desk, and a Windows 95 interface.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
          >
            <Link href="/sign-up" data-testid="link-cta-primary">
              <button
                style={{ background: "#00ff41", color: "#000", border: "none", borderRadius: 8, padding: "13px 28px", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, letterSpacing: "0.3px" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#00cc33")}
                onMouseLeave={e => (e.currentTarget.style.background = "#00ff41")}
              >
                Create Your Portfolio <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/p/demo" data-testid="link-demo">
              <button
                style={{ background: "transparent", color: "#e0e0e0", border: "1px solid #222", borderRadius: 8, padding: "13px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                onMouseEnter={e => { (e.currentTarget.style.borderColor = "#00ff41"); (e.currentTarget.style.color = "#00ff41"); }}
                onMouseLeave={e => { (e.currentTarget.style.borderColor = "#222"); (e.currentTarget.style.color = "#e0e0e0"); }}
              >
                View Demo
              </button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Terminal Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ marginTop: 64, width: "100%", maxWidth: 600 }}
        >
          <TerminalPreview />
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ borderTop: "1px solid #111", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: "center", marginBottom: 56 }}
          >
            <p style={{ color: "#00ff41", fontFamily: "monospace", fontSize: 11, letterSpacing: "3px", marginBottom: 12 }}>$ cat HOW_IT_WORKS.md</p>
            <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>Simple. Unique. Unforgettable.</h2>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
            {[
              { icon: Pencil, cmd: "$ build", title: "Build in minutes", desc: "Sign up, fill your profile, add experience, education, and projects through a clean dashboard." },
              { icon: Globe, cmd: "$ share", title: "Share anywhere", desc: "Your portfolio lives at sinalytica.life/p/username — share it on LinkedIn, emails, or your resume." },
              { icon: Terminal, cmd: "$ experience", title: "An experience, not a page", desc: "Visitors boot up a retro OS, walk through a 3D desk, and explore your life through a terminal interface." },
            ].map(({ icon: Icon, cmd, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 12, padding: 24 }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "#00ff41")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "#1a1a1a")}
              >
                <p style={{ color: "#00ff41", fontFamily: "monospace", fontSize: 11, marginBottom: 12 }}>{cmd}</p>
                <div style={{ width: 36, height: 36, background: "rgba(0,255,65,0.08)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <Icon size={16} color="#00ff41" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: "#fff", marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65 }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ borderTop: "1px solid #111", borderBottom: "1px solid #111", padding: "32px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", justifyContent: "center", gap: "clamp(32px, 8vw, 80px)", flexWrap: "wrap" }}>
          {[
            { val: "< 5min", label: "to go live" },
            { val: "∞", label: "portfolio entries" },
            { val: "100%", label: "free to start" },
          ].map(({ val, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "#00ff41", fontFamily: "monospace" }}>{val}</div>
              <div style={{ fontSize: 12, color: "#444", marginTop: 4, letterSpacing: "1px" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: 520, margin: "0 auto" }}
        >
          <SinalyticaLogo size={48} />
          <h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, color: "#fff", marginTop: 20, marginBottom: 12, letterSpacing: "-1px" }}>Ready to be remembered?</h2>
          <p style={{ color: "#555", marginBottom: 32, fontSize: 15 }}>Create your terminal portfolio today. Free to start, no credit card required.</p>
          <Link href="/sign-up" data-testid="link-cta-bottom">
            <button
              style={{ background: "#00ff41", color: "#000", border: "none", borderRadius: 8, padding: "14px 36px", fontSize: 15, fontWeight: 800, cursor: "pointer", letterSpacing: "0.3px" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#00cc33")}
              onMouseLeave={e => (e.currentTarget.style.background = "#00ff41")}
            >
              Create Portfolio — It's Free
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #111", padding: "40px 24px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 40 }}>
            {/* Brand */}
            <div style={{ maxWidth: 240 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <SinalyticaLogo size={28} />
                <span style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>sinalytica.life</span>
              </div>
              <p style={{ fontSize: 12, color: "#444", lineHeight: 1.65 }}>
                Build and share your developer portfolio with a retro terminal experience.
              </p>
            </div>

            {/* Links */}
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              <div>
                <p style={{ fontSize: 11, color: "#00ff41", fontFamily: "monospace", letterSpacing: "2px", marginBottom: 14 }}>PRODUCT</p>
                {[
                  { label: "Create Portfolio", href: "/sign-up" },
                  { label: "Sign In", href: "/sign-in" },
                  { label: "View Demo", href: "/p/demo" },
                ].map(({ label, href }) => (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <Link href={href}>
                      <a style={{ fontSize: 13, color: "#555", textDecoration: "none" }}
                        onMouseEnter={e => ((e.target as HTMLElement).style.color = "#fff")}
                        onMouseLeave={e => ((e.target as HTMLElement).style.color = "#555")}
                      >{label}</a>
                    </Link>
                  </div>
                ))}
              </div>
              <div>
                <p style={{ fontSize: 11, color: "#00ff41", fontFamily: "monospace", letterSpacing: "2px", marginBottom: 14 }}>COMPANY</p>
                {[
                  { label: "About", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                ].map(({ label, href }) => (
                  <div key={label} style={{ marginBottom: 10 }}>
                    <a href={href} style={{ fontSize: 13, color: "#555", textDecoration: "none" }}
                      onMouseEnter={e => ((e.target as HTMLElement).style.color = "#fff")}
                      onMouseLeave={e => ((e.target as HTMLElement).style.color = "#555")}
                    >{label}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: "1px solid #111", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ fontSize: 12, color: "#333" }}>© 2026 sinalytica.life — All rights reserved</p>
            <div style={{ display: "flex", gap: 16 }}>
              <a href="https://github.com/synterlab" target="_blank" rel="noreferrer" style={{ color: "#444" }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = "#00ff41")}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = "#444")}
              ><Github size={16} /></a>
              <a href="https://x.com/synterlab" target="_blank" rel="noreferrer" style={{ color: "#444" }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = "#00ff41")}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = "#444")}
              ><Twitter size={16} /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
