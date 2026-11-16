import { useEffect, useState } from 'react';
import {
  GUIDING_QUESTION,
  PhaseId,
  TIMELINE_EVENTS,
} from './data/timelineData';
import { PresentationModal } from './components/PresentationModal';
import { TimelineAxis } from './components/TimelineAxis';
import { TopBar } from './components/TopBar';

export default function App() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(
    TIMELINE_EVENTS[0].id
  );
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  const selectedIndex = selectedEventId
    ? TIMELINE_EVENTS.findIndex((e) => e.id === selectedEventId)
    : -1;

  const activePhaseId =
    selectedIndex >= 0 ? TIMELINE_EVENTS[selectedIndex].phaseId : null;

  // Arrow key navigation when presentation modal is closed
  useEffect(() => {
    if (isPresentationOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedEventId !== null) {
        setSelectedEventId(null);
      } else if (e.key === 'ArrowLeft') {
        if (selectedIndex > 0) {
          setSelectedEventId(TIMELINE_EVENTS[selectedIndex - 1].id);
        } else if (selectedIndex === -1) {
          setSelectedEventId(TIMELINE_EVENTS[0].id);
        }
      } else if (e.key === 'ArrowRight') {
        if (selectedIndex >= 0 && selectedIndex < TIMELINE_EVENTS.length - 1) {
          setSelectedEventId(TIMELINE_EVENTS[selectedIndex + 1].id);
        } else if (selectedIndex === -1) {
          setSelectedEventId(TIMELINE_EVENTS[0].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationOpen, selectedEventId, selectedIndex]);

  const handleJumpToPhase = (phaseId: PhaseId) => {
    const firstInPhase = TIMELINE_EVENTS.find((ev) => ev.phaseId === phaseId);
    if (firstInPhase) {
      setSelectedEventId(firstInPhase.id);
    }
  };

  const presentationIndex = Math.max(0, selectedIndex);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F4EE] text-[#1C1917]">
      <TopBar
        activePhaseId={activePhaseId}
        onJumpToPhase={handleJumpToPhase}
        onOpenPresentation={() => setIsPresentationOpen(true)}
      />

      <main id="zeitstrahl" className="flex-1 py-6 sm:py-8">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-5">
          {/* Compact Title & Guiding Question */}
          <div className="pb-4 border-b border-[#D6CEBE] flex flex-col lg:flex-row lg:items-end justify-between gap-3">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1C1917] leading-tight text-balance">
                Einrichtung und Sicherung der NS-Diktatur (1933–1934)
              </h1>
              <p className="mt-1.5 text-sm text-[#44403C]">
                <span className="font-mono text-xs uppercase tracking-wider text-[#8C2D19] mr-2">
                  Leitfrage:
                </span>
                <span className="font-serif italic text-[#1C1917]">
                  „{GUIDING_QUESTION}“
                </span>
              </p>
            </div>
            <p className="text-xs font-mono text-[#57534E] shrink-0">
              Zeitstrahl horizontal scrollen · Punkt anklicken für Notizzettel
            </p>
          </div>

          {/* Scrollable Timeline with Pinned Notizzettel */}
          <TimelineAxis
            events={TIMELINE_EVENTS}
            selectedEventId={selectedEventId}
            onSelectEvent={setSelectedEventId}
          />
        </div>
      </main>

      <PresentationModal
        isOpen={isPresentationOpen}
        onClose={() => setIsPresentationOpen(false)}
        events={TIMELINE_EVENTS}
        currentIndex={presentationIndex}
        onChangeIndex={(idx) => {
          const target = TIMELINE_EVENTS[idx];
          if (target) setSelectedEventId(target.id);
        }}
      />
    </div>
  );
}
