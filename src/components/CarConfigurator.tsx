import { useEffect, useRef, useState } from "react";
import { RotateCcw, Pause, Play, Hand } from "lucide-react";
import { configurator, interiorConfig } from "@/data/cars";
import porsche from "@/assets/car-porsche.jpg";

/**
 * Luxury car configurator: drag-to-rotate platform spin, auto-rotate,
 * floor reflection and live exterior / wheel / caliper / interior options.
 * The rotation uses 3D perspective so the car turns on its platform rather
 * than flipping a flat image.
 */
export function CarConfigurator() {
  const [rot, setRot] = useState(-22);
  const [auto, setAuto] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [ext, setExt] = useState(configurator.exterior[0]);
  const [wheel, setWheel] = useState(configurator.wheels[0]);
  const [caliper, setCaliper] = useState(configurator.calipers[0]);
  const [interior, setInterior] = useState(interiorConfig[0]);

  const drag = useRef<{ startX: number; startRot: number } | null>(null);

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

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { startX: e.clientX, startRot: rot };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    setRot(drag.current.startRot + (e.clientX - drag.current.startX) * 0.6);
  };
  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
  };

  const norm = ((rot % 360) + 360) % 360;
  // Mirror the car to suggest the rear when rotated past 90°.
  const facing = norm > 90 && norm < 270 ? -1 : 1;

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6 shadow-luxury sm:p-8">
      <div className="absolute right-5 top-5 z-10 flex items-center gap-1.5 rounded-full glass-strong px-3 py-1 text-[0.6rem] uppercase tracking-widest text-gold">
        <RotateCcw className="h-3 w-3" /> 360° Configurator
      </div>

      {/* Stage */}
      <div
        className="relative mx-auto flex h-64 cursor-grab touch-none select-none items-center justify-center active:cursor-grabbing sm:h-80"
        style={{ perspective: "1400px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Ambient glow tinted to exterior colour */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-56 w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: ext.hex, opacity: 0.18 }}
        />

        {/* Car */}
        <div
          className="relative z-10 w-[78%] will-change-transform"
          style={{
            transform: `rotateY(${rot}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <div style={{ transform: `scaleX(${facing})` }} className="relative">
            <img
              src={porsche}
              alt="Configure your luxury car in 360 degrees"
              draggable={false}
              className="h-auto w-full object-contain drop-shadow-2xl"
            />
            {/* Exterior colour tint */}
            <div
              className="pointer-events-none absolute inset-0 mix-blend-color"
              style={{ backgroundColor: ext.hex, opacity: 0.55 }}
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
          className="pointer-events-none absolute left-1/2 top-[64%] w-[78%] -translate-x-1/2 opacity-25 blur-[2px]"
          style={{
            transform: `rotateY(${rot}deg) scaleY(-1)`,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
          }}
        >
          <div style={{ transform: `scaleX(${facing})` }}>
            <img src={porsche} alt="" draggable={false} className="h-auto w-full object-contain" />
          </div>
        </div>

        {/* Platform */}
        <div className="pointer-events-none absolute bottom-3 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[50%] bg-gold/10 blur-md" />
        <div className="pointer-events-none absolute bottom-5 left-1/2 h-1 w-[60%] -translate-x-1/2 rounded-[50%] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
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
