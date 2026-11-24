import { ArrowRight, ShieldAlert, X } from 'lucide-react';
import { motion } from 'motion/react';
import { GUIDING_QUESTION, TimelineEvent } from '../data/timelineData';

export interface OverviewPinPoint {
  x: number;
  y: number;
  col: number;
  row: number;
}

export interface OverviewCellRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OverviewCausalArrow {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  kind: 'cause' | 'effect';
}

interface OverviewPinboardDecorProps {
  isOverview: boolean;
  eventsCount: number;
  stageWidth: number;
  stageHeight: number;
  overviewPins: OverviewPinPoint[];
  institutionCellRect: OverviewCellRect;
  causalArrows?: OverviewCausalArrow[];
  highlightedCausalEvent?: TimelineEvent | null;
  onClearCausalHighlight?: () => void;
  onSelectInstitution: () => void;
  onResumeTimeline: () => void;
}

const ZOOM_EASE = [0.22, 1, 0.36, 1] as const;

function buildOverviewPixelThreadPath(pins: OverviewPinPoint[]): string {
  if (pins.length <= 1) return '';
  let d = `M ${pins[0].x} ${pins[0].y}`;
  for (let i = 0; i < pins.length - 1; i++) {
    const p0 = pins[i];
    const p1 = pins[i + 1];
    if (p0.row === p1.row) {
      const midX = (p0.x + p1.x) / 2;
      const sagY = Math.max(p0.y, p1.y) + (i % 2 === 0 ? 11 : 7);
      d += ` Q ${midX} ${sagY}, ${p1.x} ${p1.y}`;
    } else {
      // Gentle wrap back cleanly across the row gap to the start of the next row
      const gutterY = p0.y + (p1.y - p0.y) * 0.72;
      const midBoardX = (p0.x + p1.x) / 2;
      d += ` C ${p0.x + 24} ${p0.y + 42}, ${p0.x - 16} ${gutterY}, ${midBoardX} ${gutterY}`;
      d += ` C ${p1.x + 16} ${gutterY}, ${p1.x - 24} ${p1.y - 22}, ${p1.x} ${p1.y}`;
    }
  }
  return d;
}

function buildCausalCurvePath(arrow: OverviewCausalArrow): string {
  const dx = arrow.toX - arrow.fromX;
  const dy = arrow.toY - arrow.fromY;
  const dist = Math.hypot(dx, dy);
  const lift = Math.min(64, Math.max(22, dist * 0.22));
  const midX = (arrow.fromX + arrow.toX) / 2;
  const midY = (arrow.fromY + arrow.toY) / 2 - lift;
  return `M ${arrow.fromX} ${arrow.fromY} Q ${midX} ${midY}, ${arrow.toX} ${arrow.toY}`;
}

export function OverviewPinboardDecor({
  isOverview,
  eventsCount,
  stageWidth,
  stageHeight,
  overviewPins,
  institutionCellRect,
  causalArrows = [],
  highlightedCausalEvent = null,
  onClearCausalHighlight,
  onSelectInstitution,
  onResumeTimeline,
}: OverviewPinboardDecorProps) {
  const threadPath = buildOverviewPixelThreadPath(overviewPins);
  const hasCausalFocus = Boolean(highlightedCausalEvent && causalArrows.length > 0);

  return (
    <>
      {/* Serpentine Red Thread Behind Overview Grid */}
      {stageWidth > 0 && stageHeight > 0 && threadPath && (
        <motion.svg
          aria-hidden="true"
          initial={false}
          animate={{ opacity: isOverview ? (hasCausalFocus ? 0.25 : 0.88) : 0 }}
          transition={{ duration: 0.42, ease: ZOOM_EASE }}
          viewBox={`0 0 ${stageWidth} ${stageHeight}`}
          className="pointer-events-none select-none absolute inset-0 w-full h-full z-[5] overflow-visible"
        >
          <path
            d={threadPath}
            fill="none"
            stroke="rgba(42,22,6,0.2)"
            strokeWidth="3.2"
            transform="translate(1, 2.5)"
          />
          <path
            d={threadPath}
            fill="none"
            stroke="#9E2424"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        </motion.svg>
      )}

      {/* Causal Cause -> Focus -> Effect Arrows Layer in Overview */}
      {isOverview && stageWidth > 0 && stageHeight > 0 && causalArrows.length > 0 && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${stageWidth} ${stageHeight}`}
          className="pointer-events-none select-none absolute inset-0 w-full h-full z-[26] overflow-visible"
        >
          <defs>
            <marker
              id="causal-arrow-cause"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#2C4E84" />
            </marker>
            <marker
              id="causal-arrow-effect"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#9E2424" />
            </marker>
          </defs>
          {causalArrows.map((arrow) => (
            <path
              key={arrow.id}
              d={buildCausalCurvePath(arrow)}
              fill="none"
              stroke={arrow.kind === 'cause' ? '#2C4E84' : '#9E2424'}
              strokeWidth="2.4"
              strokeDasharray={arrow.kind === 'cause' ? '5 3' : undefined}
              strokeLinecap="round"
              markerEnd={
                arrow.kind === 'cause'
                  ? 'url(#causal-arrow-cause)'
                  : 'url(#causal-arrow-effect)'
              }
            />
          ))}
        </svg>
      )}

      {/* Top Overview Banner (slides smoothly upward above frame when zooming in) */}
      <motion.div
        initial={false}
        animate={{
          y: isOverview ? 0 : -110,
          opacity: isOverview ? 1 : 0,
        }}
        transition={{ duration: 0.55, ease: ZOOM_EASE }}
        style={{ pointerEvents: isOverview ? 'auto' : 'none' }}
        aria-hidden={!isOverview}
        className="absolute top-2.5 sm:top-3.5 inset-x-3 sm:inset-x-5 lg:inset-x-6 z-30 flex justify-center"
      >
        <div className="relative w-full max-w-[1180px] notepaper-sheet border border-[#A69070] px-4 sm:px-6 py-2 sm:py-2.5 shadow-[4px_8px_20px_rgba(38,20,6,0.36)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span
            aria-hidden="true"
            className="masking-tape w-12 h-3 -rotate-12 absolute -top-1.5 -left-2.5"
          />
          <span
            aria-hidden="true"
            className="masking-tape w-12 h-3 rotate-12 absolute -top-1.5 -right-2.5"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#9E2424] font-semibold">
                Gesamtübersicht · {eventsCount} Stationen &amp; 3 Bilanzen
              </span>
              <span className="hidden md:inline font-mono text-[10px] text-[#2C4E84]">
                · Kachel anklicken zum Reinzoomen
              </span>
            </div>
            <h1 className="font-serif text-base sm:text-xl lg:text-2xl font-bold text-[#173668] leading-tight truncate">
              Einrichtung und Sicherung der NS-Diktatur (1933–1934)
            </h1>
            <p className="font-serif italic text-[11px] sm:text-xs text-[#284B82] truncate">
              Leitfrage: „{GUIDING_QUESTION}“
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            {highlightedCausalEvent && onClearCausalHighlight && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClearCausalHighlight();
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF4E6] hover:bg-white text-[#173668] font-mono text-[11px] border border-[#2C4E84] hover:border-[#9E2424] transition-colors cursor-pointer touch-manipulation whitespace-nowrap"
              >
                <span>Kette: {highlightedCausalEvent.shortDate}</span>
                <X className="w-3.5 h-3.5 text-[#9E2424]" />
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onResumeTimeline();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#9E2424] hover:bg-[#821B1B] text-[#FAF4E6] font-mono text-[11px] font-medium border border-[#681212] shadow-xs transition-colors cursor-pointer touch-manipulation whitespace-nowrap"
            >
              <span>Zum Zeitstrahl</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Slot 28: Institutionen-Wandel Card that Morphs directly into InstitutionsMap via layoutId */}
      {isOverview && institutionCellRect.width > 0 && (
        <motion.button
          layoutId="institutions-board"
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectInstitution();
          }}
          transition={{
            layout: { duration: 0.82, ease: ZOOM_EASE },
          }}
          style={{
            position: 'absolute',
            left: institutionCellRect.x,
            top: institutionCellRect.y,
            width: institutionCellRect.width,
            height: institutionCellRect.height,
          }}
          className="z-[25] group bg-[#EFE0CA] border border-[#8F6840] hover:border-[#9E2424] px-2.5 py-2 flex flex-col justify-between text-left shadow-[2px_5px_12px_rgba(38,20,6,0.28)] hover:shadow-[4px_10px_20px_rgba(38,20,6,0.4)] cursor-pointer touch-manipulation"
        >
          <span
            aria-hidden="true"
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#173668] border border-[#0E2244] shadow-xs"
          />
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="font-mono text-[9.5px] xl:text-[10px] uppercase tracking-wider font-semibold text-[#9E2424] truncate">
                Institutionen-Wandel
              </span>
              <ShieldAlert className="w-3 h-3 text-[#9E2424] shrink-0" />
            </div>
            <p className="mt-1 font-serif text-[11px] xl:text-xs font-bold text-[#173668] leading-snug line-clamp-2">
              9 Weimarer Organe vs. 5 NS-Organe
            </p>
            <p className="hidden xl:block mt-0.5 text-[10px] text-[#284B82] leading-tight line-clamp-2">
              Live-Bilanz auf der Pinwand unter dem Zeitstrahl
            </p>
          </div>
          <div className="mt-1 pt-1 border-t border-[#CBB697] flex items-center justify-between text-[9.5px] font-mono text-[#2C4E84]">
            <span>Bilanz öffnen</span>
            <span className="text-[#9E2424] shrink-0">→</span>
          </div>
        </motion.button>
      )}
    </>
  );
}
