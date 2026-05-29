import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "story" | "boot" | "enter";

const STORY_LINES = [
  { text: "> another job application sent...", delay: 400, color: "#555" },
  { text: "> another generic PDF... ignored.", delay: 1100, color: "#555" },
  { text: "> lost in a pile of resumes.", delay: 1800, color: "#555" },
  { text: "", delay: 2400, color: "#000" },
  { text: "> you have skills. real ones.", delay: 2700, color: "#888" },
  { text: "> but no one stops to look.", delay: 3300, color: "#888" },
  { text: "", delay: 3800, color: "#000" },
  { text: "> what if your portfolio had a boot screen?", delay: 4200, color: "#00cc33" },
  { text: "> what if your career was an OS?", delay: 5000, color: "#00cc33" },
  { text: "> what if your story was unforgettable?", delay: 5700, color: "#00ff41" },
  { text: "", delay: 6300, color: "#000" },
  { text: "> sinalytica.life", delay: 6700, color: "#00ff41" },
  { text: "> your career. your terminal. your story.", delay: 7400, color: "#fff" },
];

const BOOT_LINES = [
  { text: "SINALYTICA OS v2.6  initializing...", delay: 0, color: "#00ff41" },
  { text: "[  OK  ] Mounted portfolio volumes", delay: 350, color: "#00cc33" },
  { text: "[  OK  ] Network interface: sinalytica.life", delay: 650, color: "#00cc33" },
  { text: "[  OK  ] Experience renderer ready", delay: 950, color: "#00cc33" },
  { text: "[  OK  ] Story engine loaded", delay: 1200, color: "#00cc33" },
  { text: "", delay: 1450, color: "#000" },
  { text: "System ready.", delay: 1650, color: "#fff" },
];

const STORY_DONE_AT = 8400;
const BOOT_DONE_AT = STORY_DONE_AT + 2500;
const ENTER_SHOWN_AT = BOOT_DONE_AT + 400;

export default function DemoIntro() {
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<Phase>("story");
  const [visibleStory, setVisibleStory] = useState<number[]>([]);
  const [visibleBoot, setVisibleBoot] = useState<number[]>([]);
  const [showEnter, setShowEnter] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    STORY_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleStory((p) => [...p, i]), line.delay);
    });
    setTimeout(() => setPhase("boot"), STORY_DONE_AT);
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleBoot((p) => [...p, i]), STORY_DONE_AT + line.delay);
    });
    setTimeout(() => setPhase("enter"), BOOT_DONE_AT);
    setTimeout(() => setShowEnter(true), ENTER_SHOWN_AT);

    const cursorInterval = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(cursorInterval);
  }, []);

  function handleEnter() {
    if (!showEnter) return;
    setExiting(true);
    setTimeout(() => setLocation("/home"), 800);
  }

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="intro"
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.8 }}
          onClick={handleEnter}
          style={{
            minHeight: "100vh",
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: showEnter ? "pointer" : "default",
            fontFamily: "'Share Tech Mono', 'Courier New', monospace",
            padding: "40px 20px",
            userSelect: "none",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Scanline overlay */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
              pointerEvents: "none",
              zIndex: 10,
            }}
          />

          {/* Ambient glow */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,255,65,0.04) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ width: "100%", maxWidth: 560, position: "relative", zIndex: 1 }}>
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 36 }}
            >
              <img
                src="/sinalytica-logo.png"
                alt="Sinalytica"
                width={36}
                height={36}
                style={{ imageRendering: "pixelated" }}
              />
              <span style={{ color: "#00ff41", fontSize: 12, letterSpacing: "4px" }}>
                SINALYTICA.LIFE
              </span>
            </motion.div>

            {/* Story phase */}
            <AnimatePresence>
              {(phase === "story" || phase === "boot" || phase === "enter") && (
                <motion.div
                  key="story"
                  style={{ marginBottom: 32 }}
                >
                  {STORY_LINES.map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: visibleStory.includes(i) ? 1 : 0, x: visibleStory.includes(i) ? 0 : -4 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        color: line.color,
                        fontSize: 14,
                        lineHeight: 2,
                        minHeight: line.text ? undefined : 8,
                      }}
                    >
                      {line.text}
                      {i === STORY_LINES.length - 1 && visibleStory.includes(i) && phase === "story" && (
                        <span style={{ color: "#00ff41", opacity: cursor ? 1 : 0 }}>_</span>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Boot phase */}
            <AnimatePresence>
              {(phase === "boot" || phase === "enter") && (
                <motion.div
                  key="boot"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    background: "#050505",
                    border: "1px solid #1a1a1a",
                    borderRadius: 8,
                    overflow: "hidden",
                    boxShadow: "0 0 40px rgba(0,255,65,0.07)",
                  }}
                >
                  {/* Terminal bar */}
                  <div style={{ background: "#0a0a0a", borderBottom: "1px solid #111", padding: "7px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                        <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                      ))}
                    </div>
                    <span style={{ color: "#333", fontSize: 10, marginLeft: 6, letterSpacing: "0.5px" }}>
                      sinalytica -- system boot
                    </span>
                  </div>
                  <div style={{ padding: "16px 20px 20px" }}>
                    {BOOT_LINES.map((line, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: visibleBoot.includes(i) ? 1 : 0 }}
                        transition={{ duration: 0.12 }}
                        style={{
                          color: line.color,
                          fontSize: 12,
                          lineHeight: 1.85,
                          minHeight: line.text ? undefined : 8,
                        }}
                      >
                        {line.text}
                      </motion.div>
                    ))}

                    {/* Enter prompt */}
                    {showEnter && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        style={{ marginTop: 18 }}
                      >
                        <motion.div
                          animate={{ opacity: [1, 0.2, 1] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "steps(1)" }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 10,
                            border: "1px solid #00ff41",
                            color: "#00ff41",
                            fontSize: 11,
                            letterSpacing: "3px",
                            padding: "8px 18px",
                            borderRadius: 4,
                            boxShadow: "0 0 12px rgba(0,255,65,0.15)",
                          }}
                        >
                          <span style={{ fontSize: 14 }}>&#9654;</span>
                          CLICK ANYWHERE TO ENTER
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom links */}
          {showEnter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                position: "fixed",
                bottom: 24,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 24,
                zIndex: 20,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <a
                href="https://x.com/Sinalyticalife"
                target="_blank"
                rel="noreferrer"
                style={{ color: "#333", fontSize: 11, letterSpacing: "1px", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#00ff41")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#333")}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                @Sinalyticalife
              </a>
              <span style={{ color: "#1a1a1a" }}>|</span>
              <span style={{ color: "#222", fontSize: 11, letterSpacing: "1px" }}>sinalytica.life</span>
            </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div
          key="exit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ minHeight: "100vh", background: "#000" }}
        />
      )}
    </AnimatePresence>
  );
}
