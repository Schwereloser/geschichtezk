import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import corkTextureImg from '../assets/images/cork_board_texture_1794846395588.jpg';
import {
  ARCHIVAL_IMAGES,
  GUIDING_QUESTION,
  PHASES,
  PhaseId,
  TimelineEvent,
} from '../data/timelineData';
import { FoldableNoteCard } from './FoldableNoteCard';
import { InstitutionsMap } from './InstitutionsMap';
import { OverviewPinboardDecor } from './OverviewPinboardDecor';

export type IntroStage = 'overview' | 'zoomCenter' | 'panToStart' | 'ready';

interface TimelineAxisProps {
  events: TimelineEvent[];
  startIndex: number;
  minStartIndex: number;
  maxStartIndex: number;
  visibleCount: number;
  expandedIds: string[];
  introStage: IntroStage;
  onSkipIntro: () => void;
  onToggleExpand: (id: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onCenterIndex: (index: number) => void;
  onJumpToPhase: (phaseId: PhaseId) => void;
}

interface PinnedPhotoPair {
  leftSrc: string;
  leftCaption: string;
  rightSrc: string;
  rightCaption: string;
}

const PHASE_PINNED_PHOTOS: Record<PhaseId, PinnedPhotoPair> = {
  'phase-1': {
    leftSrc: ARCHIVAL_IMAGES.reichstag,
    leftCaption: 'Berlin · Reichstag, Jan/Feb 1933',
    rightSrc: ARCHIVAL_IMAGES.decree,
    rightCaption: 'Notverordnungen · Feb 1933',
  },
  'phase-2': {
    leftSrc: ARCHIVAL_IMAGES.parliament,
    leftCaption: 'Krolloper · Ermächtigung, Mär 1933',
    rightSrc: ARCHIVAL_IMAGES.decree,
    rightCaption: 'Gleichschaltung · Apr 1933',
  },
  'phase-3': {
    leftSrc: ARCHIVAL_IMAGES.library,
    leftCaption: 'Bücherverbrennung · Mai 1933',
    rightSrc: ARCHIVAL_IMAGES.parliament,
    rightCaption: 'Parteiverbote · Jun/Jul 1933',
  },
  'phase-4': {
    leftSrc: ARCHIVAL_IMAGES.decree,
    leftCaption: 'Reichskonkordat · Jul 1933',
    rightSrc: ARCHIVAL_IMAGES.reichstag,
    rightCaption: 'Führerstaat · Ab Jul 1933',
  },
};

// Subtle vertical pin stagger (in px) so Notizzettel feel naturally pinned by hand
const PIN_STAGGER_PX = [
  2, 8, 3, 10, 1, 7, 4, 10, 2, 9, 1, 9, 5, 2, 8, 3, 10, 3, 7, 5, 9, 3,
];

// Gentle asymmetric sag between pushpins so the main red thread stays visible between cards
const MAIN_THREAD_SAG_PX = [
  11, 18, 9, 20, 13, 16, 10, 19, 12, 17, 9, 20, 14, 11, 18, 10, 19, 12, 17, 13,
  16,
];

function buildMainTimelineThreadPath(count: number): string {
  const step = 100;
  const firstY = (PIN_STAGGER_PX[0] ?? 4) + 10;
  let d = `M -120 ${firstY + 14} Q -35 ${firstY + 18}, 50 ${firstY}`;

  for (let i = 0; i < count - 1; i++) {
    const x0 = i * step + 50;
    const y0 = (PIN_STAGGER_PX[i % PIN_STAGGER_PX.length] ?? 4) + 10;
    const x1 = (i + 1) * step + 50;
    const y1 = (PIN_STAGGER_PX[(i + 1) % PIN_STAGGER_PX.length] ?? 4) + 10;
    const sag = MAIN_THREAD_SAG_PX[i % MAIN_THREAD_SAG_PX.length] ?? 14;
    const midX = (x0 + x1) / 2 + (i % 2 === 0 ? -4 : 4);
    const ctrlY = Math.max(y0, y1) + sag;
    d += ` Q ${midX} ${ctrlY}, ${x1} ${y1}`;
  }

  const lastX = (count - 1) * step + 50;
  const lastY =
    (PIN_STAGGER_PX[(count - 1) % PIN_STAGGER_PX.length] ?? 4) + 10;
  d += ` Q ${lastX + 85} ${lastY + 18}, ${lastX + 170} ${lastY + 10}`;
  return d;
}

export function TimelineAxis({
  events,
  startIndex,
  minStartIndex,
  maxStartIndex,
  visibleCount,
  expandedIds,
  introStage,
  onSkipIntro,
  onToggleExpand,
  onPrev,
  onNext,
  onCenterIndex,
  onJumpToPhase,
}: TimelineAxisProps) {
  const isOverview = introStage === 'overview';
  const showControls = introStage === 'ready';

  const centerIndex = Math.max(
    0,
    Math.min(
      events.length - 1,
      visibleCount === 3 ? startIndex + 1 : startIndex
    )
  );
  const centerEvent = events[centerIndex] ?? events[0];

  const sliceStart = Math.max(0, startIndex);
  const sliceEnd = Math.min(events.length, startIndex + visibleCount);
  const visibleEvents = events.slice(sliceStart, sliceEnd);

  const activePhase = centerEvent
    ? PHASES.find((p) => p.id === centerEvent.phaseId)
    : undefined;

  const pinnedPhotos =
    PHASE_PINNED_PHOTOS[centerEvent?.phaseId ?? 'phase-1'] ??
    PHASE_PINNED_PHOTOS['phase-1'];

  const hasPrev = startIndex > minStartIndex;
  const hasNext = startIndex < maxStartIndex;

  const totalCount = events.length;
  const overviewScale = visibleCount / totalCount;
  const trackWidthPercent = (totalCount / visibleCount) * 100;
  const centerZoomXPercent =
    -(((totalCount - visibleCount) / 2) / totalCount) * 100;

  const trackTranslateXPercent =
    introStage === 'overview'
      ? 0
      : introStage === 'zoomCenter'
      ? centerZoomXPercent
      : introStage === 'panToStart'
      ? 0
      : -(startIndex / totalCount) * 100;

  const xTransition =
    introStage === 'zoomCenter'
      ? { duration: 1.15, ease: [0.22, 1, 0.36, 1] as const }
      : introStage === 'panToStart'
      ? { duration: 1.35, ease: [0.32, 0.04, 0.24, 1] as const }
      : { type: 'spring' as const, stiffness: 250, damping: 30, mass: 0.9 };

  const mainThreadPath = buildMainTimelineThreadPath(totalCount);

  return (
    <section
      aria-label="Papier-Zeitstrahl"
      onClick={introStage !== 'ready' ? onSkipIntro : undefined}
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

      {/* Full-Canvas Overview Pinboard Collage & Logical Overview Threads */}
      <OverviewPinboardDecor isOverview={isOverview} />

      {/* Top Pinboard Ledger Bar — slides down from behind top wooden frame when ready */}
      <motion.div
        initial={false}
        animate={{ y: showControls ? '0%' : '-110%' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: showControls ? 'auto' : 'none' }}
        className="absolute top-0 inset-x-0 h-[62px] z-30 px-3 sm:px-6 border-b border-[#8F6840] bg-[#DFCBB0]/95 shadow-[0_3px_10px_rgba(48,26,8,0.22)] flex items-center justify-between gap-3"
      >
        <div className="min-w-0">
          <h1 className="font-serif text-base sm:text-xl font-semibold text-[#173668] leading-tight truncate">
            Einrichtung und Sicherung der NS-Diktatur (1933–1934)
          </h1>
          <p className="mt-0.5 text-[11px] font-mono text-[#2C4E84] tabular-nums truncate">
            {activePhase
              ? `Phase ${activePhase.numberLabel}: ${activePhase.title}`
              : ''}
            {centerEvent ? ` · Fokus: ${centerEvent.dateLabel}` : ''}
          </p>
        </div>

        <div
          className="flex items-center gap-1.5 shrink-0 overflow-x-auto max-w-[55%]"
          role="navigation"
          aria-label="Phasen-Sprungmarken"
        >
          {PHASES.map((phase) => {
            const isActive = activePhase?.id === phase.id;
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
        </div>
      </motion.div>

      {/* Left Side Arrow Button — slides in from behind left wooden frame */}
      <motion.button
        type="button"
        onClick={onPrev}
        disabled={!hasPrev || !showControls}
        initial={false}
        animate={{ x: showControls ? '0%' : '-110%' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: showControls ? 'auto' : 'none' }}
        aria-label="Ein Datum zurück"
        className="absolute left-0 top-[62px] bottom-[38px] z-30 w-7 sm:w-9 md:w-10 flex items-center justify-center border-r border-[#8F6840]/85 bg-[#C59D72]/80 hover:bg-[#DFCAA6]/95 active:bg-[#DFCAA6] text-[#173668] disabled:cursor-not-allowed transition-colors cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9E2424]"
      >
        <ChevronLeft
          className={`w-6 h-6 sm:w-7 sm:h-7 transition-opacity ${
            hasPrev ? 'opacity-100' : 'opacity-30'
          }`}
          strokeWidth={2.2}
        />
      </motion.button>

      {/* Right Side Arrow Button — slides in from behind right wooden frame */}
      <motion.button
        type="button"
        onClick={onNext}
        disabled={!hasNext || !showControls}
        initial={false}
        animate={{ x: showControls ? '0%' : '110%' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: showControls ? 'auto' : 'none' }}
        aria-label="Ein Datum weiter"
        className="absolute right-0 top-[62px] bottom-[38px] z-30 w-7 sm:w-9 md:w-10 flex items-center justify-center border-l border-[#8F6840]/85 bg-[#C59D72]/80 hover:bg-[#DFCAA6]/95 active:bg-[#DFCAA6] text-[#173668] disabled:cursor-not-allowed transition-colors cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9E2424]"
      >
        <ChevronRight
          className={`w-6 h-6 sm:w-7 sm:h-7 transition-opacity ${
            hasNext ? 'opacity-100' : 'opacity-30'
          }`}
          strokeWidth={2.2}
        />
      </motion.button>

      {/* Compact Bottom Pinboard Strip — slides up from behind bottom wooden frame */}
      <motion.div
        initial={false}
        animate={{ y: showControls ? '0%' : '110%' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: showControls ? 'auto' : 'none' }}
        className="absolute bottom-0 inset-x-0 h-[38px] z-30 px-4 sm:px-6 border-t border-[#8F6840] bg-[#DFCBB0]/95 shadow-[0_-3px_10px_rgba(48,26,8,0.18)] flex items-center justify-between gap-2 text-xs text-[#173668]"
      >
        <p className="font-serif italic truncate">
          <span className="font-mono not-italic text-[10px] uppercase tracking-wider text-[#9E2424] mr-2">
            Leitfrage:
          </span>
          „{GUIDING_QUESTION}“
        </p>
        <span className="font-mono text-[11px] text-[#2C4E84] tabular-nums shrink-0">
          Fokus: {centerEvent.indexNumber}/{events.length} (
          {visibleEvents[0]?.shortDate}
          {visibleEvents.length > 1
            ? ` – ${visibleEvents[visibleEvents.length - 1]?.shortDate}`
            : ''}
          )
        </span>
      </motion.div>

      {/* Center Stage Viewport (reserves steady safe margins for perimeter bars without layout jump) */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col pt-[62px] pb-[38px] px-7 sm:px-9 md:px-10 overflow-hidden">
        <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col">
          {/* Two Persistent Pinned Archival Photos — continuously visible, resize & reposition during zoom */}
          <div
            aria-hidden="true"
            className="pointer-events-none select-none absolute inset-0 z-[4]"
          >
            {/* Left Pinned Archival Photo */}
            <motion.div
              initial={false}
              animate={{
                scale: isOverview ? 1.24 : 1,
                x: isOverview ? 52 : 0,
                y: isOverview ? -65 : 0,
                rotate: isOverview ? -5.5 : -3,
              }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block absolute left-3 xl:left-4 bottom-5 w-28 xl:w-40 bg-[#FAF6EC] p-1.5 pb-2.5 border border-[#B8A58B] shadow-[4px_8px_16px_rgba(38,20,6,0.38)]"
            >
              <div className="masking-tape w-10 h-3 -rotate-12 absolute -top-1.5 -left-2" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#9E2424] border-2 border-[#681212] mx-auto -mt-3.5 mb-1.5 shadow-[2px_3px_4px_rgba(35,16,5,0.45)] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#F5B7B7]/85 -translate-x-0.5 -translate-y-0.5" />
              </div>
              <img
                src={pinnedPhotos.leftSrc}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover sepia-[0.42] grayscale-[0.25] contrast-[1.06] border border-[#D4C7B2]"
              />
              <p className="mt-1 text-[9px] xl:text-[10px] font-mono text-[#173668] leading-tight text-center truncate">
                {pinnedPhotos.leftCaption}
              </p>
            </motion.div>

            {/* Right Pinned Archival Photo */}
            <motion.div
              initial={false}
              animate={{
                scale: isOverview ? 1.24 : 1,
                x: isOverview ? -52 : 0,
                y: isOverview ? -60 : 0,
                rotate: isOverview ? 5 : 2.8,
              }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block absolute right-3 xl:right-4 bottom-6 w-28 xl:w-40 bg-[#FAF6EC] p-1.5 pb-2.5 border border-[#B8A58B] shadow-[4px_8px_16px_rgba(38,20,6,0.38)]"
            >
              <div className="masking-tape w-10 h-3 rotate-12 absolute -top-1.5 -right-2" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#9E2424] border-2 border-[#681212] mx-auto -mt-3.5 mb-1.5 shadow-[2px_3px_4px_rgba(35,16,5,0.45)] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#F5B7B7]/85 -translate-x-0.5 -translate-y-0.5" />
              </div>
              <img
                src={pinnedPhotos.rightSrc}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full aspect-[4/3] object-cover sepia-[0.42] grayscale-[0.25] contrast-[1.06] border border-[#D4C7B2]"
              />
              <p className="mt-1 text-[9px] xl:text-[10px] font-mono text-[#173668] leading-tight text-center truncate">
                {pinnedPhotos.rightCaption}
              </p>
            </motion.div>
          </div>

          {/* Persistent Pinned Paper Institutions Graphic (always visible, transforms scale & y) */}
          {centerEvent && (
            <InstitutionsMap
              centerEvent={centerEvent}
              isOverview={isOverview}
            />
          )}

          {/* Continuous 22-Station Track */}
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
            className="relative z-10 flex-1 min-h-0 w-full h-full"
          >
            <motion.div
              initial={false}
              animate={{
                scale: isOverview ? overviewScale : 1,
                x: `${trackTranslateXPercent}%`,
                y: isOverview ? '22%' : '0%',
              }}
              transition={{
                scale: { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
                y: { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
                x: xTransition,
              }}
              style={{
                width: `${trackWidthPercent}%`,
                transformOrigin: '0% 25%',
              }}
              className="relative h-full flex items-stretch py-3 sm:py-5"
            >
              {/* Main Red Thread Connecting the 22 Primary Note Pushpins (strictly behind z-10 cards & z-30 pins) */}
              <motion.div
                aria-hidden="true"
                initial={false}
                animate={{ y: startIndex % 2 === 0 ? 0 : 2 }}
                transition={{ type: 'spring', stiffness: 210, damping: 18 }}
                className="absolute left-0 right-0 top-3 sm:top-5 h-[60px] pointer-events-none z-0 overflow-visible"
              >
                <svg
                  viewBox="0 0 2200 60"
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

              {/* All 22 Station Columns */}
              {events.map((event, idx) => {
                const isExpanded = expandedIds.includes(event.id);
                const phase = PHASES.find((p) => p.id === event.phaseId);
                const isCurrentlyVisible =
                  idx >= sliceStart && idx < sliceEnd;
                const isCenterStation = !isOverview && idx === centerIndex;
                const pinStagger =
                  PIN_STAGGER_PX[idx % PIN_STAGGER_PX.length] ?? 4;

                return (
                  <div
                    key={event.id}
                    style={{ width: `${100 / totalCount}%` }}
                    className="relative z-10 shrink-0 h-full min-h-0 px-1 sm:px-1.5 lg:px-2 flex flex-col items-center"
                  >
                    {/* Red Pushpin Directly Pinned onto Top Edge of Notizzettel */}
                    <div
                      style={{ paddingTop: `${pinStagger}px` }}
                      className="shrink-0 flex flex-col items-center -mb-2.5 relative z-30"
                    >
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
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F5B7B7]/85 -translate-x-0.5 -translate-y-0.5" />
                      </button>
                    </div>

                    <FoldableNoteCard
                      event={event}
                      phase={phase}
                      isExpanded={isExpanded}
                      isOverview={isOverview}
                      showControls={showControls}
                      isCurrentlyVisible={isCurrentlyVisible}
                      onToggleExpand={onToggleExpand}
                    />
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
