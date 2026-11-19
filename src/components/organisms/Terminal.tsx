import { useEffect, useRef, useState, type KeyboardEvent } from "react";

export type TerminalLink = { text: string; href: string };
export type TerminalOutput = { text?: string; links?: TerminalLink[]; kind?: LineKind };
type LineKind = "sys" | "in" | "out" | "err" | "gold";
type Line = { kind: LineKind; text?: string; links?: TerminalLink[] };

export type TerminalProps = {
  /** Map of command name → output shown when it runs. */
  commands: Record<string, TerminalOutput>;
  /** Commands shown as quick buttons, in order (`clear` is handled internally). */
  quick: string[];
  welcome: string;
  notFound: string;
  placeholder: string;
  inputLabel: string;
  prompt?: string;
};

const COLORS: Record<LineKind, string> = {
  sys: "#efb8c8",
  in: "#4ade80",
  out: "#ffd8e4",
  err: "#fca5a5",
  gold: "#fde68a",
};

const Terminal = ({
  commands,
  quick,
  welcome,
  notFound,
  placeholder,
  inputLabel,
  prompt = "yuli@portfolio:~$",
}: TerminalProps) => {
  const [log, setLog] = useState<Line[]>([{ kind: "sys", text: welcome }]);
  const [draft, setDraft] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const screen = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = screen.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [log]);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, " ");
    if (!cmd) return;
    setHistory((h) => [...h, cmd]);
    setCursor(-1);
    setDraft("");
    if (cmd === "clear") {
      setLog([]);
      return;
    }
    const out = commands[cmd];
    const answer: Line = out
      ? { kind: out.kind ?? "out", text: out.text, links: out.links }
      : { kind: "err", text: notFound.replace("{cmd}", cmd) };
    setLog((l) => [...l, { kind: "in", text: `$ ${cmd}` }, answer]);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(draft);
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setDraft(history[next]);
    } else if (e.key === "ArrowDown" && cursor >= 0) {
      e.preventDefault();
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(-1);
        setDraft("");
      } else {
        setCursor(next);
        setDraft(history[next]);
      }
    }
  };

  return (
    <div className="terminal px-card">
      <div className="px-bar" aria-hidden="true">
        <span className="px-dot px-dot-red" aria-hidden="true" /><span className="px-dot px-dot-yellow" aria-hidden="true" /><span className="px-dot px-dot-green" aria-hidden="true" />
        <span className="px-bar-title">yuli@portfolio: ~</span>
      </div>
      <div
        ref={screen}
        className="terminal-screen"
        role="log"
        aria-live="polite"
        onClick={() => input.current?.focus()}
      >
        {log.map((line, i) => (
          <div key={i} className="terminal-line" style={{ color: COLORS[line.kind] }}>
            {line.text}
            {line.links?.map((l) => (
              <span key={l.href}>
                {" "}
                <a href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.text} ↗
                </a>
              </span>
            ))}
          </div>
        ))}
        <div className="terminal-prompt">
          <span className="terminal-ps1" aria-hidden="true" style={{ color: COLORS.in }}>
            {prompt}
          </span>
          <input
            id="terminal-input"
            ref={input}
            type="text"
            aria-label={inputLabel}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <span className="px-blink" aria-hidden="true">█</span>
        </div>
      </div>
      <div className="terminal-quick">
        {[...quick, "clear"].map((name) => (
          <button key={name} type="button" className="terminal-cmd" onClick={() => run(name)}>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Terminal;
