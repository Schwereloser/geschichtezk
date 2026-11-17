import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { PhaseId, TIMELINE_EVENTS } from './data/timelineData';
import { IntroStage, TimelineAxis } from './components/TimelineAxis';

function useVisibleSlotCount(): number {
  const [visibleCount, setVisibleCount] = useState(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 1;
    }
    return 3;
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const update = () => setVisibleCount(mq.matches ? 3 : 1);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  return visibleCount;
}

export default function App() {
  const visibleCount = useVisibleSlotCount();
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [introStage, setIntroStage] = useState<IntroStage>(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return 'ready';
    }
    return 'overview';
  });

  const minIndex = 0;
  const maxIndex = TIMELINE_EVENTS.length + 2;

  // Continuous intro sequence:
  // 1. overview (longer full-timeline view) -> 2. zoomCenter (zoom into middle) -> 3. panToStart (pan left to start) -> 4. ready
  useEffect(() => {
    if (introStage === 'ready') return;

    if (introStage === 'overview') {
      const t = window.setTimeout(() => setIntroStage('zoomCenter'), 2400);
      return () => window.clearTimeout(t);
    }

    if (introStage === 'zoomCenter') {
      const t = window.setTimeout(() => setIntroStage('panToStart'), 1150);
      return () => window.clearTimeout(t);
    }

    if (introStage === 'panToStart') {
      const t = window.setTimeout(() => setIntroStage('ready'), 1350);
      return () => window.clearTimeout(t);
    }
  }, [introStage]);

  const handleGoToIndex = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(minIndex, Math.min(maxIndex, nextIndex));
      setFocusedIndex(clamped);
    },
    [minIndex, maxIndex]
  );

  const handleJumpToPhase = useCallback(
    (phaseId: PhaseId) => {
      const idx = TIMELINE_EVENTS.findIndex((ev) => ev.phaseId === phaseId);
      if (idx >= 0) {
        handleGoToIndex(idx);
      }
    },
    [handleGoToIndex]
  );

  const handleJumpToConclusion = useCallback(() => {
    handleGoToIndex(TIMELINE_EVENTS.length);
  }, [handleGoToIndex]);

  const handleJumpToEvent = useCallback(
    (eventId: string) => {
      const idx = TIMELINE_EVENTS.findIndex((ev) => ev.id === eventId);
      if (idx >= 0) {
        handleGoToIndex(idx);
      }
    },
    [handleGoToIndex]
  );

  const clampedFocusedIndex = Math.max(
    minIndex,
    Math.min(maxIndex, focusedIndex)
  );

  useEffect(() => {
    if (introStage !== 'ready') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleGoToIndex(clampedFocusedIndex - 1);
      } else if (e.key === 'ArrowRight') {
        handleGoToIndex(clampedFocusedIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGoToIndex, introStage, clampedFocusedIndex]);

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="h-dvh w-screen overflow-hidden flex flex-col text-[#173668]">
        <main className="flex-1 min-h-0 flex flex-col w-full h-full wood-pinboard-frame p-1.5 sm:p-2.5">
          <TimelineAxis
            events={TIMELINE_EVENTS}
            focusedIndex={clampedFocusedIndex}
            minIndex={minIndex}
            maxIndex={maxIndex}
            visibleCount={visibleCount}
            expandedIds={expandedIds}
            introStage={introStage}
            onSkipIntro={() => setIntroStage('ready')}
            onToggleExpand={handleToggleExpand}
            onPrev={() => handleGoToIndex(clampedFocusedIndex - 1)}
            onNext={() => handleGoToIndex(clampedFocusedIndex + 1)}
            onCenterIndex={handleGoToIndex}
            onJumpToPhase={handleJumpToPhase}
            onJumpToConclusion={handleJumpToConclusion}
            onJumpToEvent={handleJumpToEvent}
          />
        </main>
      </div>
    </MotionConfig>
  );
}
