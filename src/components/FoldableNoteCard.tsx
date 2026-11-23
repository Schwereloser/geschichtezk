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
  maxCardHeight?: number;
  overviewHint?: string;
  onToggleExpand: (id: string) => void;
  onOverviewSelect?: () => void;
}

export function FoldableNoteCard({
  event,
  phase,
  isExpanded,
  isCenter,
  isOverview,
  showControls,
  isCurrentlyVisible,
  maxCardHeight = 480,
  overviewHint,
  onToggleExpand,
  onOverviewSelect,
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

  const maxScrollBodyHeight = Math.max(150, maxCardHeight - 96);

  return (
    <motion.article
      initial={false}
      animate={{
        width:
          isExpanded && isCenter && !isOverview
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
      style={{
        maxHeight: isOverview ? undefined : maxCardHeight,
      }}
      className={`relative flex flex-col min-h-0 transition-shadow duration-300 ${
        isOverview ? 'flex-1 h-full' : ''
      } ${
        isExpanded && !isOverview
          ? 'shadow-[0_20px_42px_-10px_rgba(45,28,10,0.45)]'
          : isOverview
          ? 'shadow-[2px_5px_12px_rgba(38,20,6,0.28)] hover:shadow-[4px_10px_20px_rgba(38,20,6,0.4)]'
          : 'shadow-[0_10px_22px_-6px_rgba(45,28,10,0.32)]'
      }`}
    >
      {/* Top Pinned Paper Packet (Always Visible & Morphs Between Overview Tile and Timeline Note) */}
      <div
        className={`${
          isOverview ? 'flex-1 flex flex-col' : 'shrink-0'
        } notepaper-sheet border relative z-20 overflow-hidden transition-colors ${
          isOverview
            ? 'border-[#B8A58B] hover:border-[#9E2424]'
            : 'border-[#C2B6A2]'
        }`}
      >
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
          disabled={!isOverview && !showControls}
          tabIndex={isOverview || (isCurrentlyVisible && showControls) ? 0 : -1}
          onClick={(e) => {
            if (isOverview) {
              e.stopPropagation();
              onOverviewSelect?.();
            } else {
              onToggleExpand(event.id);
            }
          }}
          aria-expanded={!isOverview ? isExpanded : undefined}
          className={`relative w-full text-left cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9E2424] group disabled:cursor-pointer ${
            isOverview
              ? 'flex-1 flex flex-col justify-between px-2.5 py-2'
              : 'px-3.5 sm:px-4 py-2'
          }`}
        >
          {/* Unified Header Content (morphs cleanly with card dimensions) */}
          <div className={isOverview ? 'flex-1 flex flex-col justify-between' : ''}>
            <div>
              <div className="flex items-center justify-between gap-1.5">
                <span
                  className={`inline-block font-mono font-semibold text-[#9E2424] tabular-nums truncate ${
                    isOverview ? 'text-[10px] xl:text-[11px]' : 'text-[11px]'
                  }`}
                >
                  {isOverview
                    ? `${event.indexNumber} · ${event.shortDate}`
                    : event.dateLabel}
                </span>
                {isOverview ? (
                  <span className="font-mono text-[9px] text-[#2C4E84] shrink-0">
                    P{phase?.numberLabel ?? '01'}
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[#2C4E84] group-hover:text-[#173668]">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </span>
                )}
              </div>

              <h2
                className={`mt-1 font-serif font-semibold text-[#173668] leading-snug transition-colors ${
                  isOverview
                    ? 'text-[11px] sm:text-xs xl:text-[13px] line-clamp-2 group-hover:text-[#9E2424]'
                    : 'text-base sm:text-[17px] leading-tight'
                }`}
              >
                {event.title}
              </h2>
            </div>

            {isOverview ? (
              <div className="mt-1.5 pt-1 border-t border-[#D8CFC0] flex items-center justify-between gap-1 text-[9.5px] font-mono text-[#2C4E84]">
                <span className="truncate">
                  {overviewHint ?? event.mechanismLabel.split(',')[0]}
                </span>
                <span className="text-[#9E2424] opacity-75 group-hover:opacity-100 shrink-0">
                  →
                </span>
              </div>
            ) : (
              !isExpanded &&
              phase && (
                <div className="mt-2 pt-1.5 border-t border-[#D6CBBA] text-[10.5px] text-[#2C4E84]">
                  <span>Phase {phase.numberLabel}</span>
                </div>
              )
            )}
          </div>
        </button>

        {/* Stacked Folded Paper Thickness Layers when collapsed in timeline */}
        {!isExpanded && !isOverview && (
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

      {/* SINGLE UNIFIED SCROLLABLE UNFOLDED SHEET (No nested overflow-hidden or preserve-3d wrappers) */}
      <AnimatePresence initial={false}>
        {isExpanded && !isOverview && (
          <motion.div
            key="unfolded-sheet"
            initial={{ opacity: 0, y: -8, scaleY: 0.94 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{
              opacity: 0,
              y: -6,
              scaleY: 0.94,
              pointerEvents: 'none',
            }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            style={{
              transformOrigin: 'top center',
              maxHeight: maxScrollBodyHeight,
            }}
            className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain ipad-note-scroll notepaper-sheet border-x border-b border-[#C2B6A2] px-3.5 sm:px-4 pt-2.5 pb-3 space-y-2.5 text-[#173668]"
          >
            {/* Subtle top crease line where header meets unfolded sheet */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-0 right-0 h-5 bg-gradient-to-b from-[#4A3B28]/12 to-transparent"
            />

            {/* Kurzüberblick */}
            <div className="space-y-1.5">
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

            {/* Kernaussagen */}
            <div className="pt-2 border-t border-[#D8CFC0]">
              <h3 className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#2C4E84] mb-1">
                Kernaussagen
              </h3>
              <ul className="space-y-1 text-xs sm:text-[13px] leading-snug text-[#173668]">
                {event.eventsAndMeasures.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#9E2424] font-bold shrink-0">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Ausgesetzte Grundrechte (28. Feb) */}
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

            {/* Reichstagsabstimmung (23. Mär) */}
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

            {/* Reden im Reichstag (23. Mär) */}
            {event.quotes && event.quotes.length > 0 && (
              <div className="pt-2 border-t border-[#D8CFC0] space-y-1.5">
                <h3 className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#2C4E84]">
                  Reden im Reichstag
                </h3>
                {event.quotes.map((q, i) => (
                  <blockquote key={i} className="py-1 border-y border-[#D8CFC0]">
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

            {/* Akteure (Klickbare Mini-Profile mit Personenfoto oder Partei-/Organisationslogo) */}
            {event.actors.length > 0 && (
              <div className="pt-2 border-t border-[#D8CFC0]">
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
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
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="relative mt-2.5 bg-[#FAF4E6] border border-[#B8A58B] px-3 py-2.5 shadow-[0_4px_10px_rgba(45,28,10,0.16)]"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#9E2424] border border-[#681212]"
                      />
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <ActorAvatar name={selectedActor.name} size="md" />
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
