import { useEffect, useRef, useState } from "react";
import { RotateCcw, Pause, Play, Hand } from "lucide-react";

/**
 * Interactive 360° vehicle viewer.
 *
 * Renders the car on a rotating platform using a 3D perspective `rotateY`
 * transform so the model turns in space (with a mirrored rear suggestion past
 * 90°) rather than swapping flat frames. Supports smooth drag-to-rotate with
 * inertia on desktop (pointer) and touch (swipe) on mobile, plus an auto-spin
 * mode and a manual slider.
 */
export function Car360Viewer({ image, title }: { image: string; title: string }) {
  const [rot, setRot] = useState(-20);
  const [auto, setAuto] = useState(true);
  const [dragging, setDragging] = useState(false);

  const drag = useRef<{ startX: number; startRot: number; lastX: number; lastT: number; v: number } | null>(null);
  const velocity = useRef(0);

  // Auto-rotate loop (paused while dragging)
  useEffect(() => {
    if (!auto || dragging) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setRot((r) => r + dt * 0.03);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [auto, dragging]);

  // Inertia after releasing a drag
  useEffect(() => {
    if (dragging) return;
    if (Math.abs(velocity.current) < 0.02) return;
    let raf = 0;
    const tick = () => {
      velocity.current *= 0.94;
      setRot((r) => r + velocity.current);
      if (Math.abs(velocity.current) > 0.02) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [dragging]);

  const onPointerDown = (e: React.PointerEvent) => {
    setAuto(false);
    velocity.current = 0;
    drag.current = { startX: e.clientX, startRot: rot, lastX: e.clientX, lastT: performance.now(), v: 0 };
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const now = performance.now();
    const next = d.startRot + (e.clientX - d.startX) * 0.6;
    const dt = now - d.lastT;
    if (dt > 0) velocity.current = ((e.clientX - d.lastX) * 0.6 * 16) / dt;
    d.lastX = e.clientX;
    d.lastT = now;
    setRot(next);
  };
  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
  };

  const norm = ((rot % 360) + 360) % 360;
  // Mirror the car to suggest the rear when rotated past 90°.
  const facing = norm > 90 && norm < 270 ? -1 : 1;

  return (
    <div className="glass mt-6 rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
          <RotateCcw className="h-4 w-4" /> 360° Viewer
        </div>
        <span className="flex items-center gap-1.5 text-[0.65rem] uppercase tracking-widest text-muted-foreground">
          <Hand className="h-3.5 w-3.5" /> Drag / swipe to rotate
        </span>
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
        {/* Car */}
        <div
          className="relative z-10 w-[82%] will-change-transform"
          style={{ transform: `rotateY(${rot}deg)`, transformStyle: "preserve-3d" }}
        >
          <div style={{ transform: `scaleX(${facing})` }}>
            <img
              src={image}
              alt={`${title} 360 degree view`}
              draggable={false}
              className="h-auto w-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Reflection */}
        <div
          className="pointer-events-none absolute left-1/2 top-[66%] w-[82%] -translate-x-1/2 opacity-20 blur-[2px]"
          style={{
            transform: `rotateY(${rot}deg) scaleY(-1)`,
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)",
          }}
        >
          <div style={{ transform: `scaleX(${facing})` }}>
            <img src={image} alt="" draggable={false} className="h-auto w-full object-contain" />
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
      </div>

      <input
        type="range"
        min={-180}
        max={180}
        value={Math.round(((norm + 180) % 360) - 180)}
        onChange={(e) => {
          setAuto(false);
          velocity.current = 0;
          setRot(Number(e.target.value));
        }}
        className="mt-3 w-full accent-gold"
        aria-label="Rotate vehicle"
      />
    </div>
  );
}
