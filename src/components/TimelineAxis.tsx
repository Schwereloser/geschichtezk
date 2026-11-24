import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, LayoutGrid, X } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import corkTextureImg from '../assets/images/cork_board_texture_1794846395588.jpg';
import {
  BOARD_GLOSSARY_NOTES,
  ContextualBoardPhoto,
  ContextualGlossaryNote,
  GUIDING_QUESTION,
  LEFT_BOARD_PHOTOS,
  PHASES,
  PhaseId,
  RIGHT_BOARD_PHOTOS,
  TimelineEvent,
} from '../data/timelineData';
import {
  ConclusionCheckNote,
  ConclusionCompareNote,
  ConclusionPillarsNote,
} from './ConclusionNoteCards';
import { FlankingGlossaryNote } from './FlankingGlossaryNote';
import { FlankingPinboardPhoto } from './FlankingPinboardPhoto';
import { CausalRole, FoldableNoteCard } from './FoldableNoteCard';
import { InstitutionsMap } from './InstitutionsMap';
import {
  OverviewCausalArrow,
  OverviewCellRect,
  OverviewPinboardDecor,
  OverviewPinPoint,
} from './OverviewPinboardDecor';

export type IntroStage =
  | 'overview'
  | 'zoomCenter'
  | 'panToStart'
  | 'zoomTarget'
  | 'ready';

interface TimelineAxisProps {
  events: TimelineEvent[];
  focusedIndex: number;
  minIndex: number;
  maxIndex: number;
  visibleCount: number;
  expandedIds: string[];
  introStage: IntroStage;
  highlightedCausalEventId: string | null;
  causalOriginEventId: string | null;
  onSkipIntro: () => void;
  onOpenOverview: () => void;
  onSelectOverviewSlot: (slotIndex: number) => void;
  onResumeFromOverview: () => void;
  onToggleExpand: (id: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onCenterIndex: (index: number) => void;
  onJumpToPhase: (phaseId: PhaseId) => void;
  onJumpToConclusion: () => void;
  onJumpToEvent: (eventId: string) => void;
  onJumpCausal: (fromEventId: string, targetEventId: string) => void;
  onReturnCausal: () => void;
  onToggleCausalHighlight: (eventId: string, openOverview?: boolean) => void;
  onClearCausalHighlight: () => void;
}

// Subtle vertical pin stagger (in px) so Notizzettel feel naturally pinned by hand
const PIN_STAGGER_PX = [
  2, 8, 3, 10, 1, 7, 4, 10, 2, 9, 1, 9, 5, 2, 8, 3, 10, 3, 7, 5, 9, 3,
];

// Gentle asymmetric sag between pushpins so the main red thread stays visible between cards
const MAIN_THREAD_SAG_PX = [
  11, 18, 9, 20, 13, 16, 10, 19, 12, 17, 9, 20, 14, 11, 18, 10, 19, 12, 17, 13,
  16,
];

interface PinCoord {
  x: number;
  y: number;
}

function buildMainTimelineThreadPath(pins: PinCoord[]): string {
  if (pins.length === 0) return '';
  const first = pins[0];
  let d = `M -120 ${first.y + 14} Q ${first.x - 85} ${first.y + 18}, ${first.x} ${first.y}`;

  for (let i = 0; i < pins.length - 1; i++) {
    const p0 = pins[i];
    const p1 = pins[i + 1];
    const baseSag = MAIN_THREAD_SAG_PX[i % MAIN_THREAD_SAG_PX.length] ?? 14;
    const spanScale = Math.max(1, (p1.x - p0.x) / 100);
    const sag = Math.round(baseSag * (1 + (spanScale - 1) * 0.25));
    const midX = (p0.x + p1.x) / 2 + (i % 2 === 0 ? -4 : 4);
    const ctrlY = Math.max(p0.y, p1.y) + sag;
    d += ` Q ${midX} ${ctrlY}, ${p1.x} ${p1.y}`;
  }

  const last = pins[pins.length - 1];
  d += ` Q ${last.x + 85} ${last.y + 18}, ${last.x + 170} ${last.y + 10}`;
  return d;
}

export function TimelineAxis({
  events,
  focusedIndex,
  minIndex,
  maxIndex,
  visibleCount,
  expandedIds,
  introStage,
  highlightedCausalEventId,
  causalOriginEventId,
  onSkipIntro,
  onOpenOverview,
  onSelectOverviewSlot,
  onResumeFromOverview,
  onToggleExpand,
  onPrev,
  onNext,
  onCenterIndex,
  onJumpToPhase,
  onJumpToConclusion,
  onJumpToEvent,
  onJumpCausal,
  onReturnCausal,
  onToggleCausalHighlight,
  onClearCausalHighlight,
}: TimelineAxisProps) {
  const stageRef = useRef<HTMLElement | null>(null);
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>(
    () => {
      if (typeof window !== 'undefined') {
        return {
          width: Math.max(320, window.innerWidth - 20),
          height: Math.max(400, window.innerHeight - 20),
        };
      }
      return { width: 1200, height: 720 };
    }
  );

  const [selectedPhoto, setSelectedPhoto] =
    useState<ContextualBoardPhoto | null>(null);
  const [selectedGlossaryNote, setSelectedGlossaryNote] =
    useState<ContextualGlossaryNote | null>(null);
  const [institutionsCompact, setInstitutionsCompact] = useState(false);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setStageSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedPhoto && !selectedGlossaryNote) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
        setSelectedGlossaryNote(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedPhoto, selectedGlossaryNote]);

  const isOverview = introStage === 'overview';
  const showControls = introStage === 'ready';

  const conclusionStartIndex = events.length;
  const conclusionUnitWidth = visibleCount === 3 ? 2 : 1;
  const visibleUnits = visibleCount;
  const totalUnits = events.length + 3 * conclusionUnitWidth;

  const eventSlots = events.map((_, i) => ({
    unitStart: i,
    unitWidth: 1,
    unitCenter: i + 0.5,
  }));

  const conclusionSlots = [0, 1, 2].map((j) => {
    const unitStart = events.length + j * conclusionUnitWidth;
    return {
      unitStart,
      unitWidth: conclusionUnitWidth,
      unitCenter: unitStart + conclusionUnitWidth / 2,
    };
  });

  const allSlots = [...eventSlots, ...conclusionSlots];
  const centerIndex = Math.max(0, Math.min(allSlots.length - 1, focusedIndex));
  const activeSlot = allSlots[centerIndex] ?? allSlots[0];

  const viewportLeftUnit =
    visibleCount === 3
      ? activeSlot.unitCenter - visibleUnits / 2
      : activeSlot.unitStart;
  const viewportRightUnit = viewportLeftUnit + visibleUnits;

  const isInConclusionZone = !isOverview && centerIndex >= conclusionStartIndex;
  const isConclusionVisible =
    !isOverview &&
    (conclusionSlots[0]?.unitStart ?? events.length) < viewportRightUnit - 0.05;
  const conclusionLabels = [
    'Vorher / Nachher (1933)',
    'Die 3 Säulen der Macht',
    'Kurzer Ankreuz-Check',
  ] as const;
  const conclusionOffset = Math.max(
    0,
    Math.min(2, centerIndex - conclusionStartIndex)
  );
  const activeConclusionLabel = conclusionLabels[conclusionOffset];

  const centerEvent =
    centerIndex < events.length ? events[centerIndex] : undefined;

  const visibleEvents = events.filter((_, idx) => {
    const slot = eventSlots[idx];
    return (
      slot.unitStart + slot.unitWidth > viewportLeftUnit + 0.05 &&
      slot.unitStart < viewportRightUnit - 0.05
    );
  });

  const activePhase = centerEvent
    ? PHASES.find((p) => p.id === centerEvent.phaseId)
    : undefined;

  const phaseById = new Map(PHASES.map((p) => [p.id, p]));
  const eventById = new Map(events.map((ev) => [ev.id, ev]));
  const eventIndexById = new Map(events.map((ev, idx) => [ev.id, idx]));

  const highlightedCausalEvent = highlightedCausalEventId
    ? eventById.get(highlightedCausalEventId) ?? null
    : null;
  const causalCauseIds = new Set(
    highlightedCausalEvent?.causalLinks.causes.map((c) => c.targetEventId) ?? []
  );
  const causalEffectIds = new Set(
    highlightedCausalEvent?.causalLinks.effects.map((e) => e.targetEventId) ??
      []
  );
  const causalReturnEvent = causalOriginEventId
    ? eventById.get(causalOriginEventId) ?? null
    : null;

  const hasExpandedTimelineCard =
    !isOverview &&
    !isInConclusionZone &&
    visibleEvents.some((ev) => expandedIds.includes(ev.id));

  const glossaryHintByIndex = new Map<number, string>();
  for (const slot of BOARD_GLOSSARY_NOTES) {
    for (let idx = slot.minIndex; idx <= slot.maxIndex; idx++) {
      if (!glossaryHintByIndex.has(idx)) {
        glossaryHintByIndex.set(idx, `Begriff: ${slot.note.term}`);
      }
    }
  }

  const leftSlotMatch = !isConclusionVisible
    ? LEFT_BOARD_PHOTOS.find(
        (slot) => centerIndex >= slot.minIndex && centerIndex <= slot.maxIndex
      )
    : undefined;
  const rightSlotMatch = !isConclusionVisible
    ? RIGHT_BOARD_PHOTOS.find(
        (slot) => centerIndex >= slot.minIndex && centerIndex <= slot.maxIndex
      )
    : undefined;

  const leftGlossaryMatch = !isConclusionVisible
    ? BOARD_GLOSSARY_NOTES.find(
        (slot) =>
          slot.side === 'left' &&
          centerIndex >= slot.minIndex &&
          centerIndex <= slot.maxIndex
      )
    : undefined;
  const rightGlossaryMatch = !isConclusionVisible
    ? BOARD_GLOSSARY_NOTES.find(
        (slot) =>
          slot.side === 'right' &&
          centerIndex >= slot.minIndex &&
          centerIndex <= slot.maxIndex
      )
    : undefined;

  const leftSlotEvent =
    visibleCount === 3 && centerIndex > 0 && centerIndex - 1 < events.length
      ? events[centerIndex - 1]
      : undefined;
  const rightSlotEvent =
    visibleCount === 3 && centerIndex + 1 < events.length
      ? events[centerIndex + 1]
      : undefined;

  const leftPhoto =
    showControls &&
    !isConclusionVisible &&
    leftSlotMatch &&
    !(leftSlotEvent && expandedIds.includes(leftSlotEvent.id))
      ? leftSlotMatch.photo
      : null;

  const rightPhoto =
    showControls &&
    !isConclusionVisible &&
    rightSlotMatch &&
    !(rightSlotEvent && expandedIds.includes(rightSlotEvent.id))
      ? rightSlotMatch.photo
      : null;

  const leftGlossaryNote =
    showControls &&
    !isConclusionVisible &&
    leftGlossaryMatch &&
    !(leftSlotEvent && expandedIds.includes(leftSlotEvent.id))
      ? leftGlossaryMatch.note
      : null;

  const rightGlossaryNote =
    showControls &&
    !isConclusionVisible &&
    rightGlossaryMatch &&
    !(rightSlotEvent && expandedIds.includes(rightSlotEvent.id))
      ? rightGlossaryMatch.note
      : null;

  const activeGlossaryNotesCompact = [leftGlossaryNote, rightGlossaryNote].filter(
    (n): n is ContextualGlossaryNote => Boolean(n)
  );

  const hasPrev = centerIndex > minIndex;
  const hasNext = centerIndex < maxIndex;

  // Compute exact pixel rects for BOTH Overview Grid (28 cells) AND Timeline Track (27 slots)
  const { width: stageW, height: stageH } = stageSize;

  // Overview grid geometry
  const ovPadX = stageW >= 640 ? 22 : 10;
  const ovBannerH = stageW >= 640 ? 94 : 114;
  const ovPadBottom = stageW >= 640 ? 16 : 10;
  const ovGap = stageW >= 1024 ? 12 : stageW >= 640 ? 9 : 6;
  const ovCols = stageW >= 900 ? 7 : stageW >= 600 ? 5 : 4;
  const ovRows = Math.ceil(28 / ovCols);
  const ovGridW = Math.max(240, stageW - ovPadX * 2);
  const ovGridH = Math.max(200, stageH - ovBannerH - ovPadBottom);
  const ovCellW = (ovGridW - ovGap * (ovCols - 1)) / ovCols;
  const ovCellH = (ovGridH - ovGap * (ovRows - 1)) / ovRows;

  const overviewRects: OverviewCellRect[] = Array.from(
    { length: 28 },
    (_, i) => {
      const col = i % ovCols;
      const row = Math.floor(i / ovCols);
      return {
        x: ovPadX + col * (ovCellW + ovGap),
        y: ovBannerH + row * (ovCellH + ovGap),
        width: ovCellW,
        height: ovCellH,
      };
    }
  );

  const overviewPins: OverviewPinPoint[] = allSlots.map((_, i) => {
    const rect = overviewRects[i];
    return {
      x: rect.x + rect.width / 2,
      y: rect.y + 2,
      col: i % ovCols,
      row: Math.floor(i / ovCols),
    };
  });

  const overviewCausalArrows: OverviewCausalArrow[] = [];
  if (highlightedCausalEvent) {
    const focusIdx = eventIndexById.get(highlightedCausalEvent.id);
    if (focusIdx !== undefined && overviewPins[focusIdx]) {
      const focusPin = overviewPins[focusIdx];
      for (const cause of highlightedCausalEvent.causalLinks.causes) {
        const cIdx = eventIndexById.get(cause.targetEventId);
        if (cIdx !== undefined && overviewPins[cIdx]) {
          overviewCausalArrows.push({
            id: `cause-${cause.targetEventId}-${highlightedCausalEvent.id}`,
            fromX: overviewPins[cIdx].x,
            fromY: overviewPins[cIdx].y + 8,
            toX: focusPin.x,
            toY: focusPin.y + 8,
            kind: 'cause',
          });
        }
      }
      for (const effect of highlightedCausalEvent.causalLinks.effects) {
        const eIdx = eventIndexById.get(effect.targetEventId);
        if (eIdx !== undefined && overviewPins[eIdx]) {
          overviewCausalArrows.push({
            id: `effect-${highlightedCausalEvent.id}-${effect.targetEventId}`,
            fromX: focusPin.x,
            fromY: focusPin.y + 8,
            toX: overviewPins[eIdx].x,
            toY: overviewPins[eIdx].y + 8,
            kind: 'effect',
          });
        }
      }
    }
  }

  const institutionCellRect = overviewRects[27];

  // Timeline horizontal track geometry
  const tlSidePad = stageW >= 640 ? 40 : 36;
  const tlTopBarH = 62;
  const tlBottomBarH = 38;
  const tlTopGap = 16;
  const tlUsableW = Math.max(220, stageW - tlSidePad * 2);
  const tlSlotUnitW = tlUsableW / visibleUnits;
  const tlInnerGap = stageW >= 1024 ? 12 : stageW >= 640 ? 8 : 4;
  const tlTrackMaxH = Math.max(
    220,
    stageH - tlTopBarH - tlBottomBarH - tlTopGap - 14
  );

  const minViewportLeftUnit = visibleCount === 3 ? 0.5 - visibleUnits / 2 : 0;
  const centerZoomLeftUnit = (totalUnits - visibleUnits) / 2;

  const activeViewportLeftUnit =
    introStage === 'zoomCenter'
      ? centerZoomLeftUnit
      : introStage === 'panToStart'
      ? minViewportLeftUnit
      : viewportLeftUnit;

  const threadTrackX = tlSidePad - activeViewportLeftUnit * tlSlotUnitW;
  const threadTrackWidth = totalUnits * tlSlotUnitW;

  const pinCoords: PinCoord[] = allSlots.map((slot, idx) => ({
    x: slot.unitCenter * 100,
    y: (PIN_STAGGER_PX[idx % PIN_STAGGER_PX.length] ?? 4) + 10,
  }));
  const mainThreadPath = buildMainTimelineThreadPath(pinCoords);

  const isMorphingStage =
    introStage === 'overview' ||
    introStage === 'zoomCenter' ||
    introStage === 'zoomTarget';

  const cardMotionTransition = isMorphingStage
    ? {
        duration: 0.82,
        ease: [0.22, 1, 0.36, 1] as const,
      }
    : introStage === 'panToStart'
    ? {
        duration: 1.25,
        ease: [0.32, 0.04, 0.24, 1] as const,
      }
    : {
        x: { type: 'spring' as const, stiffness: 255, damping: 30, mass: 0.88 },
        y: { type: 'spring' as const, stiffness: 255, damping: 30 },
        width: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
        height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
        rotate: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
      };

  const threadXTransition =
    introStage === 'zoomCenter'
      ? { duration: 0.82, ease: [0.22, 1, 0.36, 1] as const }
      : introStage === 'panToStart'
      ? { duration: 1.25, ease: [0.32, 0.04, 0.24, 1] as const }
      : introStage === 'zoomTarget' || introStage === 'overview'
      ? { duration: 0.82, ease: [0.22, 1, 0.36, 1] as const }
      : { type: 'spring' as const, stiffness: 255, damping: 30, mass: 0.88 };

  return (
    <LayoutGroup>
      <section
        ref={stageRef}
        aria-label="Papier-Zeitstrahl"
        onClick={
          isOverview
            ? onResumeFromOverview
            : introStage !== 'ready'
            ? onSkipIntro
            : undefined
        }
        className={`relative flex-1 min-h-0 flex flex-col cork-pinboard-bg overflow-hidden ${
          showControls
            ? 'border border-[#7E542B] shadow-[inset_0_4px_16px_rgba(48,26,8,0.45)]'
            : 'cursor-pointer shadow-[inset_0_4px_16px_rgba(48,26,8,0.4)]'
        }`}
      >
        {/* Low-Opacity Natural Cork Photo Texture Layer */}
        <img
          src={corkTextureImg}
          alt=""
          aria-hidden="true"
          referrerPolicy="no-referrer"
          className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover opacity-[0.34] mix-blend-multiply z-0"
        />

        {/* Overview Banner, Dynamic Overview Serpentine Thread, Causal Arrows & Morphing Institutionen Card */}
        <OverviewPinboardDecor
          isOverview={isOverview}
          eventsCount={events.length}
          stageWidth={stageW}
          stageHeight={stageH}
          overviewPins={overviewPins}
          institutionCellRect={institutionCellRect}
          causalArrows={overviewCausalArrows}
          highlightedCausalEvent={highlightedCausalEvent}
          onClearCausalHighlight={onClearCausalHighlight}
          onSelectInstitution={() => onSelectOverviewSlot(events.length)}
          onResumeTimeline={onResumeFromOverview}
        />

        {/* Top Pinboard Ledger Bar — slides down from behind top wooden frame when ready */}
        <motion.div
          initial={false}
          animate={{ y: showControls ? '0%' : '-110%' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: showControls ? 'auto' : 'none' }}
          className="absolute top-0 inset-x-0 h-[62px] z-40 px-3 sm:px-6 border-b border-[#8F6840] bg-[#DFCBB0]/95 shadow-[0_3px_10px_rgba(48,26,8,0.22)] flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <h1 className="font-serif text-base sm:text-xl font-semibold text-[#173668] leading-tight truncate">
              Einrichtung und Sicherung der NS-Diktatur (1933–1934)
            </h1>
            <p className="mt-0.5 text-[11px] font-mono text-[#2C4E84] tabular-nums truncate">
              {isInConclusionZone
                ? `Abschluss (${conclusionOffset + 1}/3) · ${activeConclusionLabel}`
                : `${
                    activePhase
                      ? `Phase ${activePhase.numberLabel}: ${activePhase.title}`
                      : ''
                  }${centerEvent ? ` · Fokus: ${centerEvent.dateLabel}` : ''}`}
            </p>
          </div>

          <div
            className="flex items-center gap-1.5 shrink-0 overflow-x-auto max-w-[65%]"
            role="navigation"
            aria-label="Phasen-Sprungmarken"
          >
            {PHASES.map((phase) => {
              const isActive =
                !isInConclusionZone && activePhase?.id === phase.id;
              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => onJumpToPhase(phase.id)}
                  className={`px-2 sm:px-2.5 py-1.5 text-[11px] font-mono transition-colors cursor-pointer touch-manipulation whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E2424] ${
                    isActive
                      ? 'bg-[#9E2424] text-[#FAF4E6] font-medium border border-[#681212] shadow-xs'
                      : 'notepaper-sheet text-[#173668] border border-[#B09B7C] hover:border-[#173668]'
                  }`}
                >
                  {phase.numberLabel}. {phase.periodLabel.split(' ')[0]}
                </button>
              );
            })}
            <button
              type="button"
              onClick={onJumpToConclusion}
              className={`px-2 sm:px-2.5 py-1.5 text-[11px] font-mono transition-colors cursor-pointer touch-manipulation whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E2424] ${
                isInConclusionZone
                  ? 'bg-[#9E2424] text-[#FAF4E6] font-medium border border-[#681212] shadow-xs'
                  : 'notepaper-sheet text-[#173668] border border-[#B09B7C] hover:border-[#173668]'
              }`}
            >
              Bilanz &amp; Check
            </button>
            {highlightedCausalEvent && (
              <button
                type="button"
                onClick={onClearCausalHighlight}
                title="Wirkungsketten-Markierung beenden"
                className="px-2 py-1.5 text-[11px] font-mono inline-flex items-center gap-1 bg-[#FAF4E6] text-[#9E2424] border border-[#9E2424] hover:bg-white transition-colors cursor-pointer touch-manipulation whitespace-nowrap shrink-0"
              >
                <span>Kette: {highlightedCausalEvent.shortDate}</span>
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              type="button"
              onClick={onOpenOverview}
              title="Gesamtübersicht öffnen"
              aria-label="Gesamtübersicht öffnen"
              className="w-7 h-7 sm:w-[30px] sm:h-[30px] inline-flex items-center justify-center notepaper-sheet text-[#173668] border border-[#B09B7C] hover:border-[#9E2424] hover:text-[#9E2424] transition-colors cursor-pointer touch-manipulation shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E2424]"
            >
              <LayoutGrid className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
        </motion.div>

        {/* Floating Circular Edge Arrows */}
        <motion.button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev || !showControls}
          initial={false}
          animate={{
            x: showControls ? 0 : -48,
            opacity: !showControls ? 0 : hasPrev ? 0.92 : 0.22,
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: showControls && hasPrev ? 'auto' : 'none' }}
          aria-label="Ein Datum zurück"
          className="absolute left-1 top-1/2 -translate-y-1/2 z-40 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-[#FAF4E6]/65 hover:bg-[#FAF4E6]/95 active:scale-95 border border-[#A89274]/45 hover:border-[#9E2424]/70 text-[#173668] hover:text-[#9E2424] shadow-[0_2px_8px_rgba(38,20,6,0.14)] backdrop-blur-[2px] transition-all cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E2424]"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
        </motion.button>

        <motion.button
          type="button"
          onClick={onNext}
          disabled={!hasNext || !showControls}
          initial={false}
          animate={{
            x: showControls ? 0 : 48,
            opacity: !showControls ? 0 : hasNext ? 0.92 : 0.22,
          }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: showControls && hasNext ? 'auto' : 'none' }}
          aria-label="Ein Datum weiter"
          className="absolute right-1 top-1/2 -translate-y-1/2 z-40 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-[#FAF4E6]/65 hover:bg-[#FAF4E6]/95 active:scale-95 border border-[#A89274]/45 hover:border-[#9E2424]/70 text-[#173668] hover:text-[#9E2424] shadow-[0_2px_8px_rgba(38,20,6,0.14)] backdrop-blur-[2px] transition-all cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E2424]"
        >
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
        </motion.button>

        {/* Compact Bottom Pinboard Strip */}
        <motion.div
          initial={false}
          animate={{ y: showControls ? '0%' : '110%' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ pointerEvents: showControls ? 'auto' : 'none' }}
          className="absolute bottom-0 inset-x-0 h-[38px] z-40 px-4 sm:px-6 border-t border-[#8F6840] bg-[#DFCBB0]/95 shadow-[0_-3px_10px_rgba(48,26,8,0.18)] flex items-center justify-between gap-2 text-xs text-[#173668]"
        >
          <p className="font-serif italic truncate">
            <span className="font-mono not-italic text-[10px] uppercase tracking-wider text-[#9E2424] mr-2">
              Leitfrage:
            </span>
            „{GUIDING_QUESTION}“
          </p>
          <span className="font-mono text-[11px] text-[#2C4E84] tabular-nums shrink-0">
            {isInConclusionZone || !centerEvent
              ? `Abschluss: ${conclusionOffset + 1}/3 · ${activeConclusionLabel}`
              : `Fokus: ${centerEvent.indexNumber}/${events.length} (${
                  visibleEvents[0]?.shortDate ?? ''
                }${
                  visibleEvents.length > 1
                    ? ` – ${visibleEvents[visibleEvents.length - 1]?.shortDate}`
                    : ''
                })`}
          </span>
        </motion.div>

        {/* Bottom InstitutionsMap Layer (z-[5], morphs via layoutId from Overview Slot 28!) */}
        <div className="pointer-events-none absolute inset-x-9 sm:inset-x-10 bottom-[48px] z-[5] flex items-end justify-center gap-2 xl:gap-5">
          <div
            aria-hidden="true"
            className="hidden min-[900px]:block w-[114px] lg:w-[124px] xl:w-[156px] shrink-0"
          />
          {!isOverview && centerEvent && !isInConclusionZone && (
            <div className="w-full min-w-0 max-w-[630px] xl:max-w-[740px] flex flex-col items-center">
              <InstitutionsMap
                centerEvent={centerEvent}
                isCompact={institutionsCompact}
                isFocusDimmed={hasExpandedTimelineCard}
                onToggleCompact={() => setInstitutionsCompact((v) => !v)}
              />
            </div>
          )}
          <div
            aria-hidden="true"
            className="hidden min-[900px]:block w-[114px] lg:w-[124px] xl:w-[156px] shrink-0"
          />
        </div>

        {/* Compact Glossary Term Buttons for Viewports < 900px (z-[24], clickable above stage) */}
        {showControls &&
          !isOverview &&
          !isInConclusionZone &&
          activeGlossaryNotesCompact.length > 0 && (
            <div className="min-[900px]:hidden pointer-events-none fixed inset-x-4 bottom-[48px] z-[24] flex justify-center">
              <div className="pointer-events-auto mb-2 flex flex-wrap justify-center gap-1.5">
                {activeGlossaryNotesCompact.map((note) => (
                  <button
                    key={note.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGlossaryNote(note);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F3E7C2] border border-[#BFA878] shadow-sm text-[11px] font-serif font-semibold text-[#173668] cursor-pointer touch-manipulation"
                  >
                    <BookOpen className="w-3 h-3 text-[#9E2424]" />
                    <span>Begriff: {note.term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        {/* Flanking Photos & Term Sticky-Notes Wings (z-[24], clean non-overlapping vertical stack) */}
        <div className="pointer-events-none absolute inset-x-9 sm:inset-x-10 bottom-[48px] z-[24] flex items-end justify-center gap-2 xl:gap-5">
          <div className="pointer-events-none hidden min-[900px]:flex flex-col items-center justify-end gap-3 w-[114px] lg:w-[124px] xl:w-[156px] shrink-0 pb-2">
            <FlankingPinboardPhoto
              photo={leftPhoto}
              side="left"
              onSelect={setSelectedPhoto}
            />
            <FlankingGlossaryNote
              note={leftGlossaryNote}
              side="left"
              onSelect={setSelectedGlossaryNote}
            />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none w-full min-w-0 max-w-[630px] xl:max-w-[740px]"
          />

          <div className="pointer-events-none hidden min-[900px]:flex flex-col items-center justify-end gap-3 w-[114px] lg:w-[124px] xl:w-[156px] shrink-0 pb-2">
            <FlankingPinboardPhoto
              photo={rightPhoto}
              side="right"
              onSelect={setSelectedPhoto}
            />
            <FlankingGlossaryNote
              note={rightGlossaryNote}
              side="right"
              onSelect={setSelectedGlossaryNote}
            />
          </div>
        </div>

        {/* Horizontal Main Red Thread Behind Timeline Pushpins (visible when not in overview) */}
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{
            x: threadTrackX,
            y: tlTopBarH + tlTopGap + (centerIndex % 2 === 0 ? 0 : 2),
            opacity: isOverview ? 0 : 1,
          }}
          transition={{
            x: threadXTransition,
            y: { type: 'spring', stiffness: 210, damping: 18 },
            opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
          }}
          style={{ width: threadTrackWidth, height: 60 }}
          className="pointer-events-none absolute top-0 left-0 z-[8] overflow-visible"
        >
          <svg
            viewBox={`0 0 ${totalUnits * 100} 60`}
            preserveAspectRatio="none"
            className="w-full h-full overflow-visible"
          >
            <path
              d={mainThreadPath}
              fill="none"
              stroke="rgba(55, 25, 10, 0.24)"
              strokeWidth="4.8"
              transform="translate(0, 3.5)"
            />
            <path
              d={mainThreadPath}
              fill="none"
              stroke="#9E2424"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* UNIFIED MORPHING CARD STAGE: Same 27 card components smoothly morph between 4x7 Overview and Horizontal Timeline */}
        <motion.div
          drag={showControls ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.08}
          onDragEnd={(_, info) => {
            if (!showControls) return;
            if (info.offset.x < -70 && hasNext) {
              onNext();
            } else if (info.offset.x > 70 && hasPrev) {
              onPrev();
            }
          }}
          className="pointer-events-none relative z-20 flex-1 min-h-0 w-full h-full"
        >
          {/* All 24 Historical Station Cards */}
          {events.map((event, idx) => {
            const isExpanded = !isOverview && expandedIds.includes(event.id);
            const phase = phaseById.get(event.phaseId);
            const slot = eventSlots[idx];
            const ovRect = overviewRects[idx];

            const isCurrentlyVisible =
              isOverview ||
              (slot.unitStart + slot.unitWidth > viewportLeftUnit + 0.05 &&
                slot.unitStart < viewportRightUnit - 0.05);
            const isCenterStation = !isOverview && idx === centerIndex;
            const pinStagger = PIN_STAGGER_PX[idx % PIN_STAGGER_PX.length] ?? 4;

            const tlX =
              tlSidePad +
              (slot.unitStart - activeViewportLeftUnit) * tlSlotUnitW +
              tlInnerGap / 2;
            const tlY = tlTopBarH + tlTopGap + pinStagger;
            const tlW = slot.unitWidth * tlSlotUnitW - tlInnerGap;
            const ovRotate =
              (idx % 2 === 0 ? -1 : 1) * ((idx % 3) * 0.35 + 0.35);

            const causalRole: CausalRole = !highlightedCausalEvent
              ? null
              : event.id === highlightedCausalEvent.id
              ? 'focus'
              : causalCauseIds.has(event.id)
              ? 'cause'
              : causalEffectIds.has(event.id)
              ? 'effect'
              : 'muted';

            return (
              <motion.div
                key={event.id}
                initial={false}
                animate={{
                  x: isOverview ? ovRect.x : tlX,
                  y: isOverview ? ovRect.y : tlY,
                  width: isOverview ? ovRect.width : tlW,
                  height: isOverview ? ovRect.height : 'auto',
                  rotate: isOverview ? ovRotate : 0,
                }}
                transition={cardMotionTransition}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  maxHeight: isOverview
                    ? undefined
                    : `${tlTrackMaxH - pinStagger}px`,
                  zIndex: isOverview ? 20 : isExpanded ? 30 : 20,
                }}
                className="pointer-events-auto flex flex-col items-center min-h-0"
              >
                {/* Red Pushpin (interactive center-trigger in timeline; pinned top tack in overview) */}
                <div className="shrink-0 flex flex-col items-center -mb-2 relative z-30">
                  {isOverview ? (
                    <span
                      aria-hidden="true"
                      className="w-3 h-3 rounded-full bg-[#9E2424] border border-[#681212] shadow-[0_2px_4px_rgba(30,15,5,0.45)] flex items-center justify-center"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#F5B7B7]/85 -translate-x-[0.5px] -translate-y-[0.5px]" />
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={!showControls}
                      tabIndex={isCurrentlyVisible && showControls ? 0 : -1}
                      onClick={() => onCenterIndex(idx)}
                      title={`${event.dateLabel} in den Fokus rücken`}
                      aria-label={`${event.dateLabel} in die Mitte rücken`}
                      className={`w-5 h-5 rounded-full bg-[#9E2424] border-2 flex items-center justify-center transition-transform cursor-pointer touch-manipulation ${
                        isCenterStation
                          ? 'border-[#FAF4E6] ring-2 ring-[#9E2424] scale-125 shadow-[0_4px_10px_rgba(158,36,36,0.5)]'
                          : 'border-[#681212] shadow-[0_3px_6px_rgba(30,15,5,0.4)] hover:scale-110'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5B7B7]/85 -translate-x-0.5 -translate-y-0.5" />
                    </button>
                  )}
                </div>

                <FoldableNoteCard
                  event={event}
                  phase={phase}
                  eventById={eventById}
                  isExpanded={isExpanded}
                  isCenter={isCenterStation && visibleCount === 3}
                  isOverview={isOverview}
                  showControls={showControls}
                  isCurrentlyVisible={isCurrentlyVisible}
                  maxCardHeight={Math.max(200, tlTrackMaxH - pinStagger - 12)}
                  overviewHint={glossaryHintByIndex.get(idx)}
                  causalRole={causalRole}
                  isCausalHighlighted={highlightedCausalEventId === event.id}
                  causalReturnEvent={
                    isCenterStation ? causalReturnEvent : null
                  }
                  onToggleExpand={onToggleExpand}
                  onOverviewSelect={() => onSelectOverviewSlot(idx)}
                  onJumpCausal={onJumpCausal}
                  onReturnCausal={onReturnCausal}
                  onToggleCausalHighlight={onToggleCausalHighlight}
                />
              </motion.div>
            );
          })}

          {/* 3 Double-Wide Conclusion Cards (slots 24..26, seamlessly morphing from Row 4 of Overview) */}
          {[
            {
              key: 'conclusion-compare',
              offset: 0,
              title: 'Vorher / Nachher (1933)',
              Component: ConclusionCompareNote,
            },
            {
              key: 'conclusion-pillars',
              offset: 1,
              title: 'Die 3 Säulen der Macht',
              Component: ConclusionPillarsNote,
            },
            {
              key: 'conclusion-check',
              offset: 2,
              title: 'Kurzer Ankreuz-Check',
              Component: ConclusionCheckNote,
            },
          ].map(({ key, offset, title, Component }) => {
            const idx = conclusionStartIndex + offset;
            const slot = conclusionSlots[offset];
            const ovRect = overviewRects[idx];
            const isSlotVisible =
              isOverview ||
              (slot.unitStart + slot.unitWidth > viewportLeftUnit + 0.05 &&
                slot.unitStart < viewportRightUnit - 0.05);
            const isSlotCentered = !isOverview && centerIndex === idx;
            const pinStagger = PIN_STAGGER_PX[idx % PIN_STAGGER_PX.length] ?? 4;

            const tlX =
              tlSidePad +
              (slot.unitStart - activeViewportLeftUnit) * tlSlotUnitW +
              tlInnerGap / 2;
            const tlY = tlTopBarH + tlTopGap + pinStagger;
            const tlW = slot.unitWidth * tlSlotUnitW - tlInnerGap;
            const ovRotate = offset % 2 === 0 ? 0.65 : -0.75;

            return (
              <motion.div
                key={key}
                initial={false}
                animate={{
                  x: isOverview ? ovRect.x : tlX,
                  y: isOverview ? ovRect.y : tlY,
                  width: isOverview ? ovRect.width : tlW,
                  height: isOverview
                    ? ovRect.height
                    : isInConclusionZone
                    ? Math.max(260, tlTrackMaxH - pinStagger)
                    : 'auto',
                  rotate: isOverview ? ovRotate : 0,
                }}
                transition={cardMotionTransition}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  maxHeight: isOverview
                    ? undefined
                    : `${tlTrackMaxH - pinStagger}px`,
                  zIndex: isOverview ? 20 : isInConclusionZone ? 25 : 20,
                }}
                className="pointer-events-auto flex flex-col items-center min-h-0"
              >
                <div className="shrink-0 flex flex-col items-center -mb-2 relative z-30">
                  {isOverview ? (
                    <span
                      aria-hidden="true"
                      className="w-3 h-3 rounded-full bg-[#9E2424] border border-[#681212] shadow-[0_2px_4px_rgba(30,15,5,0.45)] flex items-center justify-center"
                    >
                      <span className="w-1 h-1 rounded-full bg-[#F5B7B7]/85 -translate-x-[0.5px] -translate-y-[0.5px]" />
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={!showControls}
                      tabIndex={isSlotVisible && showControls ? 0 : -1}
                      onClick={() => onCenterIndex(idx)}
                      title={`${title} in den Fokus rücken`}
                      aria-label={`${title} in die Mitte rücken`}
                      className={`w-5 h-5 rounded-full bg-[#9E2424] border-2 flex items-center justify-center transition-transform cursor-pointer touch-manipulation ${
                        isSlotCentered
                          ? 'border-[#FAF4E6] ring-2 ring-[#9E2424] scale-125 shadow-[0_4px_10px_rgba(158,36,36,0.5)]'
                          : 'border-[#681212] shadow-[0_3px_6px_rgba(30,15,5,0.4)] hover:scale-110'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F5B7B7]/85 -translate-x-0.5 -translate-y-0.5" />
                    </button>
                  )}
                </div>

                <Component
                  isExpandedArea={isInConclusionZone}
                  isCentered={isSlotCentered}
                  isOverview={isOverview}
                  showControls={showControls}
                  isCurrentlyVisible={isSlotVisible}
                  onJumpToEvent={onJumpToEvent}
                  onFocusSelf={() =>
                    isOverview
                      ? onSelectOverviewSlot(idx)
                      : onCenterIndex(idx)
                  }
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enlarged Photo Lightbox with Historical Subtitle on Click */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              key={selectedPhoto.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setSelectedPhoto(null)}
              role="dialog"
              aria-modal="true"
              aria-label={selectedPhoto.caption}
              className="fixed inset-0 z-50 bg-[#231407]/60 backdrop-blur-[2px] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.88, rotate: -1.5, y: 12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 1, y: 8 }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
                className="relative notepaper-sheet border border-[#A69070] max-w-lg w-full px-3.5 pb-3.5 pt-11 sm:px-5 sm:pb-5 sm:pt-12 shadow-[0_24px_56px_-10px_rgba(20,10,2,0.7)]"
              >
                {selectedPhoto.fastener === 'pin' ? (
                  <span
                    aria-hidden="true"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#9E2424] border-2 border-[#681212] shadow-sm"
                  />
                ) : (
                  <>
                    <span
                      aria-hidden="true"
                      className="masking-tape w-14 h-3.5 -rotate-12 absolute -top-2 -left-3"
                    />
                    <span
                      aria-hidden="true"
                      className="masking-tape w-14 h-3.5 rotate-12 absolute -top-2 -right-3"
                    />
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedPhoto(null)}
                  aria-label="Bild schließen"
                  className="absolute top-2.5 right-3.5 z-20 w-7 h-7 rounded-full flex items-center justify-center bg-[#FAF4E6]/95 border border-[#B8A58B] text-[#173668] hover:text-[#9E2424] hover:border-[#9E2424] cursor-pointer touch-manipulation"
                >
                  <X className="w-4 h-4" />
                </button>

                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.caption}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (
                      selectedPhoto.fallbackSrc &&
                      img.src !== selectedPhoto.fallbackSrc
                    ) {
                      img.src = selectedPhoto.fallbackSrc;
                    }
                  }}
                  className="w-full max-h-[55vh] aspect-[4/3] object-cover sepia-[0.28] grayscale-[0.15] contrast-[1.05] border border-[#D4C7B2]"
                />

                <div className="mt-3 pt-2.5 border-t border-[#D6CBBA]">
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-[#9E2424] font-semibold">
                      {selectedPhoto.dateLabel}
                    </p>
                    {selectedPhoto.sourceCredit && (
                      <span className="font-mono text-[10px] text-[#2C4E84]">
                        {selectedPhoto.sourceCredit}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-0.5 font-serif text-base sm:text-lg font-bold text-[#173668] leading-snug">
                    {selectedPhoto.caption}
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#173668] leading-relaxed">
                    {selectedPhoto.subtitle}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contextual Term Explanation Modal on Click */}
        <AnimatePresence>
          {selectedGlossaryNote && (
            <motion.div
              key={selectedGlossaryNote.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedGlossaryNote(null)}
              role="dialog"
              aria-modal="true"
              aria-label={`Begriffserklärung: ${selectedGlossaryNote.term}`}
              className="fixed inset-0 z-50 bg-[#231407]/55 backdrop-blur-[2px] flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.88, rotate: -1.5, y: 12 }}
                animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotate: 1, y: 8 }}
                transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
                className="relative bg-[#F3E7C2] border border-[#BFA878] max-w-md w-full px-5 pb-5 pt-11 shadow-[0_24px_56px_-10px_rgba(20,10,2,0.68)]"
              >
                {selectedGlossaryNote.fastener === 'pin' ? (
                  <span
                    aria-hidden="true"
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#9E2424] border-2 border-[#681212] shadow-sm"
                  />
                ) : (
                  <>
                    <span
                      aria-hidden="true"
                      className="masking-tape w-12 h-3 -rotate-12 absolute -top-1.5 -left-2.5"
                    />
                    <span
                      aria-hidden="true"
                      className="masking-tape w-12 h-3 rotate-12 absolute -top-1.5 -right-2.5"
                    />
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedGlossaryNote(null)}
                  aria-label="Begriffserklärung schließen"
                  className="absolute top-2.5 right-3.5 z-20 w-7 h-7 rounded-full flex items-center justify-center bg-[#FAF4E6]/95 border border-[#B8A58B] text-[#173668] hover:text-[#9E2424] hover:border-[#9E2424] cursor-pointer touch-manipulation"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#D2BE92]">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#9E2424] font-semibold">
                    Begriff · {selectedGlossaryNote.shortTag}
                  </span>
                  <BookOpen className="w-4 h-4 text-[#2C4E84] shrink-0" />
                </div>

                <h3 className="mt-2.5 font-serif text-xl font-bold text-[#173668] leading-snug">
                  {selectedGlossaryNote.term}
                </h3>
                <p className="mt-1 font-mono text-[11px] text-[#2C4E84]">
                  {selectedGlossaryNote.eventLabel}
                </p>

                <p className="mt-3 bg-[#FAF4E6]/85 border border-[#D2BE92] px-3.5 py-3 text-xs sm:text-sm text-[#173668] leading-relaxed">
                  {selectedGlossaryNote.definition}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </LayoutGroup>
  );
}
