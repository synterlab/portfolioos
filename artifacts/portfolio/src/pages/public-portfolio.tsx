import { useState } from "react";
import { useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetPublicPortfolio, getGetPublicPortfolioQueryKey } from "@workspace/api-client-react";
import { Github, Linkedin, Twitter, Globe, Mail, MapPin, ExternalLink } from "lucide-react";

// ─── CRT Boot Screen ─────────────────────────────────────────────────────────
function BootScreen({ name, onDone }: { name: string; onDone: () => void }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
    setTimeout(onDone, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={!clicked ? handleClick : undefined}
      className="fixed inset-0 bg-black flex flex-col items-center justify-center cursor-pointer select-none"
      data-testid="screen-boot"
    >
      <div className="font-mono text-left w-full max-w-lg px-8 space-y-1">
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-white/80 text-sm"
        >
          sinalytica.life — Personal Experience Viewer
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-yellow-400 text-sm"
        >
          WARNING: This experience is best viewed on a desktop computer.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
          className="text-white/60 text-xs mt-4"
        >
          Loading profile: <span className="text-green-400">{name}</span>
        </motion.p>
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="mt-16 border border-white/30 px-8 py-3 font-mono text-white/90 text-sm"
      >
        {clicked ? "Booting..." : "Click anywhere to begin _"}
      </motion.div>
    </motion.div>
  );
}

// ─── 3D Desk Scene ───────────────────────────────────────────────────────────
function DeskScene({ name, onOpen }: { name: string; onOpen: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#c8c8c8] flex flex-col items-center justify-center overflow-hidden"
      data-testid="screen-desk"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#d8d8d8] to-[#b8b8b8]" />

      {/* Desk + Monitor (CSS 3D) */}
      <div className="relative z-10" style={{ perspective: "800px" }}>
        <motion.div
          initial={{ rotateX: 5, y: 40, opacity: 0 }}
          animate={{ rotateX: 0, y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Desk surface */}
          <div
            className="relative mx-auto"
            style={{
              width: 480,
              height: 300,
              background: "linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 50%, #2a2a2a 100%)",
              borderRadius: "4px 4px 0 0",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Monitor */}
            <div
              className="absolute cursor-pointer transition-transform duration-300"
              style={{ top: 20, left: "50%", transform: `translateX(-50%) ${hovered ? "scale(1.02)" : ""}` }}
              onClick={onOpen}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              data-testid="button-open-monitor"
            >
              {/* Monitor bezel */}
              <div
                style={{
                  width: 280,
                  height: 200,
                  background: "#d0d0d0",
                  borderRadius: "8px 8px 4px 4px",
                  padding: "8px",
                  boxShadow: "4px 4px 0 #999, -2px -2px 0 #fff, 0 0 0 1px #bbb",
                }}
              >
                {/* CRT Screen */}
                <div
                  className="crt-screen"
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "#001a00",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 8,
                    border: "3px inset #888",
                  }}
                >
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.4 }}
                    className="text-green-400 font-mono text-xs text-center px-3"
                  >
                    {name}
                  </motion.div>
                  <div className="text-green-400/50 font-mono text-[9px]">Click to open portfolio</div>
                </div>
              </div>
              {/* Monitor neck */}
              <div style={{ width: 40, height: 16, background: "#c0c0c0", margin: "0 auto", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)" }} />
              {/* Monitor base */}
              <div style={{ width: 100, height: 10, background: "#c0c0c0", margin: "0 auto", borderRadius: "0 0 4px 4px", boxShadow: "0 2px 4px rgba(0,0,0,0.3)" }} />
            </div>

            {/* Keyboard */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                width: 220,
                height: 60,
                background: "#d4d4d4",
                borderRadius: "4px",
                boxShadow: "2px 2px 0 #aaa, inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              {[0, 1, 2].map((row) => (
                <div key={row} className="flex justify-center gap-[2px]" style={{ marginTop: row === 0 ? 6 : 4 }}>
                  {Array.from({ length: row === 0 ? 12 : row === 1 ? 11 : 10 }).map((_, i) => (
                    <div key={i} style={{ width: 14, height: 10, background: "#e8e8e8", borderRadius: 2, boxShadow: "0 1px 0 #bbb" }} />
                  ))}
                </div>
              ))}
            </div>

            {/* Mouse */}
            <div
              style={{
                position: "absolute",
                bottom: 32,
                right: 60,
                width: 28,
                height: 40,
                background: "#d4d4d4",
                borderRadius: "14px 14px 8px 8px",
                boxShadow: "2px 2px 0 #aaa",
              }}
            >
              <div style={{ width: 1, height: 16, background: "#bbb", margin: "8px auto 0" }} />
            </div>

            {/* Plant */}
            <div style={{ position: "absolute", top: 20, right: 20 }}>
              <div style={{ width: 20, height: 30, background: "#228B22", borderRadius: "50%", position: "relative" }}>
                <div style={{ width: 14, height: 22, background: "#2d9e2d", borderRadius: "50%", position: "absolute", top: -8, left: 3 }} />
              </div>
              <div style={{ width: 24, height: 12, background: "#8B6914", borderRadius: "2px 2px 4px 4px", margin: "0 auto" }} />
            </div>

            {/* Coffee cup */}
            <div style={{ position: "absolute", top: 24, left: 40 }}>
              <div style={{ width: 18, height: 20, background: "#fff", borderRadius: "2px 2px 4px 4px", border: "1px solid #ddd" }}>
                <div style={{ width: "100%", height: 6, background: "#6B4423", borderRadius: "1px 1px 0 0" }} />
              </div>
            </div>
          </div>

          {/* Desk legs */}
          {[20, 440].map((x) => (
            <div key={x} style={{ position: "absolute", top: 300, left: x, width: 20, height: 40, background: "#555", borderRadius: "0 0 4px 4px" }} />
          ))}
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-12 font-mono text-sm bg-black text-white px-4 py-1.5 z-10"
        data-testid="text-desk-hint"
      >
        Click the monitor to open portfolio _
      </motion.p>
    </motion.div>
  );
}

// ─── Win95 Portfolio OS ──────────────────────────────────────────────────────
type Tab = "about" | "experience" | "education" | "projects" | "contact";

function Win95Portfolio({ portfolio }: { portfolio: any }) {
  const [tab, setTab] = useState<Tab>("about");
  const items: any[] = portfolio.items ?? [];

  const experience = items.filter((i) => i.type === "experience");
  const education = items.filter((i) => i.type === "education");
  const projects = items.filter((i) => i.type === "project");

  const tabs: { id: Tab; label: string }[] = [
    { id: "about", label: "About" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-[#008080] flex items-center justify-center p-4 overflow-auto"
      data-testid="screen-portfolio"
    >
      {/* Monitor outer */}
      <div
        style={{
          width: "min(820px, 100%)",
          background: "#c0c0c0",
          borderRadius: "16px 16px 8px 8px",
          boxShadow: "6px 6px 0 #808080, -3px -3px 0 #ffffff, 0 0 0 2px #a0a0a0, 0 30px 60px rgba(0,0,0,0.5)",
          padding: "16px 16px 32px",
          position: "relative",
        }}
      >
        {/* Monitor screen area */}
        <div
          className="crt-screen"
          style={{
            background: "#000",
            borderRadius: "8px",
            border: "4px inset #808080",
            overflow: "hidden",
            minHeight: "540px",
          }}
        >
          {/* Desktop background */}
          <div style={{ background: "#008080", minHeight: "100%", display: "flex", flexDirection: "column" }}>

            {/* Window */}
            <div
              style={{
                background: "#c0c0c0",
                margin: "16px",
                border: "2px solid",
                borderColor: "#ffffff #808080 #808080 #ffffff",
                boxShadow: "1px 1px 0 #000",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Title bar */}
              <div
                style={{
                  background: "linear-gradient(to right, #000080, #1084d0)",
                  padding: "2px 4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div className="flex items-center gap-1">
                  <div style={{ width: 12, height: 12, background: "#c0c0c0", border: "1px solid #808080" }} />
                  <span style={{ color: "white", fontFamily: "monospace", fontSize: 11, fontWeight: "bold" }}>
                    {portfolio.displayName} — Portfolio Showcase 2026
                  </span>
                </div>
                <div className="flex gap-0.5">
                  {["_", "□", "×"].map((ch) => (
                    <div key={ch} style={{ width: 16, height: 14, background: "#c0c0c0", border: "1px solid", borderColor: "#ffffff #808080 #808080 #ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: "bold", cursor: "pointer" }}>
                      {ch}
                    </div>
                  ))}
                </div>
              </div>

              {/* Menu bar */}
              <div style={{ borderBottom: "1px solid #808080", padding: "1px 4px", background: "#c0c0c0", display: "flex", gap: 12 }}>
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    data-testid={`tab-${t.id}`}
                    style={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      padding: "1px 6px",
                      background: tab === t.id ? "#000080" : "transparent",
                      color: tab === t.id ? "white" : "#000",
                      border: tab === t.id ? "1px inset #808080" : "1px solid transparent",
                      cursor: "pointer",
                      textDecoration: tab !== t.id ? "underline" : "none",
                      textDecorationStyle: "dashed",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div style={{ flex: 1, overflow: "auto", padding: 12, background: "white", fontFamily: "monospace" }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {tab === "about" && (
                      <div className="space-y-4">
                        <div style={{ border: "2px inset #808080", padding: 12, background: "#f0f0f0" }}>
                          <div className="flex gap-4 items-start">
                            {portfolio.avatarUrl ? (
                              <img src={portfolio.avatarUrl} alt="" style={{ width: 64, height: 64, border: "2px inset #808080", objectFit: "cover" }} />
                            ) : (
                              <div style={{ width: 64, height: 64, background: "#c0c0c0", border: "2px inset #808080", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                                {portfolio.displayName.charAt(0)}
                              </div>
                            )}
                            <div>
                              <h1 style={{ fontSize: 20, fontWeight: "bold", fontFamily: "Georgia, serif" }}>{portfolio.displayName}</h1>
                              {portfolio.tagline && <p style={{ fontSize: 12, color: "#333", marginTop: 2 }}>{portfolio.tagline}</p>}
                              {portfolio.location && <p style={{ fontSize: 11, color: "#666", marginTop: 4 }}>📍 {portfolio.location}</p>}
                            </div>
                          </div>
                        </div>
                        {portfolio.bio && (
                          <div style={{ border: "2px inset #808080", padding: 12, background: "#f8f8f8" }}>
                            <p style={{ fontSize: 11, fontFamily: "Georgia, serif", lineHeight: 1.6, color: "#222" }}>{portfolio.bio}</p>
                          </div>
                        )}
                        {portfolio.skills?.length > 0 && (
                          <div>
                            <p style={{ fontSize: 11, fontWeight: "bold", marginBottom: 6 }}>Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {portfolio.skills.map((s: string) => (
                                <span key={s} style={{ background: "#000080", color: "white", fontSize: 10, padding: "1px 6px", fontFamily: "monospace" }}>{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* For Hire badge */}
                        <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                          <button
                            data-testid="badge-for-hire"
                            style={{
                              background: "#cc0000",
                              color: "white",
                              fontFamily: "monospace",
                              fontWeight: "bold",
                              fontSize: 11,
                              padding: "4px 16px",
                              border: "2px solid",
                              borderColor: "#ff4444 #880000 #880000 #ff4444",
                              cursor: "pointer",
                            }}
                            onClick={() => setTab("contact")}
                          >
                            FOR HIRE — Contact Me
                          </button>
                        </div>
                      </div>
                    )}

                    {tab === "experience" && (
                      <div className="space-y-3">
                        {experience.length === 0 ? (
                          <p style={{ fontSize: 11, color: "#666" }}>No experience entries yet.</p>
                        ) : experience.map((item) => (
                          <div key={item.id} style={{ border: "2px inset #808080", padding: 10, background: "#f8f8f8" }}>
                            <p style={{ fontWeight: "bold", fontSize: 12 }}>{item.title}</p>
                            {item.subtitle && <p style={{ fontSize: 11, color: "#000080" }}>{item.subtitle}</p>}
                            {(item.startDate || item.endDate) && (
                              <p style={{ fontSize: 10, color: "#666", marginTop: 2 }}>
                                {item.startDate}{item.startDate ? " – " : ""}{item.isCurrent ? "Present" : item.endDate}
                              </p>
                            )}
                            {item.description && <p style={{ fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>{item.description}</p>}
                            {item.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.map((t: string) => (
                                  <span key={t} style={{ background: "#e0e0e0", fontSize: 9, padding: "1px 4px", border: "1px solid #aaa" }}>{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {tab === "education" && (
                      <div className="space-y-3">
                        {education.length === 0 ? (
                          <p style={{ fontSize: 11, color: "#666" }}>No education entries yet.</p>
                        ) : education.map((item) => (
                          <div key={item.id} style={{ border: "2px inset #808080", padding: 10, background: "#f8f8f8" }}>
                            <p style={{ fontWeight: "bold", fontSize: 12 }}>{item.title}</p>
                            {item.subtitle && <p style={{ fontSize: 11, color: "#000080" }}>{item.subtitle}</p>}
                            {(item.startDate || item.endDate) && (
                              <p style={{ fontSize: 10, color: "#666", marginTop: 2 }}>
                                {item.startDate}{item.startDate ? " – " : ""}{item.isCurrent ? "Present" : item.endDate}
                              </p>
                            )}
                            {item.description && <p style={{ fontSize: 11, marginTop: 6, lineHeight: 1.5 }}>{item.description}</p>}
                          </div>
                        ))}
                      </div>
                    )}

                    {tab === "projects" && (
                      <div className="space-y-3">
                        {projects.length === 0 ? (
                          <p style={{ fontSize: 11, color: "#666" }}>No projects yet.</p>
                        ) : projects.map((item) => (
                          <div key={item.id} style={{ border: "2px inset #808080", padding: 10, background: "#f8f8f8" }}>
                            <div className="flex items-center justify-between">
                              <p style={{ fontWeight: "bold", fontSize: 12 }}>{item.title}</p>
                              {item.url && (
                                <a href={item.url} target="_blank" rel="noreferrer" data-testid={`link-project-${item.id}`}
                                  style={{ fontSize: 10, color: "#000080", textDecoration: "underline" }}>
                                  Open ↗
                                </a>
                              )}
                            </div>
                            {item.description && <p style={{ fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>{item.description}</p>}
                            {item.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.tags.map((t: string) => (
                                  <span key={t} style={{ background: "#000080", color: "white", fontSize: 9, padding: "1px 4px" }}>{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {tab === "contact" && (
                      <div className="space-y-3">
                        <div style={{ border: "2px inset #808080", padding: 12, background: "#f0f0f0" }}>
                          <p style={{ fontSize: 12, fontWeight: "bold", marginBottom: 10 }}>Get in touch</p>
                          <div className="space-y-2">
                            {portfolio.email && (
                              <a href={`mailto:${portfolio.email}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#000080", textDecoration: "underline" }}>
                                ✉ {portfolio.email}
                              </a>
                            )}
                            {portfolio.socialLinks?.github && (
                              <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#000080", textDecoration: "underline" }}>
                                ◆ GitHub
                              </a>
                            )}
                            {portfolio.socialLinks?.linkedin && (
                              <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#000080", textDecoration: "underline" }}>
                                ◆ LinkedIn
                              </a>
                            )}
                            {portfolio.socialLinks?.twitter && (
                              <a href={portfolio.socialLinks.twitter} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#000080", textDecoration: "underline" }}>
                                ◆ Twitter / X
                              </a>
                            )}
                            {portfolio.socialLinks?.website && (
                              <a href={portfolio.socialLinks.website} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#000080", textDecoration: "underline" }}>
                                ◆ Website
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Status bar */}
              <div style={{ borderTop: "2px solid", borderColor: "#808080 #ffffff #ffffff #808080", padding: "2px 8px", display: "flex", gap: 12 }}>
                <div style={{ border: "1px inset #808080", padding: "0 8px", fontSize: 10, fontFamily: "monospace", color: "#000" }}>
                  {portfolio.username}
                </div>
                <div style={{ border: "1px inset #808080", padding: "0 8px", fontSize: 10, fontFamily: "monospace", color: "#000" }}>
                  {(portfolio.items ?? []).length} items
                </div>
                <div style={{ border: "1px inset #808080", padding: "0 8px", fontSize: 10, fontFamily: "monospace", color: "#000", marginLeft: "auto" }}>
                  sinalytica.life 2026
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monitor bezel bottom */}
        <div style={{ height: 8, background: "#d0d0d0" }} />
        {/* Monitor neck */}
        <div style={{ width: 60, height: 16, background: "#c0c0c0", margin: "0 auto", boxShadow: "inset 0 2px 6px rgba(0,0,0,0.2)" }} />
        {/* Monitor base */}
        <div style={{ width: 180, height: 12, background: "#c0c0c0", margin: "0 auto", borderRadius: "0 0 6px 6px", boxShadow: "0 4px 8px rgba(0,0,0,0.3)" }} />
      </div>
    </motion.div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────
type Stage = "boot" | "desk" | "portfolio";

export default function PublicPortfolio() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const [stage, setStage] = useState<Stage>("boot");

  const { data: portfolio, isLoading, error } = useGetPublicPortfolio(username, {
    query: { enabled: !!username, queryKey: getGetPublicPortfolioQueryKey(username) },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-green-400 font-mono text-sm">
          Loading...
        </motion.div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 font-mono">
        <div className="text-red-500 text-sm">ERROR: PROFILE_NOT_FOUND</div>
        <div className="text-white/30 text-xs">The portfolio you requested does not exist or is private.</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0">
      <AnimatePresence>
        {stage === "boot" && (
          <BootScreen key="boot" name={portfolio.displayName} onDone={() => setStage("desk")} />
        )}
        {stage === "desk" && (
          <DeskScene key="desk" name={portfolio.displayName} onOpen={() => setStage("portfolio")} />
        )}
        {stage === "portfolio" && (
          <Win95Portfolio key="portfolio" portfolio={portfolio} />
        )}
      </AnimatePresence>
    </div>
  );
}
