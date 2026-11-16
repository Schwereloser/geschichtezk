import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { PhaseId, TIMELINE_EVENTS } from './data/timelineData';
import { TimelineAxis } from './components/TimelineAxis';

const WINDOW_SIZE = 3;

export default function App() {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const maxStartIndex = Math.max(0, TIMELINE_EVENTS.length - WINDOW_SIZE);

  const handleGoToIndex = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(maxStartIndex, nextIndex));
      if (clamped === startIndex) return;
      setDirection(clamped > startIndex ? 1 : -1);
      setStartIndex(clamped);
    },
    [maxStartIndex, startIndex]
  );

  const handleJumpToPhase = useCallback(
    (phaseId: PhaseId) => {
      const idx = TIMELINE_EVENTS.findIndex((ev) => ev.phaseId === phaseId);
      if (idx >= 0) {
        handleGoToIndex(Math.min(idx, maxStartIndex));
      }
    },
    [handleGoToIndex, maxStartIndex]
  );

  // Arrow keys step 1 date forward/backward cleanly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleGoToIndex(startIndex - 1);
      } else if (e.key === 'ArrowRight') {
        handleGoToIndex(startIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGoToIndex, startIndex]);

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="h-dvh w-screen overflow-hidden flex flex-col kraft-paper-bg text-[#173668] p-2 sm:p-4">
        <main className="flex-1 min-h-0 flex flex-col max-w-[1440px] w-full mx-auto">
          <TimelineAxis
            events={TIMELINE_EVENTS}
            startIndex={startIndex}
            maxStartIndex={maxStartIndex}
            direction={direction}
            windowSize={WINDOW_SIZE}
            expandedIds={expandedIds}
            onToggleExpand={handleToggleExpand}
            onPrev={() => handleGoToIndex(startIndex - 1)}
            onNext={() => handleGoToIndex(startIndex + 1)}
            onJumpToPhase={handleJumpToPhase}
          />
        </main>
      </div>
    </MotionConfig>
  );
}
