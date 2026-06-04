import { useEffect, useRef, useState } from "react";
import { RotateCcw, Pause, Play, Hand } from "lucide-react";
import { configurator, interiorConfig } from "@/data/cars";
import porsche from "@/assets/car-porsche.jpg";

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
  const rad = (norm * Math.PI) / 180;
  const yaw = Math.sin(rad);
  const side = Math.abs(yaw);
  const rear = Math.max(0, -Math.cos(rad));
  const facing = norm > 90 && norm < 270 ? -1 : 1;
  const vehicleScaleX = 1 - side * 0.38 - rear * 0.08;
  const vehicleScaleY = 1 - side * 0.045;
  const vehicleTranslateX = yaw * 7;
  const vehicleSkewY = yaw * -3.5;
  const vehicleFilter = `${paintFilter(ext.name)} brightness(${1.03 - rear * 0.1}) saturate(${1.08 + side * 0.08})`;

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

        {/* Car: turntable yaw simulation, not a rotating photo plane */}
        <div
          className="relative z-10 w-[86%] will-change-transform"
          style={{
            transform: `translateX(${vehicleTranslateX}%) scaleX(${vehicleScaleX * facing}) scaleY(${vehicleScaleY}) skewY(${vehicleSkewY}deg)`,
            transformOrigin: yaw > 0 ? "58% 62%" : "42% 62%",
            transition: dragging ? "none" : "transform 90ms linear, filter 90ms linear",
            filter: `drop-shadow(${yaw * 18}px 28px 26px rgba(0,0,0,0.58)) ${vehicleFilter}`,
          }}
        >
          <div className="relative">
            <img
              src={porsche}
              alt="Configure your luxury car in 360 degrees"
              draggable={false}
              className="h-auto w-full object-contain mix-blend-screen"
            />
            {/* Caliper accent dot */}
            <span
              className="pointer-events-none absolute bottom-[26%] left-[24%] h-2.5 w-2.5 rounded-full ring-2 ring-background"
              style={{ backgroundColor: caliper.hex }}
            />
          </div>
        </div>

        {/* Reflection */}
        <div
          className="pointer-events-none absolute left-1/2 top-[65%] w-[86%] opacity-20 blur-[2px]"
          style={{
            transform: `translateX(-50%) translateX(${vehicleTranslateX}%) scaleX(${vehicleScaleX * facing}) scaleY(-0.48) skewY(${vehicleSkewY}deg)`,
            transformOrigin: "50% 0%",
            filter: vehicleFilter,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
          }}
        >
          <img src={porsche} alt="" draggable={false} className="h-auto w-full object-contain mix-blend-screen" />
        </div>

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

function paintFilter(name: string) {
  if (name.includes("Nero")) return "grayscale(0.75) brightness(0.42) contrast(1.35)";
  if (name.includes("Pearl")) return "grayscale(0.35) brightness(1.28) saturate(0.72)";
  if (name.includes("Silver")) return "grayscale(0.7) brightness(1.08) saturate(0.6)";
  if (name.includes("Emerald")) return "hue-rotate(118deg) saturate(1.2) brightness(0.82)";
  if (name.includes("Sapphire")) return "hue-rotate(205deg) saturate(1.24) brightness(0.78)";
  return "hue-rotate(0deg) saturate(1.1) brightness(1.02)";
}
