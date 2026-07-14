"use client";

type Props = {
  rotation: number;
  onRotationChange: (deg: number) => void;
  locked: boolean;
  onLockedChange: (locked: boolean) => void;
  scaleMultiplier: number;
  onScaleChange: (mul: number) => void;
  moveAsOne: boolean;
  onMoveAsOneChange: (on: boolean) => void;
  onRecenter: () => void;
  /** Compact layout for the in-canvas overlay — drops some controls */
  compact?: boolean;
  /** Hide the scale slider — used on mobile where pinch-zoom replaces it */
  hideScale?: boolean;
  /** Optional callback wired to a "Done — lock & continue" pill. The
      caller is expected to lock the map and (typically) collapse the
      panel so the canvas reads cleanly. */
  onDone?: () => void;
};

/**
 * Snap rotation only to *cardinal* directions (0, ±90, ±180) and only
 * inside a tight 2° window. Used to be a 15° snap with a 7° catch range,
 * which made it impossible to land on e.g. 11° — the slider would
 * silently jump back to 15°. With cardinal-only snap the user gets full
 * 1° precision and we still help them find true north / right-angle.
 */
const CARDINAL_SNAP_RANGE = 2;
function snapToCardinals(n: number): number {
  for (const target of [-180, -90, 0, 90, 180]) {
    if (Math.abs(n - target) <= CARDINAL_SNAP_RANGE) return target;
  }
  return n;
}

/**
 * Shared map-control surface. Used in two places:
 *   - Desktop: canvas-overlay panel (compact mode)
 *   - Mobile: MobileMapBar accordion (full mode)
 */
export default function MapControls({
  rotation,
  onRotationChange,
  locked,
  onLockedChange,
  scaleMultiplier,
  onScaleChange,
  moveAsOne,
  onMoveAsOneChange,
  onRecenter,
  compact = false,
  hideScale = false,
  onDone,
}: Props) {
  const handleSliderRelease = () => {
    onRotationChange(snapToCardinals(rotation));
  };

  const quickRotateBtn = (deg: number, label: string) => (
    <button
      onClick={() => onRotationChange(deg)}
      className={`flex-1 px-2 py-1 rounded text-[10px] font-bold transition-colors border ${
        Math.round(rotation) === deg
          ? "bg-amber-500 text-white border-amber-500"
          : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
      title={`Set rotation to ${label}`}
    >
      {label}
    </button>
  );

  const iconBtn = (active: boolean, onClick: () => void, icon: React.ReactNode, title: string, label?: string) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-bold transition-colors border ${
        active ? "bg-amber-500 text-white border-amber-500" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
      }`}
      title={title}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className={`bg-white/95 backdrop-blur rounded-lg border border-gray-200 shadow-sm ${compact ? "p-2" : "p-3"} flex flex-col gap-2`}>
      {!compact && (
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Map</span>
      )}

      {/* Action row: Lock + Recenter + Move-as-one */}
      <div className="flex items-center gap-1.5">
        {iconBtn(
          locked,
          () => onLockedChange(!locked),
          locked ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 019.9-1" />
            </svg>
          ),
          locked ? "Unlock map" : "Lock map in place",
          locked ? "Locked" : "Lock",
        )}

        {iconBtn(
          false,
          onRecenter,
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="22" y1="12" x2="18" y2="12" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="12" y1="22" x2="12" y2="18" />
          </svg>,
          "Recentre map under the building cluster",
          "Recentre",
        )}

        {!compact && iconBtn(
          moveAsOne,
          () => onMoveAsOneChange(!moveAsOne),
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" /><polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
          </svg>,
          "When ON, dragging the map moves your buildings with it",
          moveAsOne ? "Linked" : "Move all",
        )}
      </div>

      {/* Rotation row */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-gray-500 w-10">Rotate</span>
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={rotation}
            onChange={(e) => onRotationChange(parseFloat(e.target.value))}
            onMouseUp={handleSliderRelease}
            onTouchEnd={handleSliderRelease}
            className="flex-1 h-1 accent-amber-500"
          />
          <input
            type="number"
            value={Math.round(rotation)}
            onChange={(e) => onRotationChange(parseFloat(e.target.value) || 0)}
            className="w-12 px-1 py-0.5 text-[10px] text-center rounded border border-gray-200"
            min={-180}
            max={180}
            aria-label="Rotation in degrees"
          />
        </div>
        <div className="flex items-center gap-1">
          {quickRotateBtn(-90, "−90°")}
          {quickRotateBtn(0, "0°")}
          {quickRotateBtn(90, "+90°")}
        </div>
      </div>

      {/* Scale row — desktop only */}
      {!hideScale && (
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-gray-500 w-10">Scale</span>
          <input
            type="range"
            min={0.4}
            max={2.5}
            step={0.05}
            value={scaleMultiplier}
            onChange={(e) => onScaleChange(parseFloat(e.target.value))}
            className="flex-1 h-1 accent-amber-500"
          />
          <button
            onClick={() => onScaleChange(1)}
            className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-500 rounded border border-gray-200 hover:bg-gray-50"
            title="Reset scale"
          >
            {Math.round(scaleMultiplier * 100)}%
          </button>
        </div>
      )}

      {compact && (
        <div className="flex items-center gap-1.5 -mt-0.5">
          {iconBtn(
            moveAsOne,
            () => onMoveAsOneChange(!moveAsOne),
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" /><polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
            </svg>,
            "When ON, dragging the map moves your buildings with it",
            moveAsOne ? "Linked" : "Move all",
          )}
        </div>
      )}

      {/* Done — locks the map (so subsequent taps don't accidentally drag
          it) and tells the parent to collapse this panel. Same UX as the
          mobile MobileMapBar Done flow. */}
      {onDone && (
        <button
          type="button"
          onClick={onDone}
          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gold text-gray-900 text-[12px] font-extrabold shadow-sm hover:brightness-110 active:brightness-95 transition-all"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Done — lock map &amp; continue
        </button>
      )}
    </div>
  );
}
