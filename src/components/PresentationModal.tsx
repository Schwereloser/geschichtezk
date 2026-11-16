import { useEffect } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { PHASES, TimelineEvent } from '../data/timelineData';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: TimelineEvent[];
  currentIndex: number;
  onChangeIndex: (index: number) => void;
}

export function PresentationModal({
  isOpen,
  onClose,
  events,
  currentIndex,
  onChangeIndex,
}: PresentationModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) onChangeIndex(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < events.length - 1) onChangeIndex(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, events.length, onClose, onChangeIndex]);

  if (!isOpen || events.length === 0) return null;

  const event = events[currentIndex] ?? events[0];
  const phase = PHASES.find((p) => p.id === event.phaseId);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Präsentationsmodus: Einrichtung und Sicherung der NS-Diktatur"
      className="fixed inset-0 z-50 bg-[#F7F4EE] text-[#1C1917] flex flex-col overflow-y-auto"
    >
      {/* Top Bar */}
      <div className="border-b border-[#D6CEBE] px-4 sm:px-8 py-4 flex items-center justify-between gap-6 bg-[#FBF9F5]">
        <div className="text-xs font-mono uppercase tracking-[0.12em] text-[#57534E] tabular-nums">
          Präsentationsmodus · Station {currentIndex + 1} von {events.length}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium border border-[#C7BEAC] bg-[#F7F4EE] text-[#1C1917] hover:bg-[#1C1917] hover:text-[#FBF9F5] transition-colors cursor-pointer"
        >
          <span>Schließen</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Slide Body */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 sm:py-14 flex flex-col justify-between">
        <div>
          <p className="text-sm font-mono text-[#8C2D19] tabular-nums">
            {event.dateLabel}
            {phase ? ` · Phase ${phase.numberLabel}: ${phase.title}` : ''}
          </p>

          <h2 className="mt-3 font-serif text-3xl sm:text-5xl font-semibold text-[#1C1917] leading-tight text-balance">
            {event.title}
          </h2>

          {event.officialTitle && (
            <p className="mt-3 text-base sm:text-lg font-serif italic text-[#57534E]">
              {event.officialTitle}
            </p>
          )}

          <p className="mt-6 text-lg sm:text-xl text-[#292524] leading-relaxed">
            {event.summary}
          </p>

          <div className="mt-8 pt-6 border-t border-[#D6CEBE] grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.12em] text-[#57534E] mb-3">
                Ereignisse &amp; Maßnahmen
              </h3>
              <ul className="space-y-2.5 text-base text-[#1C1917] leading-relaxed">
                {event.eventsAndMeasures.map((m, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#8C2D19] mt-1.5 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              {event.actors.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-[0.12em] text-[#57534E] mb-3">
                    Beteiligte
                  </h3>
                  <ul className="space-y-1.5 text-sm text-[#292524]">
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

              {event.quotes && event.quotes.length > 0 && (
                <div className="py-4 border-y border-[#D6CEBE]">
                  <p className="font-serif italic text-lg text-[#1C1917]">
                    {event.quotes[1]?.text ?? event.quotes[0].text}
                  </p>
                  <p className="mt-1.5 text-xs font-mono text-[#57534E]">
                    {event.quotes[0].speaker}
                  </p>
                </div>
              )}

              {event.suspendedRights && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-[0.12em] text-[#8C2D19] mb-2">
                    Ausgesetzte Grundrechte
                  </h3>
                  <p className="text-sm text-[#292524]">
                    {event.suspendedRights.join(' · ')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="mt-12 pt-6 border-t border-[#D6CEBE] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => currentIndex > 0 && onChangeIndex(currentIndex - 1)}
            disabled={currentIndex <= 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium border border-[#C7BEAC] bg-[#FBF9F5] text-[#1C1917] hover:bg-[#EBE6DF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Vorherige Station</span>
          </button>

          <span className="hidden sm:inline text-xs font-mono text-[#78716C]">
            Steuerung per Pfeiltasten (← / →) oder Esc
          </span>

          <button
            type="button"
            onClick={() =>
              currentIndex < events.length - 1 &&
              onChangeIndex(currentIndex + 1)
            }
            disabled={currentIndex >= events.length - 1}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#8C2D19] text-[#FBF9F5] hover:bg-[#702313] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span>Nächste Station</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
