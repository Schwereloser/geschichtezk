import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { HistoricalPhase, TimelineEvent } from '../data/timelineData';
import { ActorAvatar, ActorMiniProfile } from './ActorMiniProfile';

interface FoldableNoteCardProps {
  event: TimelineEvent;
  phase: HistoricalPhase | undefined;
  isExpanded: boolean;
  isCenter: boolean;
  isOverview: boolean;
  showControls: boolean;
  isCurrentlyVisible: boolean;
  onToggleExpand: (id: string) => void;
}

export function FoldableNoteCard({
  event,
  phase,
  isExpanded,
  isCenter,
  isOverview,
  showControls,
  isCurrentlyVisible,
  onToggleExpand,
}: FoldableNoteCardProps) {
  const [selectedActorName, setSelectedActorName] = useState<string | null>(
    null
  );

  const totalVotes = event.voteResult
    ? event.voteResult.yes + event.voteResult.no
    : 0;
  const yesPercent = event.voteResult
    ? Math.round((event.voteResult.yes / totalVotes) * 100)
    : 0;
  const selectedActor = selectedActorName
    ? event.actors.find((a) => a.name === selectedActorName) ?? null
    : null;

  return (
    <motion.article
      initial={false}
      animate={{
        width:
          isExpanded && isCenter
            ? '112%'
            : isExpanded || isOverview
            ? '100%'
            : '98%',
        rotateZ: isExpanded || isOverview ? 0 : -0.9,
      }}
      transition={{
        width: { type: 'spring', stiffness: 220, damping: 24 },
        rotateZ: { type: 'spring', stiffness: 200, damping: 20 },
      }}
      style={{ perspective: '1500px' }}
      className={`relative flex flex-col min-h-0 transition-shadow duration-300 ${
        isExpanded
          ? 'shadow-[0_20px_42px_-10px_rgba(45,28,10,0.45)]'
          : 'shadow-[0_10px_22px_-6px_rgba(45,28,10,0.32)]'
      }`}
    >
      {/* Top Pinned Paper Packet (Always Visible) */}
      <div className="shrink-0 notepaper-sheet border border-[#C2B6A2] relative z-20 overflow-hidden">
        {/* Subtle Origami Facet Overlay on Header */}
        <svg
          viewBox="0 0 300 120"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full opacity-35"
        >
          <polygon points="0,0 135,55 0,120" fill="rgba(95,76,52,0.06)" />
          <polygon points="135,55 300,0 300,90" fill="rgba(255,255,255,0.22)" />
          <polyline
            points="0,0 135,55 300,0"
            fill="none"
            stroke="rgba(95,76,52,0.14)"
            strokeWidth="1"
          />
          <line
            x1="135"
            y1="55"
            x2="175"
            y2="120"
            stroke="rgba(95,76,52,0.12)"
            strokeWidth="1"
          />
        </svg>

        <button
          type="button"
          disabled={!showControls}
          tabIndex={isCurrentlyVisible && showControls ? 0 : -1}
          onClick={() => onToggleExpand(event.id)}
          aria-expanded={isExpanded}
          className="relative w-full text-left px-3.5 sm:px-4 py-2 cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9E2424] group disabled:cursor-pointer"
        >
          {/* Unified Header Content (always visible, scales smoothly during zoom) */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <motion.span
                initial={false}
                animate={{
                  scale: isOverview ? 2.15 : 1,
                  y: isOverview ? 6 : 0,
                }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'top left' }}
                className="inline-block font-mono text-[11px] font-semibold text-[#9E2424] tabular-nums"
              >
                {isOverview ? event.shortDate : event.dateLabel}
              </motion.span>
              <span className="inline-flex items-center text-[#2C4E84] group-hover:text-[#173668]">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </span>
            </div>

            <h2 className="mt-1 font-serif text-base sm:text-[17px] font-semibold text-[#173668] leading-tight">
              {event.title}
            </h2>

            {!isExpanded && phase && (
              <div className="mt-2 pt-1.5 border-t border-[#D6CBBA] text-[10.5px] text-[#2C4E84]">
                <span>Phase {phase.numberLabel}</span>
              </div>
            )}
          </div>
        </button>

        {/* Stacked Folded Paper Thickness Layers when collapsed */}
        {!isExpanded && (
          <>
            <div
              aria-hidden="true"
              className="h-1.5 mx-1 -mb-1.5 bg-[#EAE3D5] border-x border-b border-[#C2B6A2]"
            />
            <div
              aria-hidden="true"
              className="h-1.5 mx-2.5 -mb-1.5 bg-[#DFD6C4] border-x border-b border-[#C2B6A2] shadow-[0_3px_5px_rgba(45,28,10,0.16)]"
            />
          </>
        )}
      </div>

      {/* 3-MOVEMENT ORIGAMI PAPER UNFOLDING FROM FOLDED SHAPE */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            key="origami-unfold-wrapper"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: 1,
              height: 'auto',
              transition: {
                height: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.16 },
              },
            }}
            exit={{
              opacity: 0,
              height: 0,
              transition: {
                height: {
                  duration: 0.28,
                  delay: 0.32,
                  ease: [0.4, 0, 0.2, 1],
                },
                opacity: { duration: 0.18, delay: 0.38 },
              },
            }}
            className="min-h-0 flex flex-col overflow-hidden"
          >
            <div
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="min-h-0 overflow-y-auto ipad-note-scroll"
            >
              <div className="flex flex-col">
                {/* BEWEGUNG 1: Erster Papierfalz klappt nach unten auf (Kurzüberblick) */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: 'auto',
                    opacity: 1,
                    transition: {
                      height: {
                        duration: 0.34,
                        delay: 0.03,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      opacity: { duration: 0.16, delay: 0.03 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: {
                        duration: 0.22,
                        delay: 0.28,
                        ease: [0.4, 0, 1, 1],
                      },
                      opacity: { duration: 0.16, delay: 0.3 },
                    },
                  }}
                  style={{ perspective: '1400px' }}
                  className="shrink-0 overflow-hidden"
                >
                  <motion.div
                    initial={{
                      rotateX: -92,
                      rotateY: -10,
                      rotateZ: -1.4,
                      skewX: 2.2,
                      opacity: 0.25,
                    }}
                    animate={{
                      rotateX: [-92, 6, -1.5, 0],
                      rotateY: [-10, 2.5, -0.6, 0],
                      rotateZ: [-1.4, 0.4, 0, 0],
                      skewX: [2.2, -0.8, 0.2, 0],
                      opacity: [0.25, 0.95, 1, 1],
                      transition: {
                        duration: 0.36,
                        delay: 0.03,
                        times: [0, 0.55, 0.82, 1],
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }}
                    exit={{
                      rotateX: -92,
                      rotateY: -8,
                      rotateZ: -1.2,
                      opacity: 0,
                      transition: {
                        duration: 0.2,
                        delay: 0.28,
                        ease: [0.4, 0, 1, 1],
                      },
                    }}
                    style={{
                      transformOrigin: 'top center',
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                    className="relative notepaper-sheet border-x border-[#C2B6A2] px-3.5 sm:px-4 pt-2.5 pb-2.5 space-y-1.5 text-[#173668]"
                  >
                    {/* Origami Facet Overlay 1 */}
                    <motion.svg
                      viewBox="0 0 400 160"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      initial={{ opacity: 0.65 }}
                      animate={{ opacity: [0.65, 0.4, 0.2, 0.16] }}
                      exit={{ opacity: 0.6 }}
                      transition={{
                        duration: 0.42,
                        delay: 0.03,
                        times: [0, 0.4, 0.75, 1],
                      }}
                      className="pointer-events-none absolute inset-0 w-full h-full"
                    >
                      <polygon points="0,0 155,85 0,160" fill="rgba(85,66,42,0.13)" />
                      <polygon points="0,0 250,35 155,85" fill="rgba(255,255,255,0.3)" />
                      <polygon points="250,35 400,0 400,120 155,85" fill="rgba(85,66,42,0.09)" />
                      <polyline
                        points="0,0 155,85 400,120"
                        fill="none"
                        stroke="rgba(75,58,36,0.26)"
                        strokeWidth="1"
                      />
                    </motion.svg>

                    <motion.div
                      aria-hidden="true"
                      initial={{ opacity: 0.55 }}
                      animate={{ opacity: 0.06 }}
                      exit={{ opacity: 0.55 }}
                      transition={{ duration: 0.34, delay: 0.03 }}
                      className="pointer-events-none absolute top-0 left-0 right-0 h-7 bg-gradient-to-b from-[#4A3B28]/40 to-transparent"
                    />

                    <div className="relative z-10 space-y-1.5">
                      <div className="text-[11px] font-mono text-[#2C4E84] flex flex-wrap gap-x-2 gap-y-0.5">
                        <span>{event.mechanismLabel}</span>
                        {event.location && <span>· {event.location}</span>}
                      </div>

                      {event.officialTitle && (
                        <p className="text-[11px] italic text-[#284B82] border-b border-[#D8CFC0] pb-1.5">
                          „{event.officialTitle}“
                        </p>
                      )}

                      <div className="bg-white/50 border border-[#CFC5B4] px-2.5 py-2">
                        <p className="text-xs sm:text-[13px] leading-snug text-[#173668] font-medium">
                          {event.summary}
                        </p>
                      </div>

                      {event.historicalCorrection && (
                        <p className="text-[11px] text-[#9E2424] bg-white/45 px-2.5 py-1.5 border border-[#C7B698] leading-snug">
                          {event.historicalCorrection}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </motion.div>

                {/* BEWEGUNG 2: Zweiter gegenläufiger Falz öffnet sich (Kernaussagen & Quellen/Abstimmung) */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: 'auto',
                    opacity: 1,
                    transition: {
                      height: {
                        duration: 0.36,
                        delay: 0.31,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      opacity: { duration: 0.16, delay: 0.31 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: {
                        duration: 0.2,
                        delay: 0.14,
                        ease: [0.4, 0, 1, 1],
                      },
                      opacity: { duration: 0.14, delay: 0.16 },
                    },
                  }}
                  style={{ perspective: '1400px' }}
                  className="shrink-0 overflow-hidden"
                >
                  <motion.div
                    initial={{
                      rotateX: -94,
                      rotateY: 12,
                      rotateZ: 1.9,
                      skewX: -2.4,
                      opacity: 0.15,
                    }}
                    animate={{
                      rotateX: [-94, 5, -1.2, 0],
                      rotateY: [12, -3, 0.6, 0],
                      rotateZ: [1.9, -0.5, 0.1, 0],
                      skewX: [-2.4, 0.8, -0.2, 0],
                      opacity: [0.15, 0.94, 1, 1],
                      transition: {
                        duration: 0.38,
                        delay: 0.31,
                        times: [0, 0.55, 0.82, 1],
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }}
                    exit={{
                      rotateX: -92,
                      rotateY: 10,
                      rotateZ: 1.6,
                      opacity: 0,
                      transition: {
                        duration: 0.18,
                        delay: 0.14,
                        ease: [0.4, 0, 1, 1],
                      },
                    }}
                    style={{
                      transformOrigin: 'top center',
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                    className="relative notepaper-sheet border-x border-[#C2B6A2] px-3.5 sm:px-4 pt-2.5 pb-2.5 space-y-2 text-[#173668]"
                  >
                    {/* Origami Facet Overlay 2 */}
                    <motion.svg
                      viewBox="0 0 400 180"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      initial={{ opacity: 0.65 }}
                      animate={{ opacity: [0.65, 0.42, 0.2, 0.16] }}
                      exit={{ opacity: 0.6 }}
                      transition={{
                        duration: 0.42,
                        delay: 0.31,
                        times: [0, 0.4, 0.75, 1],
                      }}
                      className="pointer-events-none absolute inset-0 w-full h-full"
                    >
                      <polygon points="0,0 225,80 105,180 0,180" fill="rgba(255,255,255,0.26)" />
                      <polygon points="225,80 400,0 400,180 105,180" fill="rgba(85,66,42,0.11)" />
                      <polyline
                        points="0,0 225,80 400,0"
                        fill="none"
                        stroke="rgba(75,58,36,0.24)"
                        strokeWidth="1"
                      />
                    </motion.svg>

                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5F4C34]/25 via-white/75 to-[#5F4C34]/25" />
                    <motion.div
                      aria-hidden="true"
                      initial={{ opacity: 0.55 }}
                      animate={{ opacity: 0.05 }}
                      exit={{ opacity: 0.55 }}
                      transition={{ duration: 0.34, delay: 0.31 }}
                      className="pointer-events-none absolute top-0 left-0 right-0 h-7 bg-gradient-to-b from-[#4A3B28]/35 to-transparent"
                    />

                    <div className="relative z-10 space-y-2">
                      {/* Ablauf & Maßnahmen */}
                      <div>
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#2C4E84] mb-1">
                          Kernaussagen
                        </h3>
                        <ul className="space-y-1 text-xs sm:text-[13px] leading-snug text-[#173668]">
                          {event.eventsAndMeasures.map((item, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-[#9E2424] font-bold shrink-0">
                                ·
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Grundrechte (28. Feb) */}
                      {event.suspendedRights && (
                        <div className="pt-2 border-t border-[#D8CFC0]">
                          <h3 className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#9E2424] mb-1.5">
                            Ausgesetzte Grundrechte
                          </h3>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-[#173668]">
                            {event.suspendedRights.map((r) => (
                              <div key={r}>· {r}</div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Abstimmung (23. Mär) */}
                      {event.voteResult && (
                        <div className="pt-2 border-t border-[#D8CFC0]">
                          <div className="flex items-baseline justify-between text-[10px] font-mono mb-1">
                            <span className="uppercase tracking-wider text-[#2C4E84]">
                              Reichstagsabstimmung
                            </span>
                            <span className="text-[#173668] tabular-nums font-medium">
                              {event.voteResult.yes} Ja : {event.voteResult.no} Nein
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[#DFD6C4] flex overflow-hidden">
                            <div
                              style={{ width: `${yesPercent}%` }}
                              className="h-full bg-[#173668]"
                            />
                            <div
                              style={{ width: `${100 - yesPercent}%` }}
                              className="h-full bg-[#9E2424]"
                            />
                          </div>
                          <p className="mt-1.5 text-xs font-medium text-[#9E2424]">
                            {event.voteResult.note}
                          </p>
                          {event.voteResult.details.map((d, i) => (
                            <p key={i} className="mt-0.5 text-[11px] text-[#284B82]">
                              · {d}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Reden (23. Mär) */}
                      {event.quotes && event.quotes.length > 0 && (
                        <div className="pt-2 border-t border-[#D8CFC0] space-y-1.5">
                          <h3 className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#2C4E84]">
                            Reden im Reichstag
                          </h3>
                          {event.quotes.map((q, i) => (
                            <blockquote
                              key={i}
                              className="py-1 border-y border-[#D8CFC0]"
                            >
                              <p className="font-serif italic text-xs text-[#173668] leading-snug">
                                {q.text}
                              </p>
                            </blockquote>
                          ))}
                          {(event.welsSpeechPoints || event.hitlerReplyPoints) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {event.welsSpeechPoints && (
                                <div>
                                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#2C4E84] mb-0.5">
                                    Otto Wels (SPD)
                                  </p>
                                  <ul className="space-y-0.5 text-[11px] text-[#284B82]">
                                    {event.welsSpeechPoints.map((pt, i) => (
                                      <li key={i}>· {pt}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {event.hitlerReplyPoints && (
                                <div>
                                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#2C4E84] mb-0.5">
                                    Antwort Adolf Hitlers
                                  </p>
                                  <ul className="space-y-0.5 text-[11px] text-[#284B82]">
                                    {event.hitlerReplyPoints.map((pt, i) => (
                                      <li key={i}>· {pt}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                          {event.sourceWorkNote && (
                            <p className="text-[10px] italic text-[#2C4E84]">
                              {event.sourceWorkNote}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>

                {/* BEWEGUNG 3: Dritter unterer Schlussflügel schwingt aus (Akteure, Einordnung & Zuklappen) */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: 'auto',
                    opacity: 1,
                    transition: {
                      height: {
                        duration: 0.38,
                        delay: 0.61,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      opacity: { duration: 0.16, delay: 0.61 },
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: {
                        duration: 0.2,
                        delay: 0,
                        ease: [0.4, 0, 1, 1],
                      },
                      opacity: { duration: 0.14, delay: 0 },
                    },
                  }}
                  style={{ perspective: '1400px' }}
                  className="shrink-0 overflow-hidden"
                >
                  <motion.div
                    initial={{
                      rotateX: -94,
                      rotateY: -11,
                      rotateZ: -1.7,
                      skewX: 2.1,
                      opacity: 0.1,
                    }}
                    animate={{
                      rotateX: [-94, 5, -1.3, 0],
                      rotateY: [-11, 2.8, -0.7, 0],
                      rotateZ: [-1.7, 0.45, -0.1, 0],
                      skewX: [2.1, -0.7, 0.2, 0],
                      opacity: [0.1, 0.94, 1, 1],
                      transition: {
                        duration: 0.4,
                        delay: 0.61,
                        times: [0, 0.55, 0.82, 1],
                        ease: [0.22, 1, 0.36, 1],
                      },
                    }}
                    exit={{
                      rotateX: -94,
                      rotateY: -9,
                      rotateZ: -1.4,
                      opacity: 0,
                      transition: {
                        duration: 0.18,
                        delay: 0,
                        ease: [0.4, 0, 1, 1],
                      },
                    }}
                    style={{
                      transformOrigin: 'top center',
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden',
                    }}
                    className="relative notepaper-sheet border-x border-b border-[#C2B6A2] px-3.5 sm:px-4 pt-2.5 pb-3 space-y-2 text-[#173668]"
                  >
                    {/* Origami Facet Overlay 3 */}
                    <motion.svg
                      viewBox="0 0 400 180"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                      initial={{ opacity: 0.65 }}
                      animate={{ opacity: [0.65, 0.42, 0.2, 0.16] }}
                      exit={{ opacity: 0.6 }}
                      transition={{
                        duration: 0.44,
                        delay: 0.61,
                        times: [0, 0.4, 0.75, 1],
                      }}
                      className="pointer-events-none absolute inset-0 w-full h-full"
                    >
                      <polygon points="0,0 140,105 0,180" fill="rgba(85,66,42,0.12)" />
                      <polygon points="140,105 400,0 400,180 265,180" fill="rgba(255,255,255,0.24)" />
                      <polyline
                        points="0,0 140,105 400,0"
                        fill="none"
                        stroke="rgba(75,58,36,0.24)"
                        strokeWidth="1"
                      />
                    </motion.svg>

                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5F4C34]/25 via-white/75 to-[#5F4C34]/25" />
                    <motion.div
                      aria-hidden="true"
                      initial={{ opacity: 0.55 }}
                      animate={{ opacity: 0.05 }}
                      exit={{ opacity: 0.55 }}
                      transition={{ duration: 0.34, delay: 0.61 }}
                      className="pointer-events-none absolute top-0 left-0 right-0 h-7 bg-gradient-to-b from-[#4A3B28]/35 to-transparent"
                    />

                    <div className="relative z-10 space-y-2">
                      {/* Akteure (Klickbare Mini-Profile) */}
                      {event.actors.length > 0 && (
                        <div>
                          <div className="flex items-baseline justify-between gap-2 mb-1">
                            <h3 className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#2C4E84]">
                              Akteure
                            </h3>
                            <span className="text-[10px] italic text-[#284B82]/85">
                              Profil antippen für Info
                            </span>
                          </div>
                          <div
                            className={`grid gap-1.5 ${
                              event.actors.length >= 4
                                ? 'grid-cols-2 sm:grid-cols-4'
                                : 'grid-cols-3'
                            }`}
                          >
                            {event.actors.map((a) => (
                              <ActorMiniProfile
                                key={a.name}
                                actor={a}
                                isSelected={selectedActorName === a.name}
                                onSelect={() =>
                                  setSelectedActorName((prev) =>
                                    prev === a.name ? null : a.name
                                  )
                                }
                              />
                            ))}
                          </div>

                          {/* Pinned Paper Detail Slip for Clicked Actor */}
                          <AnimatePresence initial={false}>
                            {selectedActor && (
                              <motion.div
                                key={selectedActor.name}
                                initial={{ opacity: 0, y: -6, rotateX: -22 }}
                                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                                exit={{ opacity: 0, y: -4, rotateX: -18 }}
                                transition={{
                                  duration: 0.24,
                                  ease: [0.16, 1, 0.3, 1],
                                }}
                                style={{ transformOrigin: 'top center' }}
                                className="relative mt-2.5 bg-[#FAF4E6] border border-[#B8A58B] px-3 py-2.5 shadow-[0_4px_10px_rgba(45,28,10,0.16)]"
                              >
                                <span
                                  aria-hidden="true"
                                  className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#9E2424] border border-[#681212]"
                                />
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <ActorAvatar
                                      name={selectedActor.name}
                                      size="md"
                                    />
                                    <div className="min-w-0">
                                      <p className="text-xs font-serif font-semibold text-[#173668] leading-tight truncate">
                                        {selectedActor.name}
                                      </p>
                                      {selectedActor.role && (
                                        <p className="text-[10px] font-mono text-[#9E2424] leading-tight">
                                          {selectedActor.role}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedActorName(null)}
                                    aria-label="Personeninfo schließen"
                                    className="p-0.5 text-[#2C4E84] hover:text-[#9E2424] cursor-pointer touch-manipulation shrink-0"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <p className="mt-1.5 pt-1.5 border-t border-[#E0D6C4] text-xs leading-snug text-[#173668]">
                                  {selectedActor.action}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Einordnung */}
                      {event.contextNotes && event.contextNotes.length > 0 && (
                        <div className="pt-2 border-t border-[#D8CFC0]">
                          <ul className="space-y-0.5 text-[11px] text-[#284B82] leading-snug italic">
                            {event.contextNotes.map((n, i) => (
                              <li key={i}>· {n}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Fold-Back Icon Button */}
                      <button
                        type="button"
                        onClick={() => onToggleExpand(event.id)}
                        aria-label="Notizzettel zuklappen"
                        className="w-full py-1.5 mt-1 border border-[#CFC5B4] flex items-center justify-center text-[#173668] bg-white/55 hover:bg-white/80 transition-colors cursor-pointer touch-manipulation"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
