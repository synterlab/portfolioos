import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  { text: "SINALYTICA OS v2.6.1 — booting...", delay: 0, color: "#00ff41" },
  { text: "Initializing terminal environment...", delay: 300, color: "#555" },
  { text: "[  OK  ] Loaded kernel modules", delay: 600, color: "#00cc33" },
  { text: "[  OK  ] Started filesystem checks", delay: 900, color: "#00cc33" },
  { text: "[  OK  ] Mounted portfolio volumes", delay: 1100, color: "#00cc33" },
  { text: "[  OK  ] Network interface UP — sinalytica.life", delay: 1350, color: "#00cc33" },
  { text: "Loading portfolio engine...", delay: 1700, color: "#555" },
  { text: "[  OK  ] Portfolio engine loaded", delay: 2000, color: "#00cc33" },
  { text: "[  OK  ] Experience renderer ready", delay: 2200, color: "#00cc33" },
  { text: "", delay: 2500, color: "#000" },
  { text: "Welcome. Your career. Your terminal.", delay: 2700, color: "#fff" },
];

export default function DemoIntro() {
  const [, setLocation] = useLocation();
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [showEnter, setShowEnter] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines((prev) => [...prev, i]);
      }, line.delay);
    });
    setTimeout(() => setShowEnter(true), 3400);
  }, []);

  function handleEnter() {
    if (!showEnter) return;
    setExiting(true);
    setTimeout(() => setLocation("/home"), 700);
  }

  return (
    <AnimatePresence>
      {!exiting ? (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
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
            padding: "40px 24px",
            userSelect: "none",
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: 40, textAlign: "center" }}
          >
            <img
              src="/sinalytica-logo.png"
              alt="Sinalytica"
              width={96}
              height={96}
              style={{ imageRendering: "pixelated", display: "block", margin: "0 auto 12px" }}
            />
            <div style={{ color: "#00ff41", fontSize: 11, letterSpacing: "5px" }}>
              SINALYTICA.LIFE
            </div>
          </motion.div>

          {/* Boot terminal */}
          <div
            style={{
              width: "100%",
              maxWidth: 560,
              background: "#050505",
              border: "1px solid #1a1a1a",
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 0 60px rgba(0,255,65,0.08)",
            }}
          >
            {/* Title bar */}
            <div style={{ background: "#0a0a0a", borderBottom: "1px solid #111", padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <span style={{ color: "#333", fontSize: 11, marginLeft: 8, letterSpacing: "0.5px" }}>
                sinalytica — system boot
              </span>
            </div>

            {/* Lines */}
            <div style={{ padding: "20px 22px 24px", minHeight: 280 }}>
              {BOOT_LINES.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: visibleLines.includes(i) ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    color: line.color,
                    fontSize: 13,
                    lineHeight: 1.9,
                    minHeight: line.text ? undefined : 10,
                  }}
                >
                  {line.text}
                </motion.div>
              ))}

              {/* Blinking enter prompt */}
              {showEnter && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  style={{ marginTop: 20 }}
                >
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: "steps(1)" }}
                    style={{
                      display: "inline-block",
                      border: "1px solid #00ff41",
                      color: "#00ff41",
                      fontSize: 12,
                      letterSpacing: "3px",
                      padding: "8px 20px",
                      borderRadius: 4,
                    }}
                  >
                    ▶ CLICK ANYWHERE TO ENTER
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Skip hint */}
          {showEnter && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ marginTop: 28, color: "#333", fontSize: 11, letterSpacing: "1px" }}
            >
              tap anywhere to continue
            </motion.p>
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
