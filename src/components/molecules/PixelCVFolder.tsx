import { useState, useRef, useEffect } from "react";

interface Props {
  cvLink: string;
  cvPreviewImage?: string;
  label?: string;
}

const FolderClosed = () => (
  <svg viewBox="0 0 32 28" xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering:"pixelated", display:"block", width:"100%", height:"100%" }}
    shapeRendering="crispEdges">
    {/* tab */}
    <rect x="2"  y="1" width="10" height="3" fill="#e8a020"/>
    <rect x="1"  y="0" width="1"  height="4" fill="#1a1a1a"/>
    <rect x="3"  y="0" width="8"  height="1" fill="#1a1a1a"/>
    <rect x="11" y="0" width="2"  height="1" fill="#1a1a1a"/>
    <rect x="12" y="1" width="1"  height="3" fill="#1a1a1a"/>
    {/* body */}
    <rect x="0"  y="4" width="32" height="24" fill="#f5c842"/>
    <rect x="0"  y="4" width="1"  height="24" fill="#1a1a1a"/>
    <rect x="31" y="4" width="1"  height="24" fill="#1a1a1a"/>
    <rect x="0"  y="27" width="32" height="1"  fill="#1a1a1a"/>
    <rect x="1"  y="4"  width="30" height="1"  fill="#1a1a1a"/>
    {/* highlight */}
    <rect x="2"  y="5" width="28" height="1" fill="#fde98a"/>
    <rect x="2"  y="6" width="1"  height="3" fill="#fde98a"/>
    {/* shadow */}
    <rect x="30" y="5"  width="1"  height="21" fill="#c07010"/>
    <rect x="1"  y="26" width="29" height="1"  fill="#c07010"/>
    {/* C */}
    <rect x="7"  y="12" width="4" height="1" fill="#1a1a1a"/>
    <rect x="7"  y="17" width="4" height="1" fill="#1a1a1a"/>
    <rect x="6"  y="13" width="1" height="4" fill="#1a1a1a"/>
    {/* V */}
    <rect x="14" y="12" width="1" height="4" fill="#1a1a1a"/>
    <rect x="15" y="16" width="1" height="1" fill="#1a1a1a"/>
    <rect x="16" y="17" width="1" height="1" fill="#1a1a1a"/>
    <rect x="17" y="16" width="1" height="1" fill="#1a1a1a"/>
    <rect x="18" y="12" width="1" height="4" fill="#1a1a1a"/>
    {/* deco dots */}
    <rect x="6"  y="20" width="1" height="1" fill="#c07010"/>
    <rect x="10" y="20" width="1" height="1" fill="#c07010"/>
    <rect x="14" y="20" width="1" height="1" fill="#c07010"/>
    <rect x="18" y="20" width="1" height="1" fill="#c07010"/>
  </svg>
);

const FolderOpen = ({ scanLine }: { scanLine: number }) => (
  <svg viewBox="0 0 40 44" xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering:"pixelated", display:"block", width:"100%", height:"100%", overflow:"visible" }}
    shapeRendering="crispEdges">
    <defs>
      <clipPath id="docClipPCF">
        <rect x="7" y="0" width="26" height="22"/>
      </clipPath>
    </defs>

    {/* DOCUMENT peeking — clipped so only top shows above folder */}
    <g clipPath="url(#docClipPCF)">
      <rect x="9"  y="1" width="22" height="28" fill="#f5f5f5"/>
      <rect x="29" y="1" width="2"  height="2"  fill="#d0d0d0"/>
      <rect x="8"  y="0" width="24" height="1"  fill="#1a1a1a"/>
      <rect x="8"  y="0" width="1"  height="25" fill="#1a1a1a"/>
      <rect x="31" y="0" width="1"  height="25" fill="#1a1a1a"/>
      <rect x="11" y="5"  width="16" height="2" fill="#b0b0b0"/>
      <rect x="11" y="9"  width="12" height="1" fill="#c8c8c8"/>
      <rect x="11" y="12" width="15" height="1" fill="#c8c8c8"/>
      <rect x="11" y="15" width="10" height="1" fill="#c8c8c8"/>
      <rect x="11" y="18" width="14" height="1" fill="#c8c8c8"/>
      {/* animated scan line */}
      {/* <rect x="9" y={scanLine} width="22" height="1" fill="rgba(239,184,200,0.6)"/> */}
    </g>

    {/* FOLDER BACK WALL */}
    <rect x="1"  y="17" width="38" height="6"  fill="#f0b830"/>
    <rect x="0"  y="16" width="1"  height="8"  fill="#1a1a1a"/>
    <rect x="39" y="16" width="1"  height="8"  fill="#1a1a1a"/>
    <rect x="1"  y="15" width="38" height="1"  fill="#1a1a1a"/>
    {/* back tab */}
    <rect x="2"  y="11" width="11" height="5"  fill="#e8a020"/>
    <rect x="1"  y="11" width="1"  height="5"  fill="#1a1a1a"/>
    <rect x="3"  y="10" width="10" height="1"  fill="#1a1a1a"/>
    <rect x="13" y="11" width="1"  height="4"  fill="#1a1a1a"/>
    <rect x="14" y="15" width="1"  height="1"  fill="#1a1a1a"/>

    {/* WHITE PAPER STRIP */}
    <rect x="2"  y="22" width="36" height="3"  fill="#ffffff"/>
    <rect x="2"  y="22" width="36" height="1"  fill="#1a1a1a"/>
    <rect x="2"  y="24" width="36" height="1"  fill="#dddddd"/>

    {/* FRONT FLAP */}
    <rect x="1"  y="22" width="38" height="21" fill="#f5c842"/>
    <rect x="0"  y="22" width="1"  height="22" fill="#1a1a1a"/>
    <rect x="39" y="22" width="1"  height="22" fill="#1a1a1a"/>
    <rect x="1"  y="43" width="38" height="1"  fill="#1a1a1a"/>
    <rect x="2"  y="25" width="36" height="1"  fill="#fde98a"/>
    <rect x="2"  y="26" width="1"  height="3"  fill="#fde98a"/>
    <rect x="38" y="25" width="1"  height="17" fill="#c07010"/>
    <rect x="2"  y="42" width="36" height="1"  fill="#c07010"/>
  </svg>
);

export default function PixelCVFolder({ cvLink, label = "View my CV" }: Props) {
  const [open, setOpen]       = useState(false);
  const [clicked, setClicked] = useState(false);
  const [scanLine, setScanLine] = useState(5);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanTimer  = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanDir    = useRef(1);

  useEffect(() => {
    if (open) {
      setScanLine(5);
      scanTimer.current = setInterval(() => {
        setScanLine(s => {
          const next = s + scanDir.current;
          if (next >= 20) scanDir.current = -1;
          if (next <= 5)  scanDir.current = 1;
          return next;
        });
      }, 55);
    } else {
      if (scanTimer.current) clearInterval(scanTimer.current);
    }
    return () => { if (scanTimer.current) clearInterval(scanTimer.current); };
  }, [open]);

  const onEnter = () => { if (leaveTimer.current) clearTimeout(leaveTimer.current); setOpen(true); };
  const onLeave = () => { leaveTimer.current = setTimeout(() => setOpen(false), 150); };
  const onClick = () => { setClicked(true); setTimeout(() => setClicked(false), 300); };

  return (
    <>
      <style>{`
        .pcf{display:inline-flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;text-decoration:none;position:relative;-webkit-user-select:none;user-select:none;}
        .pcf-icon{position:relative;width:140px;height:130px;display:flex;align-items:flex-end;justify-content:center;transition:transform 0.2s cubic-bezier(0.34,1.4,0.64,1);}
        .pcf:hover .pcf-icon{transform:translateY(-7px);}
        .pcf.is-clicked .pcf-icon{transform:translateY(3px) scale(0.95)!important;transition:transform 0.08s ease!important;}
        .pcf-icon svg{filter:drop-shadow(4px 4px 0 var(--color-text-primary,#1a1a1a));transition:filter 0.15s;}
        .pcf:hover .pcf-icon svg{filter:drop-shadow(6px 6px 0 var(--color-text-primary,#1a1a1a));}
        .pcf-closed{position:absolute;bottom:0;left:0;right:0;height:96px;transition:opacity 0.14s ease;}
        .pcf-opened{position:absolute;bottom:0;left:0;right:0;height:130px;opacity:0;transform:scale(0.9) translateY(8px);transition:opacity 0.2s ease,transform 0.25s cubic-bezier(0.34,1.4,0.64,1);pointer-events:none;}
        .pcf:hover .pcf-closed,.pcf.is-open .pcf-closed{opacity:0;pointer-events:none;}
        .pcf:hover .pcf-opened,.pcf.is-open .pcf-opened{opacity:1;transform:scale(1) translateY(0);pointer-events:auto;}
        .pcf-label{font-family:'Pixelify Sans',monospace;font-size:0.78rem;font-weight:700;letter-spacing:0.08em;color:var(--color-text-primary,#1a1a1a);opacity:0.7;display:flex;align-items:center;gap:4px;transition:opacity 0.15s;}
        .pcf:hover .pcf-label{opacity:1;}
        .pcf-arr{transition:transform 0.2s;display:inline-block;}
        .pcf:hover .pcf-arr{transform:translate(3px,-3px);}
        .pcf-sparks{position:absolute;top:30%;left:50%;pointer-events:none;z-index:30;}
        .pcf-sparks span{position:absolute;font-size:13px;opacity:0;animation:pcfSpark 0.5s ease forwards;}
        .pcf-sparks span:nth-child(1){animation-delay:0s;   --dx:-18px;--dy:-24px;}
        .pcf-sparks span:nth-child(2){animation-delay:.05s; --dx: 20px;--dy:-20px;}
        .pcf-sparks span:nth-child(3){animation-delay:.08s; --dx:-22px;--dy:  6px;}
        .pcf-sparks span:nth-child(4){animation-delay:.03s; --dx: 24px;--dy:  8px;}
        .pcf-sparks span:nth-child(5){animation-delay:.06s; --dx:  2px;--dy:-28px;}
        @keyframes pcfSpark{0%{opacity:1;transform:translate(0,0) scale(1.4);}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(0);}}
      `}</style>

      <a href={cvLink} target="_blank" rel="noopener noreferrer"
        className={`pcf${open?" is-open":""}${clicked?" is-clicked":""}`}
        onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick}
        aria-label={label}
      >
        <div className="pcf-icon">
          <div className="pcf-closed"><FolderClosed /></div>
          <div className="pcf-opened"><FolderOpen scanLine={scanLine} /></div>
        </div>

        {clicked && (
          <div className="pcf-sparks" aria-hidden="true">
            <span>✦</span><span>✧</span><span>♥</span><span>⭐</span><span>✦</span>
          </div>
        )}

        <span className="pcf-label">{label}<span className="pcf-arr">↗</span></span>
 
      </a>
    </>
  );
}