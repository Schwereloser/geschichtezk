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
  const [causalHistory, setCausalHistory] = useState<string[]>([]);
  const [highlightedCausalEventId, setHighlightedCausalEventId] = useState<
    string | null
  >(null);
  const [autoIntroActive, setAutoIntroActive] = useState(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return false;
    }
    return true;
  });
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

  // Continuous intro sequence on initial load + short zoom-in transition from manual overview
  useEffect(() => {
    if (introStage === 'ready') return;

    if (introStage === 'overview') {
      if (!autoIntroActive) return;
      const t = window.setTimeout(() => setIntroStage('zoomCenter'), 2400);
      return () => window.clearTimeout(t);
    }

    if (introStage === 'zoomCenter') {
      const t = window.setTimeout(() => setIntroStage('panToStart'), 1150);
      return () => window.clearTimeout(t);
    }

    if (introStage === 'panToStart') {
      const t = window.setTimeout(() => {
        setAutoIntroActive(false);
        setIntroStage('ready');
      }, 1350);
      return () => window.clearTimeout(t);
    }

    if (introStage === 'zoomTarget') {
      const t = window.setTimeout(() => setIntroStage('ready'), 800);
      return () => window.clearTimeout(t);
    }
  }, [introStage, autoIntroActive]);

  const handleGoToIndex = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(minIndex, Math.min(maxIndex, nextIndex));
      setFocusedIndex(clamped);
    },
    [minIndex, maxIndex]
  );

  const handleManualGoToIndex = useCallback(
    (nextIndex: number) => {
      setCausalHistory([]);
      handleGoToIndex(nextIndex);
    },
    [handleGoToIndex]
  );

  const handleJumpToPhase = useCallback(
    (phaseId: PhaseId) => {
      const idx = TIMELINE_EVENTS.findIndex((ev) => ev.phaseId === phaseId);
      if (idx >= 0) {
        handleManualGoToIndex(idx);
      }
    },
    [handleManualGoToIndex]
  );

  const handleJumpToConclusion = useCallback(() => {
    handleManualGoToIndex(TIMELINE_EVENTS.length);
  }, [handleManualGoToIndex]);

  const handleJumpToEvent = useCallback(
    (eventId: string) => {
      const idx = TIMELINE_EVENTS.findIndex((ev) => ev.id === eventId);
      if (idx >= 0) {
        setCausalHistory([]);
        handleGoToIndex(idx);
        setExpandedIds((prev) =>
          prev.includes(eventId) ? prev : [...prev, eventId]
        );
      }
    },
    [handleGoToIndex]
  );

  const handleJumpCausal = useCallback(
    (fromEventId: string, targetEventId: string) => {
      const idx = TIMELINE_EVENTS.findIndex((ev) => ev.id === targetEventId);
      if (idx >= 0) {
        setCausalHistory((prev) => [...prev, fromEventId]);
        handleGoToIndex(idx);
        setExpandedIds((prev) =>
          prev.includes(targetEventId) ? prev : [...prev, targetEventId]
        );
      }
    },
    [handleGoToIndex]
  );

  const handleReturnCausal = useCallback(() => {
    setCausalHistory((prev) => {
      if (prev.length === 0) return prev;
      const previousId = prev[prev.length - 1];
      const idx = TIMELINE_EVENTS.findIndex((ev) => ev.id === previousId);
      if (idx >= 0) {
        handleGoToIndex(idx);
        setExpandedIds((exp) =>
          exp.includes(previousId) ? exp : [...exp, previousId]
        );
      }
      return prev.slice(0, -1);
    });
  }, [handleGoToIndex]);

  const handleOpenOverview = useCallback(() => {
    setAutoIntroActive(false);
    setIntroStage('overview');
  }, []);

  const handleToggleCausalHighlight = useCallback(
    (eventId: string, openOverview?: boolean) => {
      if (openOverview) {
        setHighlightedCausalEventId(eventId);
        handleOpenOverview();
        return;
      }
      setHighlightedCausalEventId((prev) =>
        prev === eventId ? null : eventId
      );
    },
    [handleOpenOverview]
  );

  const handleSelectOverviewSlot = useCallback(
    (slotIndex: number) => {
      setAutoIntroActive(false);
      setCausalHistory([]);
      handleGoToIndex(slotIndex);
      if (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        setIntroStage('ready');
      } else {
        setIntroStage('zoomTarget');
      }
    },
    [handleGoToIndex]
  );

  const handleResumeFromOverview = useCallback(() => {
    setAutoIntroActive(false);
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIntroStage('ready');
    } else {
      setIntroStage('zoomTarget');
    }
  }, []);

  const clampedFocusedIndex = Math.max(
    minIndex,
    Math.min(maxIndex, focusedIndex)
  );

  useEffect(() => {
    if (introStage !== 'ready') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handleManualGoToIndex(clampedFocusedIndex - 1);
      } else if (e.key === 'ArrowRight') {
        handleManualGoToIndex(clampedFocusedIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleManualGoToIndex, introStage, clampedFocusedIndex]);

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const causalOriginEventId =
    causalHistory.length > 0 ? causalHistory[causalHistory.length - 1] : null;

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
            highlightedCausalEventId={highlightedCausalEventId}
            causalOriginEventId={causalOriginEventId}
            onSkipIntro={() => {
              setAutoIntroActive(false);
              setIntroStage('ready');
            }}
            onOpenOverview={handleOpenOverview}
            onSelectOverviewSlot={handleSelectOverviewSlot}
            onResumeFromOverview={handleResumeFromOverview}
            onToggleExpand={handleToggleExpand}
            onPrev={() => handleManualGoToIndex(clampedFocusedIndex - 1)}
            onNext={() => handleManualGoToIndex(clampedFocusedIndex + 1)}
            onCenterIndex={handleManualGoToIndex}
            onJumpToPhase={handleJumpToPhase}
            onJumpToConclusion={handleJumpToConclusion}
            onJumpToEvent={handleJumpToEvent}
            onJumpCausal={handleJumpCausal}
            onReturnCausal={handleReturnCausal}
            onToggleCausalHighlight={handleToggleCausalHighlight}
            onClearCausalHighlight={() => setHighlightedCausalEventId(null)}
          />
        </main>
      </div>
    </MotionConfig>
  );
}
