import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PHASES, TimelineEvent } from '../data/timelineData';

interface TimelineAxisProps {
  events: TimelineEvent[];
  selectedEventId: string | null;
  onSelectEvent: (id: string | null) => void;
}

const SLOT_WIDTH = 240; // Generous width per station so nothing ever overlaps
const TRACK_PADDING_X = 160; // Room on both ends so edge notes never clip

export function TimelineAxis({
  events,
  selectedEventId,
  onSelectEvent,
}: TimelineAxisProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const noteScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef<{ startX: number; scrollLeft: number; moved: boolean }>({
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const selectedIndex = selectedEventId
    ? events.findIndex((e) => e.id === selectedEventId)
    : -1;

  // Smoothly scroll the timeline container to center the selected station
  useEffect(() => {
    if (!scrollRef.current || selectedIndex < 0) return;
    const container = scrollRef.current;
    const nodeCenterX =
      TRACK_PADDING_X + selectedIndex * SLOT_WIDTH + SLOT_WIDTH / 2;
    const targetScrollLeft = nodeCenterX - container.clientWidth / 2;

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth',
    });

    if (noteScrollRef.current) {
      noteScrollRef.current.scrollTop = 0;
    }
  }, [selectedIndex]);

  // Translate vertical mouse wheel into horizontal timeline scrolling when not scrolling inside a note
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target && target.closest('[data-note-scroll="true"]')) {
      return;
    }
    if (!scrollRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  // Drag-to-scroll along the timeline canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target && (target.closest('button') || target.closest('[data-note-card="true"]'))) {
      return;
    }
    if (!scrollRef.current) return;
    setIsDragging(true);
    dragState.current = {
      startX: e.pageX - scrollRef.current.offsetLeft,
      scrollLeft: scrollRef.current.scrollLeft,
      moved: false,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - dragState.current.startX;
    if (Math.abs(walk) > 4) {
      dragState.current.moved = true;
    }
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - walk;
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const handleStep = (dir: -1 | 1) => {
    if (events.length === 0) return;
    if (selectedIndex < 0) {
      onSelectEvent(events[0].id);
      return;
    }
    const nextIdx = Math.max(
      0,
      Math.min(events.length - 1, selectedIndex + dir)
    );
    onSelectEvent(events[nextIdx].id);
  };

  const scrollTrackBy = (delta: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const totalWidth = TRACK_PADDING_X * 2 + events.length * SLOT_WIDTH;

  return (
    <div className="bg-[#FBF9F5] border border-[#D6CEBE] flex flex-col">
      {/* Compact Timeline Control Strip */}
      <div className="px-4 sm:px-6 py-3 border-b border-[#E5DFD3] flex flex-wrap items-center justify-between gap-3 bg-[#F7F4EE]/70">
        <div className="flex items-center gap-3 text-xs font-mono text-[#57534E]">
          <span>
            {selectedIndex >= 0
              ? `Station ${selectedIndex + 1} / ${events.length} angeheftet`
              : `${events.length} Stationen · Punkt anklicken für Notizzettel`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollTrackBy(-480)}
            aria-label="Zeitstrahl nach links scrollen"
            className="hidden sm:inline-flex items-center px-2.5 h-8 border border-[#D6CEBE] bg-[#FBF9F5] text-xs font-mono text-[#57534E] hover:text-[#1C1917] hover:bg-[#EBE6DF] transition-colors cursor-pointer"
          >
            « Scrollen
          </button>
          <button
            type="button"
            onClick={() => handleStep(-1)}
            disabled={selectedIndex === 0}
            aria-label="Vorherige Station"
            className="inline-flex items-center gap-1 px-3 h-8 border border-[#C7BEAC] bg-[#FBF9F5] text-xs font-medium text-[#1C1917] hover:bg-[#EBE6DF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Vorherige</span>
          </button>
          <button
            type="button"
            onClick={() => handleStep(1)}
            disabled={selectedIndex === events.length - 1}
            aria-label="Nächste Station"
            className="inline-flex items-center gap-1 px-3 h-8 border border-[#C7BEAC] bg-[#FBF9F5] text-xs font-medium text-[#1C1917] hover:bg-[#EBE6DF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span>Nächste</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => scrollTrackBy(480)}
            aria-label="Zeitstrahl nach rechts scrollen"
            className="hidden sm:inline-flex items-center px-2.5 h-8 border border-[#D6CEBE] bg-[#FBF9F5] text-xs font-mono text-[#57534E] hover:text-[#1C1917] hover:bg-[#EBE6DF] transition-colors cursor-pointer"
          >
            Scrollen »
          </button>
        </div>
      </div>

      {/* Horizontally Scrollable Timeline Canvas */}
      <div
        ref={scrollRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className={`relative overflow-x-auto overflow-y-visible select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div
          style={{ width: `${totalWidth}px` }}
          className="relative min-h-[620px] pt-10 pb-12"
        >
          {/* Main Horizontal Axis Line */}
          <div className="absolute left-8 right-8 top-[128px] h-px bg-[#B8AE9D]" />

          {/* Station Slots */}
          {events.map((event, idx) => {
            const isSelected = event.id === selectedEventId;
            const phase = PHASES.find((p) => p.id === event.phaseId);
            const prevPhaseId = idx > 0 ? events[idx - 1].phaseId : null;
            const isPhaseStart = phase && phase.id !== prevPhaseId;
            const leftPx = TRACK_PADDING_X + idx * SLOT_WIDTH;

            const totalVotes = event.voteResult
              ? event.voteResult.yes + event.voteResult.no
              : 0;
            const yesPercent = event.voteResult
              ? Math.round((event.voteResult.yes / totalVotes) * 100)
              : 0;

            return (
              <div
                key={event.id}
                style={{ left: `${leftPx}px`, width: `${SLOT_WIDTH}px` }}
                className={`absolute top-0 bottom-0 flex flex-col items-center ${
                  isSelected ? 'z-30' : 'z-10'
                }`}
              >
                {/* Phase Marker Above the Axis */}
                <div className="h-[68px] flex flex-col justify-end items-center text-center px-2 pb-3">
                  {isPhaseStart && phase && (
                    <div className="border-b border-[#8C2D19]/40 pb-1">
                      <span className="block text-[10px] font-mono uppercase tracking-[0.12em] text-[#8C2D19] whitespace-nowrap">
                        Phase {phase.numberLabel} · {phase.periodLabel}
                      </span>
                      <span className="block text-xs font-serif font-semibold text-[#1C1917] whitespace-nowrap">
                        {phase.title}
                      </span>
                    </div>
                  )}
                </div>

                {/* Date above the node */}
                <div className="h-[34px] flex items-end justify-center pb-1.5">
                  <span
                    className={`text-xs font-mono tabular-nums whitespace-nowrap ${
                      isSelected
                        ? 'text-[#8C2D19] font-medium'
                        : 'text-[#57534E]'
                    }`}
                  >
                    {event.dateLabel}
                  </span>
                </div>

                {/* Clickable Timeline Node on the Axis */}
                <div className="relative z-20 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() =>
                      onSelectEvent(isSelected ? null : event.id)
                    }
                    aria-expanded={isSelected}
                    aria-label={`${event.dateLabel}: ${event.title}`}
                    className={`flex items-center justify-center w-11 h-11 font-mono text-xs tabular-nums transition-transform duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C2D19] ${
                      isSelected
                        ? 'bg-[#8C2D19] text-[#FBF9F5] scale-110 font-medium shadow-sm'
                        : 'bg-[#F7F4EE] text-[#1C1917] border border-[#9E9484] hover:border-[#1C1917] hover:bg-[#EBE6DF]'
                    }`}
                  >
                    {event.indexNumber}
                  </button>
                </div>

                {/* Short Title Below Node when NOT selected */}
                {!isSelected && (
                  <button
                    type="button"
                    onClick={() => onSelectEvent(event.id)}
                    className="mt-3 px-4 text-center cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C2D19]"
                  >
                    <p className="font-serif text-[15px] font-medium text-[#1C1917] group-hover:text-[#8C2D19] leading-snug transition-colors">
                      {event.title}
                    </p>
                    <p className="mt-1 text-[11px] font-mono text-[#78716C] group-hover:text-[#1C1917] transition-colors">
                      Notiz ansehen
                    </p>
                  </button>
                )}

                {/* Pinned Archival Note ("Notizzettel") Stuck Directly to the Selected Point */}
                {isSelected && (
                  <div
                    data-note-card="true"
                    className="relative z-30 flex flex-col items-center"
                  >
                    {/* Vertical Pin Stem + Archival Tape Strip */}
                    <div className="w-px h-4 bg-[#8C2D19]" />
                    <div
                      aria-hidden="true"
                      className="w-20 h-4 -mb-2 bg-[#E6DEC8]/90 border border-[#C7BEAC]/80 rotate-[-1.5deg] shadow-xs z-10"
                    />

                    {/* Sticky Paper Note Card */}
                    <article
                      aria-live="polite"
                      className="w-[340px] sm:w-[410px] bg-[#FFFDF8] border border-[#C7BEAC] shadow-[0_14px_34px_-8px_rgba(28,25,23,0.22)] text-left"
                    >
                      {/* Note Header */}
                      <div className="px-5 pt-5 pb-3.5 border-b border-[#E8E1D3] flex items-start justify-between gap-3 bg-[#FAF6EC]">
                        <div className="min-w-0">
                          <p className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#8C2D19] tabular-nums">
                            Notizzettel · {event.indexNumber} · {event.dateLabel}
                          </p>
                          <h2 className="mt-1 font-serif text-xl font-semibold text-[#1C1917] leading-snug">
                            {event.title}
                          </h2>
                          {event.officialTitle && (
                            <p className="mt-1 text-xs font-serif italic text-[#57534E]">
                              {event.officialTitle}
                            </p>
                          )}
                          {event.location && (
                            <p className="mt-1 text-[11px] font-mono text-[#57534E]">
                              Ort: {event.location}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onSelectEvent(null)}
                          aria-label="Notizzettel schließen"
                          className="p-1.5 text-[#57534E] hover:text-[#1C1917] hover:bg-[#EBE6DF] transition-colors cursor-pointer shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Scrollable Note Body */}
                      <div
                        data-note-scroll="true"
                        className="px-5 py-4 max-h-[370px] overflow-y-auto space-y-4 select-text cursor-auto"
                      >
                        <p className="text-sm text-[#292524] leading-relaxed">
                          {event.summary}
                        </p>

                        {event.historicalCorrection && (
                          <div className="py-2.5 px-3 border-y border-[#D6CEBE] bg-[#F7F4EE]">
                            <p className="text-[10px] font-mono uppercase tracking-wider text-[#8C2D19] mb-1">
                              Quellenhinweis zur Datierung
                            </p>
                            <p className="text-xs text-[#292524] leading-relaxed">
                              {event.historicalCorrection}
                            </p>
                          </div>
                        )}

                        {/* Measures */}
                        <div className="pt-3 border-t border-[#EFEAE0]">
                          <h3 className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#57534E] mb-2">
                            Ereignisse &amp; Maßnahmen
                          </h3>
                          <ul className="space-y-1.5 text-[13px] text-[#1C1917] leading-relaxed">
                            {event.eventsAndMeasures.map((item, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="font-mono text-[11px] text-[#8C2D19] mt-0.5 tabular-nums shrink-0">
                                  {String(i + 1).padStart(2, '0')}
                                </span>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Suspended Rights */}
                        {event.suspendedRights && (
                          <div className="pt-3 border-t border-[#EFEAE0]">
                            <h3 className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#8C2D19] mb-2">
                              Ausgesetzte Grundrechte
                            </h3>
                            <ul className="grid grid-cols-1 gap-1 text-xs text-[#1C1917]">
                              {event.suspendedRights.map((r) => (
                                <li key={r}>· {r}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Vote Result */}
                        {event.voteResult && (
                          <div className="pt-3 border-t border-[#EFEAE0]">
                            <div className="flex items-baseline justify-between text-[11px] font-mono mb-1.5">
                              <span className="uppercase tracking-wider text-[#57534E]">
                                Abstimmung
                              </span>
                              <span className="text-[#1C1917] tabular-nums">
                                {event.voteResult.yes} Ja ·{' '}
                                {event.voteResult.no} Nein
                              </span>
                            </div>
                            <div className="w-full h-2 bg-[#E5DFD3] flex overflow-hidden">
                              <div
                                style={{ width: `${yesPercent}%` }}
                                className="h-full bg-[#1C1917]"
                              />
                              <div
                                style={{ width: `${100 - yesPercent}%` }}
                                className="h-full bg-[#8C2D19]"
                              />
                            </div>
                            <p className="mt-2 text-xs font-medium text-[#8C2D19]">
                              {event.voteResult.note}
                            </p>
                            {event.voteResult.details.map((d, i) => (
                              <p key={i} className="mt-1 text-xs text-[#44403C]">
                                · {d}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* Quotes */}
                        {event.quotes && event.quotes.length > 0 && (
                          <div className="pt-3 border-t border-[#EFEAE0] space-y-3">
                            <h3 className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#57534E]">
                              Rede Otto Wels (Auszüge)
                            </h3>
                            {event.quotes.map((q, i) => (
                              <blockquote
                                key={i}
                                className="py-2.5 border-y border-[#E5DFD3]"
                              >
                                <p className="font-serif italic text-sm text-[#1C1917] leading-snug">
                                  {q.text}
                                </p>
                              </blockquote>
                            ))}
                            {event.welsSpeechPoints && (
                              <ul className="space-y-1 text-xs text-[#44403C]">
                                {event.welsSpeechPoints.map((pt, i) => (
                                  <li key={i}>· {pt}</li>
                                ))}
                              </ul>
                            )}
                            {event.hitlerReplyPoints && (
                              <div className="pt-2 border-t border-[#EFEAE0]">
                                <p className="text-[11px] font-mono uppercase tracking-wider text-[#57534E] mb-1">
                                  Antwortrede Hitlers
                                </p>
                                <ul className="space-y-1 text-xs text-[#44403C]">
                                  {event.hitlerReplyPoints.map((pt, i) => (
                                    <li key={i}>· {pt}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {event.sourceWorkNote && (
                              <p className="text-[11px] italic text-[#57534E]">
                                {event.sourceWorkNote}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Actors */}
                        {event.actors.length > 0 && (
                          <div className="pt-3 border-t border-[#EFEAE0]">
                            <h3 className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#57534E] mb-2">
                              Beteiligte
                            </h3>
                            <ul className="space-y-1 text-xs text-[#292524]">
                              {event.actors.map((a) => (
                                <li key={a.name}>
                                  <strong className="font-medium text-[#1C1917]">
                                    {a.name}
                                  </strong>
                                  {a.role ? ` — ${a.role}` : ''}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Context Notes */}
                        {event.contextNotes &&
                          event.contextNotes.length > 0 && (
                            <div className="pt-3 border-t border-[#EFEAE0]">
                              <h3 className="text-[11px] font-mono uppercase tracking-[0.1em] text-[#57534E] mb-1.5">
                                Einordnung
                              </h3>
                              <ul className="space-y-1 text-xs text-[#44403C] leading-relaxed">
                                {event.contextNotes.map((n, i) => (
                                  <li key={i}>· {n}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                      </div>

                      {/* Note Footer */}
                      <div className="px-5 py-2.5 border-t border-[#E8E1D3] bg-[#FAF6EC] flex items-center justify-between text-[11px] font-mono">
                        <button
                          type="button"
                          onClick={() => handleStep(-1)}
                          disabled={selectedIndex <= 0}
                          className="text-[#1C1917] hover:text-[#8C2D19] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                        >
                          ← Vorheriger
                        </button>
                        <span className="text-[#78716C] tabular-nums">
                          {idx + 1} / {events.length}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleStep(1)}
                          disabled={selectedIndex >= events.length - 1}
                          className="text-[#1C1917] hover:text-[#8C2D19] disabled:opacity-35 cursor-pointer disabled:cursor-not-allowed"
                        >
                          Nächster →
                        </button>
                      </div>
                    </article>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
