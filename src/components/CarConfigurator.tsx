import { useEffect, useRef, useState } from "react";
import { RotateCcw, Pause, Play, Hand } from "lucide-react";
import { configurator, interiorConfig } from "@/data/cars";

/**
 * Luxury home-page configurator: smooth drag/swipe turntable, auto-rotate,
 * floor reflection and live exterior / wheel / caliper / interior options.
 * The vehicle uses a turntable yaw simulation instead of rotateY on the full
 * photo, so it never collapses into the flat image panel shown before.
 */
export function CarConfigurator() {
  const [rot, setRot] = useState(-22);
  const [auto, setAuto] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [ext, setExt] = useState(configurator.exterior[0]);
  const [wheel, setWheel] = useState(configurator.wheels[0]);
  const [caliper, setCaliper] = useState(configurator.calipers[0]);
  const [interior, setInterior] = useState(interiorConfig[0]);

  const drag = useRef<{ startX: number; startRot: number; lastX: number; lastT: number } | null>(null);
  const velocity = useRef(0);

  // Auto-rotate loop
  useEffect(() => {
    if (!auto || dragging) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setRot((r) => r + dt * 0.025);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto, dragging]);

  // Momentum after the user releases drag/swipe.
  useEffect(() => {
    if (dragging || Math.abs(velocity.current) < 0.02) return;
    let raf = 0;
    const tick = () => {
      velocity.current *= 0.94;
      setRot((r) => r + velocity.current);
      if (Math.abs(velocity.current) > 0.02) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dragging]);

  const onPointerDown = (e: React.PointerEvent) => {
    setAuto(false);
    velocity.current = 0;
    drag.current = { startX: e.clientX, startRot: rot, lastX: e.clientX, lastT: performance.now() };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const next = d.startRot + (e.clientX - d.startX) * 0.65;
    const dt = now - d.lastT;
    if (dt > 0) velocity.current = ((e.clientX - d.lastX) * 0.65 * 16) / dt;
    d.lastX = e.clientX;
    d.lastT = now;
    setRot(next);
  };
  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
  };

  const norm = ((rot % 360) + 360) % 360;
  const yaw = Math.sin((norm * Math.PI) / 180);
  const side = Math.abs(yaw);

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6 shadow-luxury sm:p-8">
      <div className="absolute right-5 top-5 z-10 flex items-center gap-1.5 rounded-full glass-strong px-3 py-1 text-[0.6rem] uppercase tracking-widest text-gold">
        <RotateCcw className="h-3 w-3" /> 360° Configurator
      </div>

      {/* Stage */}
      <div
        className="relative mx-auto flex h-64 cursor-grab touch-none select-none items-center justify-center overflow-hidden active:cursor-grabbing sm:h-80"
        style={{ perspective: "1200px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Ambient glow tinted to exterior colour */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: ext.hex, opacity: 0.18 }}
        />

        <CarModel
          rotation={rot}
          paint={ext.hex}
          wheel={wheel.hex}
          caliper={caliper.hex}
          interior={interior.hex}
          dragging={dragging}
        />

        {/* Platform */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 h-12 w-[76%] -translate-x-1/2 rounded-[50%] bg-gold/10 blur-md" />
        <div
          className="pointer-events-none absolute bottom-6 left-1/2 h-16 w-[64%] -translate-x-1/2 rounded-[50%] border border-gold/25 bg-gradient-to-r from-transparent via-gold/10 to-transparent"
          style={{ transform: `translateX(-50%) rotateX(72deg) rotateZ(${rot}deg) scaleX(${1 + side * 0.12})` }}
        />
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={() => setAuto((a) => !a)}
          className="flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-xs uppercase tracking-widest text-gold transition-colors hover:bg-gold/10"
        >
          {auto ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {auto ? "Pause" : "Auto-Spin"}
        </button>
        <span className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-widest text-muted-foreground">
          <Hand className="h-3.5 w-3.5" /> Drag to rotate
        </span>
      </div>

      <input
        type="range"
        min={-180}
        max={180}
        value={Math.round(((norm + 180) % 360) - 180)}
        onChange={(e) => {
          setAuto(false);
          setRot(Number(e.target.value));
        }}
        className="mt-3 w-full accent-gold"
        aria-label="Rotate vehicle"
      />

      {/* Option swatches */}
      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4">
        <SwatchRow label="Exterior" options={configurator.exterior} active={ext.name} onPick={setExt} />
        <SwatchRow label="Wheels" options={configurator.wheels} active={wheel.name} onPick={setWheel} />
        <SwatchRow label="Calipers" options={configurator.calipers} active={caliper.name} onPick={setCaliper} />
        <SwatchRow label="Interior" options={interiorConfig} active={interior.name} onPick={setInterior} />
      </div>
    </div>
  );
}

function CarModel({
  rotation,
  paint,
  wheel,
  caliper,
  interior,
  dragging,
}: {
  rotation: number;
  paint: string;
  wheel: string;
  caliper: string;
  interior: string;
  dragging: boolean;
}) {
  const norm = ((rotation % 360) + 360) % 360;
  const rad = (norm * Math.PI) / 180;
  const yaw = Math.sin(rad);
  const side = Math.abs(yaw);
  const rear = Math.max(0, -Math.cos(rad));
  const scaleX = 1 - side * 0.22 - rear * 0.1;
  const translateX = yaw * 9;
  const skew = yaw * -5;
  const wheelGap = 150 + side * 54;
  const wheelScale = 1 - side * 0.24;
  const hoodShift = yaw * 34;
  const transition = dragging ? "none" : "transform 100ms linear";

  const car = (
    <svg viewBox="0 0 760 340" role="img" aria-label="Interactive 360 degree luxury vehicle model" className="h-full w-full overflow-visible">
      <defs>
        <linearGradient id="bodyPaint" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.75" />
          <stop offset="28%" stopColor={paint} />
          <stop offset="70%" stopColor={paint} stopOpacity="0.78" />
          <stop offset="100%" stopColor="black" stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id="glassPaint" x1="0" x2="1">
          <stop offset="0%" stopColor={interior} stopOpacity="0.9" />
          <stop offset="100%" stopColor="black" stopOpacity="0.92" />
        </linearGradient>
        <radialGradient id="wheelPaint">
          <stop offset="0%" stopColor={caliper} />
          <stop offset="42%" stopColor={wheel} />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
      </defs>

      <g style={{ transform: `translate(${translateX}px, 0px) scale(${scaleX}, 1) skewY(${skew}deg)`, transformOrigin: "380px 210px", transition }}>
        <ellipse cx="380" cy="286" rx="290" ry="32" fill="black" opacity="0.45" />
        <path d={`M130 218 C170 151 238 117 ${322 + hoodShift} 118 L454 118 C548 120 628 155 674 216 C695 244 677 267 629 271 L161 271 C116 267 103 246 130 218Z`} fill="url(#bodyPaint)" />
        <path d={`M283 126 C319 78 425 76 479 126 L539 187 L232 187 C238 162 253 141 283 126Z`} fill="url(#glassPaint)" opacity={0.9 - rear * 0.16} />
        <path d={`M147 219 C222 206 294 201 ${382 + hoodShift} 201 C485 201 592 209 674 224`} fill="none" stroke="white" strokeOpacity="0.32" strokeWidth="5" strokeLinecap="round" />
        <path d="M178 238 L284 231" stroke="white" strokeOpacity="0.48" strokeWidth="7" strokeLinecap="round" />
        <path d="M584 231 L660 239" stroke="white" strokeOpacity="0.46" strokeWidth="7" strokeLinecap="round" />
        <g style={{ transform: `translate(${-wheelGap / 2}px, 0) scale(${wheelScale}, 1)`, transformOrigin: "380px 252px", transition }}>
          <circle cx="302" cy="252" r="48" fill="url(#wheelPaint)" />
          <circle cx="302" cy="252" r="24" fill="none" stroke="white" strokeOpacity="0.36" strokeWidth="7" />
        </g>
        <g style={{ transform: `translate(${wheelGap / 2}px, 0) scale(${wheelScale}, 1)`, transformOrigin: "380px 252px", transition }}>
          <circle cx="458" cy="252" r="48" fill="url(#wheelPaint)" />
          <circle cx="458" cy="252" r="24" fill="none" stroke="white" strokeOpacity="0.36" strokeWidth="7" />
        </g>
        <path d="M248 192 L523 192" stroke="black" strokeOpacity="0.42" strokeWidth="5" />
      </g>
    </svg>
  );

  return (
    <>
      <div className="relative z-10 h-52 w-[94%] will-change-transform sm:h-64">{car}</div>
      <div
        className="pointer-events-none absolute left-1/2 top-[64%] h-44 w-[84%] -translate-x-1/2 scale-y-[-0.45] opacity-20 blur-[2px] sm:h-56"
        style={{ maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)", WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)" }}
      >
        {car}
      </div>
    </>
  );
}

function SwatchRow({
  label,
  options,
  active,
  onPick,
}: {
  label: string;
  options: { name: string; hex: string }[];
  active: string;
  onPick: (o: { name: string; hex: string }) => void;
}) {
  const current = options.find((o) => o.name === active);
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <p className="text-[0.65rem] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="text-[0.65rem] text-foreground/70">{current?.name}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.name}
            onClick={() => onPick(o)}
            title={o.name}
            aria-label={`${label}: ${o.name}`}
            className={`h-7 w-7 rounded-full border transition-transform hover:scale-110 ${
              active === o.name ? "border-gold ring-2 ring-gold/40" : "border-border"
            }`}
            style={{ backgroundColor: o.hex }}
          />
        ))}
      </div>
    </div>
  );
}

