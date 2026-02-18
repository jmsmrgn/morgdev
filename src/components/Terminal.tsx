import { useEffect } from "react";
import useTypewriter from "../hooks/useTypewriter";
import "../styles/terminal.css";

export default function Terminal() {
  const { lines, done, skip } = useTypewriter();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") skip();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [skip]);

  return (
    <div className="terminal-root">
      <header className="terminal-header">
        <div className="terminal-header-logo">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.5"
              width="31"
              height="31"
              stroke="var(--color-command)"
              strokeWidth="1"
            />
            <text
              x="50%"
              y="50%"
              dominantBaseline="central"
              textAnchor="middle"
              fontFamily="JetBrains Mono, monospace"
              fontSize="13"
              fill="var(--color-command)"
            >
              JM
            </text>
          </svg>
          <span className="terminal-header-name">jmsmrgn</span>
        </div>
        <span className="terminal-header-meta">
          @jmsmrgn &middot; chicago, il
        </span>
      </header>
      <div className="terminal-window" onClick={skip}>
        <div className="terminal-titlebar">
          <div className="terminal-titlebar-dots">
            <span className="terminal-titlebar-dot dot-close" title="close">
              <span className="dot-icon">✕</span>
            </span>
            <span
              className="terminal-titlebar-dot dot-minimize"
              title="minimize"
            >
              <span className="dot-icon">−</span>
            </span>
            <span className="terminal-titlebar-dot dot-expand" title="expand">
              <span className="dot-icon">+</span>
            </span>
          </div>
          <span className="terminal-titlebar-title">morg.dev — zsh</span>
        </div>
        <div className="terminal-body">
          {lines.map((line, i) => {
            const isLast = i === lines.length - 1;
            return (
              <div
                key={i}
                className={`terminal-line${line.className ? ` ${line.className}` : ""}`}
              >
                {line.text || "\u00A0"}
                {isLast && !done && <span className="cursor">█</span>}
              </div>
            );
          })}
          {done && (
            <div className="terminal-line">
              <span className="cursor">█</span>
            </div>
          )}
          {!done && (
            <div className="terminal-hint">[ press space to skip ]</div>
          )}
        </div>
        <footer className={`terminal-links ${done ? "links-visible" : ""}`}>
          <a href="https://github.com/jmsmrgn" target="_blank" rel="noopener">
            [ github ]
          </a>
          <a
            href="https://www.linkedin.com/in/jmsmrgn/"
            target="_blank"
            rel="noopener"
          >
            [ linkedin ]
          </a>
          <a href="https://x.com/jmsmrgn" target="_blank" rel="noopener">[ x.com ]</a>
          <a href="mailto:james@morg.dev">[ email ]</a>
        </footer>
      </div>
    </div>
  );
}
