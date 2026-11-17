import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import corkTextureImg from '../assets/images/cork_board_texture_1794846395588.jpg';
import {
  ContextualBoardPhoto,
  GUIDING_QUESTION,
  LEFT_BOARD_PHOTOS,
  PHASES,
  PhaseId,
  RIGHT_BOARD_PHOTOS,
  TimelineEvent,
} from '../data/timelineData';
import { FlankingPinboardPhoto } from './FlankingPinboardPhoto';
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
  const [selectedPhoto, setSelectedPhoto] =
    useState<ContextualBoardPhoto | null>(null);

  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedPhoto]);

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

  const leftSlotMatch = LEFT_BOARD_PHOTOS.find(
    (slot) => centerIndex >= slot.minIndex && centerIndex <= slot.maxIndex
  );
  const rightSlotMatch = RIGHT_BOARD_PHOTOS.find(
    (slot) => centerIndex >= slot.minIndex && centerIndex <= slot.maxIndex
  );

  const leftSlotEvent =
    visibleCount === 3 && startIndex >= 0 ? events[startIndex] : undefined;
  const rightSlotEvent =
    visibleCount === 3 && startIndex + 2 < events.length
      ? events[startIndex + 2]
      : undefined;

  const leftPhoto =
    showControls &&
    leftSlotMatch &&
    !(leftSlotEvent && expandedIds.includes(leftSlotEvent.id))
      ? leftSlotMatch.photo
      : null;

  const rightPhoto =
    showControls &&
    rightSlotMatch &&
    !(rightSlotEvent && expandedIds.includes(rightSlotEvent.id))
      ? rightSlotMatch.photo
      : null;

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
      ? -(minStartIndex / totalCount) * 100
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

      {/* Clean, Unobtrusive Floating Edge Arrows (no bulky side panels) */}
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
        className="absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-[#FAF4E6]/65 hover:bg-[#FAF4E6]/95 active:scale-95 border border-[#A89274]/45 hover:border-[#9E2424]/70 text-[#173668] hover:text-[#9E2424] shadow-[0_2px_8px_rgba(38,20,6,0.14)] backdrop-blur-[2px] transition-all cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E2424]"
      >
        <ArrowLeft className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={2} />
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
        className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-[#FAF4E6]/65 hover:bg-[#FAF4E6]/95 active:scale-95 border border-[#A89274]/45 hover:border-[#9E2424]/70 text-[#173668] hover:text-[#9E2424] shadow-[0_2px_8px_rgba(38,20,6,0.14)] backdrop-blur-[2px] transition-all cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E2424]"
      >
        <ArrowRight
          className="w-4 h-4 sm:w-[18px] sm:h-[18px]"
          strokeWidth={2}
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

      {/* Center Stage Viewport */}
      <div className="relative z-10 flex-1 min-h-0 flex flex-col pt-[62px] pb-[38px] px-4 sm:px-6 md:px-7 overflow-hidden">
        <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col">
          {/* Bottom Layer (z-[5], below Track so unfolded center Notizzettel sit above InstitutionsMap) */}
          <div className="pointer-events-none absolute inset-x-1 sm:inset-x-3 bottom-2.5 z-[5] flex items-end justify-center gap-2.5 xl:gap-5">
            <div
              aria-hidden="true"
              className="hidden min-[900px]:block w-[120px] lg:w-[132px] xl:w-[164px] shrink-0"
            />
            {centerEvent && (
              <InstitutionsMap
                centerEvent={centerEvent}
                isOverview={isOverview}
              />
            )}
            <div
              aria-hidden="true"
              className="hidden min-[900px]:block w-[120px] lg:w-[132px] xl:w-[164px] shrink-0"
            />
          </div>

          {/* Flanking Pinboard Photo Wings (z-[15], clickable outside InstitutionsMap & automatically unpin if side note opens) */}
          <div className="pointer-events-none absolute inset-x-1 sm:inset-x-3 bottom-2.5 z-[15] flex items-end justify-center gap-2.5 xl:gap-5">
            <div className="hidden min-[900px]:flex w-[120px] lg:w-[132px] xl:w-[164px] shrink-0 justify-center pb-2">
              <FlankingPinboardPhoto
                photo={leftPhoto}
                side="left"
                onSelect={setSelectedPhoto}
              />
            </div>

            <div
              aria-hidden="true"
              className="w-full min-w-0 max-w-[630px] xl:max-w-[740px]"
            />

            <div className="hidden min-[900px]:flex w-[120px] lg:w-[132px] xl:w-[164px] shrink-0 justify-center pb-2">
              <FlankingPinboardPhoto
                photo={rightPhoto}
                side="right"
                onSelect={setSelectedPhoto}
              />
            </div>
          </div>

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
                    className={`relative shrink-0 h-full min-h-0 px-1 sm:px-1.5 lg:px-2 flex flex-col items-center ${
                      isExpanded ? 'z-20' : 'z-10'
                    }`}
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
              className="relative notepaper-sheet border border-[#A69070] max-w-lg w-full p-3.5 sm:p-5 shadow-[0_24px_56px_-10px_rgba(20,10,2,0.7)]"
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
                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center bg-[#FAF4E6]/85 border border-[#B8A58B] text-[#173668] hover:text-[#9E2424] hover:border-[#9E2424] cursor-pointer touch-manipulation"
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
    </section>
  );
}
