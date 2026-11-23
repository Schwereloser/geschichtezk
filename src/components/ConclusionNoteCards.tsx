import { useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Ban,
  BookOpen,
  CheckCircle2,
  CheckSquare,
  Circle,
  HelpCircle,
  Layers,
  ShieldCheck,
  Square,
  XCircle,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CHECK_QUESTIONS,
  POWER_PILLARS,
  SNAPSHOT_STAGES,
  SnapshotStageId,
  SnapshotStatus,
} from '../data/conclusionData';

interface BaseConclusionNoteProps {
  isExpandedArea: boolean;
  isCentered: boolean;
  isOverview: boolean;
  showControls: boolean;
  isCurrentlyVisible: boolean;
  onJumpToEvent: (eventId: string) => void;
  onFocusSelf: () => void;
}

const SNAPSHOT_STATUS_META: Record<
  SnapshotStatus,
  {
    cardClass: string;
    domainClass: string;
    bodyClass: string;
    badgeClass: string;
    linkClass: string;
    Icon: typeof ShieldCheck;
  }
> = {
  intact: {
    cardClass: 'bg-white/75 border-[#C2B6A2]',
    domainClass: 'text-[#173668]',
    bodyClass: 'text-[#284B82]',
    badgeClass: 'text-[#173668]',
    linkClass: 'text-[#2C4E84] hover:text-[#9E2424]',
    Icon: ShieldCheck,
  },
  attacked: {
    cardClass: 'bg-[#F5E7CA] border-[#B68634]',
    domainClass: 'text-[#5C3A06]',
    bodyClass: 'text-[#6A440B]',
    badgeClass: 'text-[#7C4B05]',
    linkClass: 'text-[#7C4B05] hover:text-[#9E2424]',
    Icon: AlertTriangle,
  },
  controlled: {
    cardClass: 'bg-[#B52828] border-[#781212]',
    domainClass: 'text-[#FFFFFF]',
    bodyClass: 'text-[#FAF4E6]/95',
    badgeClass: 'text-[#FFF2DF]',
    linkClass: 'text-[#FFF2DF] hover:text-white',
    Icon: Ban,
  },
};

function CollapsedConclusionCover({
  kicker,
  overviewLabel,
  title,
  subtitle,
  tiltClass,
  Icon,
  isOverview,
  showControls,
  isCurrentlyVisible,
  onFocusSelf,
}: {
  kicker: string;
  overviewLabel: string;
  title: string;
  subtitle: string;
  tiltClass: string;
  Icon: typeof Layers;
  isOverview: boolean;
  showControls: boolean;
  isCurrentlyVisible: boolean;
  onFocusSelf: () => void;
}) {
  return (
    <article
      className={`relative w-full flex flex-col border transition-colors ${
        isOverview
          ? `flex-1 h-full bg-[#F3E7C2] border-[#9E2424]/60 hover:border-[#9E2424] shadow-[2px_5px_12px_rgba(38,20,6,0.3)] hover:shadow-[4px_10px_20px_rgba(38,20,6,0.42)]`
          : `notepaper-sheet border-[#A69274] shadow-[0_10px_22px_-6px_rgba(45,28,10,0.34)] ${tiltClass}`
      }`}
    >
      <span
        aria-hidden="true"
        className="masking-tape w-9 h-2.5 -rotate-12 absolute -top-1.5 -left-2"
      />
      <span
        aria-hidden="true"
        className="masking-tape w-9 h-2.5 rotate-12 absolute -top-1.5 -right-2"
      />

      <button
        type="button"
        disabled={!isOverview && !showControls}
        tabIndex={isOverview || (isCurrentlyVisible && showControls) ? 0 : -1}
        onClick={(e) => {
          e.stopPropagation();
          onFocusSelf();
        }}
        className={`w-full text-left cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9E2424] group ${
          isOverview
            ? 'flex-1 flex flex-col justify-between px-2.5 py-2'
            : 'px-3.5 py-2.5'
        }`}
      >
        <div>
          <div className="flex items-center justify-between gap-1.5">
            <span
              className={`inline-block font-mono font-semibold text-[#9E2424] truncate ${
                isOverview
                  ? 'text-[9.5px] xl:text-[10px] uppercase tracking-wider'
                  : 'text-[11px]'
              }`}
            >
              {isOverview ? overviewLabel : kicker}
            </span>
            <Icon
              className={`text-[#2C4E84] group-hover:text-[#9E2424] transition-colors shrink-0 ${
                isOverview ? 'w-3 h-3' : 'w-4 h-4'
              }`}
            />
          </div>

          <h2
            className={`mt-1 font-serif font-semibold text-[#173668] leading-snug ${
              isOverview
                ? 'text-[11px] sm:text-xs xl:text-[13px] font-bold line-clamp-2'
                : 'text-base sm:text-[17px] leading-tight'
            }`}
          >
            {title}
          </h2>
        </div>

        <div
          className={`mt-1.5 pt-1 border-t flex items-center justify-between text-[#2C4E84] ${
            isOverview
              ? 'border-[#D2BE92] text-[9.5px] font-mono'
              : 'mt-2 pt-1.5 border-[#D6CBBA] text-[10.5px]'
          }`}
        >
          <span className="truncate">{subtitle}</span>
          <span className="font-mono text-[#9E2424] shrink-0 ml-2">
            {isOverview ? '→' : 'Öffnen →'}
          </span>
        </div>
      </button>

      {!isOverview && (
        <div
          aria-hidden="true"
          className="h-1.5 mx-1.5 -mb-1.5 bg-[#EAE3D5] border-x border-b border-[#C2B6A2]"
        />
      )}
    </article>
  );
}

/* ============================================================================
 * 1. NOTIZZETTEL: VORHER / NACHHER (30. Jan -> 23. Mär -> 20. Jul 1933)
 * ========================================================================== */
export function ConclusionCompareNote({
  isExpandedArea,
  isCentered,
  isOverview,
  showControls,
  isCurrentlyVisible,
  onJumpToEvent,
  onFocusSelf,
}: BaseConclusionNoteProps) {
  const [snapshotId, setSnapshotId] = useState<SnapshotStageId>('jan-30');
  const activeStage =
    SNAPSHOT_STAGES.find((s) => s.id === snapshotId) ?? SNAPSHOT_STAGES[0];

  if (!isExpandedArea || isOverview) {
    return (
      <CollapsedConclusionCover
        kicker="Abschluss 1 · Vergleich"
        overviewLabel="Bilanz 1 · Vergleich"
        title="Vorher / Nachher (1933)"
        subtitle="Zustand Jan · Mär · Jul"
        tiltClass="rotate-[0.6deg]"
        Icon={Layers}
        isOverview={isOverview}
        showControls={showControls}
        isCurrentlyVisible={isCurrentlyVisible}
        onFocusSelf={onFocusSelf}
      />
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0.75, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      aria-label="Abschluss-Notizzettel 1: Vorher und Nachher 1933"
      className={`relative w-[99%] flex flex-col min-h-0 max-h-full notepaper-sheet border ${
        isCentered
          ? 'border-[#9E2424]/75 shadow-[0_20px_42px_-10px_rgba(45,28,10,0.45)]'
          : 'border-[#A69274] shadow-[0_14px_30px_-8px_rgba(45,28,10,0.36)]'
      } -rotate-[0.45deg]`}
    >
      <span
        aria-hidden="true"
        className="masking-tape w-10 h-2.5 -rotate-12 absolute -top-1.5 -left-2 z-20"
      />
      <span
        aria-hidden="true"
        className="masking-tape w-10 h-2.5 rotate-12 absolute -top-1.5 -right-2 z-20"
      />

      {/* Header */}
      <div className="shrink-0 px-4 sm:px-6 pt-4 pb-3 border-b border-[#C6B8A1]">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#9E2424] font-semibold">
              Bilanz 1 · Zustandsvergleich
            </span>
            <h2 className="mt-0.5 font-serif text-lg sm:text-xl font-bold text-[#173668] leading-tight">
              Vorher / Nachher (1933)
            </h2>
          </div>

          {/* Time Stage Switcher */}
          <div className="grid grid-cols-3 gap-1.5 w-full md:w-auto md:min-w-[330px]">
            {SNAPSHOT_STAGES.map((stage) => {
              const isActive = stage.id === snapshotId;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setSnapshotId(stage.id)}
                  className={`min-h-[44px] px-2.5 py-1.5 border text-left transition-colors cursor-pointer touch-manipulation ${
                    isActive
                      ? 'bg-[#9E2424] border-[#681212] text-[#FAF4E6] shadow-xs'
                      : 'bg-[#FAF6EC] border-[#C2B6A2] text-[#173668] hover:border-[#173668]'
                  }`}
                >
                  <span
                    className={`block font-mono text-[10px] uppercase tracking-wider tabular-nums ${
                      isActive ? 'text-[#FFE2C8]' : 'text-[#9E2424]'
                    }`}
                  >
                    {stage.shortLabel}
                  </span>
                  <span className="block font-serif text-xs font-semibold leading-tight truncate">
                    {stage.id === 'jan-30'
                      ? 'Anfang'
                      : stage.id === 'mar-23'
                      ? 'Umbruch'
                      : 'Sicherung'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 min-h-0 overflow-y-auto ipad-note-scroll px-4 sm:px-6 py-3.5 space-y-3">
        <div className="pb-2.5 border-b border-[#D6CBBA]">
          <p className="font-serif text-sm sm:text-base font-semibold text-[#173668] leading-snug">
            {activeStage.headline}
          </p>
          <p className="mt-0.5 text-xs sm:text-[13px] text-[#284B82] leading-snug">
            {activeStage.takeaway}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {activeStage.cards.map((card) => {
            const meta = SNAPSHOT_STATUS_META[card.status];
            const Icon = meta.Icon;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onJumpToEvent(card.eventId)}
                className={`w-full text-left border px-3 py-2.5 flex flex-col justify-between transition-colors duration-200 cursor-pointer touch-manipulation ${meta.cardClass}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-serif text-[13px] sm:text-sm font-semibold ${meta.domainClass}`}
                    >
                      {card.domain}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider shrink-0 ${meta.badgeClass}`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{card.statusLabel}</span>
                    </span>
                  </div>

                  <p className={`mt-1.5 text-xs leading-relaxed ${meta.bodyClass}`}>
                    {card.visualSummary}
                  </p>
                </div>

                <span
                  className={`mt-2 inline-flex items-center gap-1 font-mono text-[10px] ${meta.linkClass}`}
                >
                  <span>Beleg: {card.eventDateLabel}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================================
 * 2. NOTIZZETTEL: DIE 3 SÄULEN DER MACHT
 * ========================================================================== */
export function ConclusionPillarsNote({
  isExpandedArea,
  isCentered,
  isOverview,
  showControls,
  isCurrentlyVisible,
  onJumpToEvent,
  onFocusSelf,
}: BaseConclusionNoteProps) {
  const [activePillarId, setActivePillarId] = useState<string>(
    POWER_PILLARS[0].id
  );

  const activePillar =
    POWER_PILLARS.find((p) => p.id === activePillarId) ?? POWER_PILLARS[0];

  if (!isExpandedArea || isOverview) {
    return (
      <CollapsedConclusionCover
        kicker="Abschluss 2 · Struktur"
        overviewLabel="Bilanz 2 · Struktur"
        title="Die 3 Säulen der Macht"
        subtitle="Recht, Terror & Propaganda"
        tiltClass="-rotate-[0.7deg]"
        Icon={BookOpen}
        isOverview={isOverview}
        showControls={showControls}
        isCurrentlyVisible={isCurrentlyVisible}
        onFocusSelf={onFocusSelf}
      />
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0.75, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.34, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      aria-label="Abschluss-Notizzettel 2: Die 3 Säulen der NS-Herrschaft"
      className={`relative w-[99%] flex flex-col min-h-0 max-h-full notepaper-sheet border ${
        isCentered
          ? 'border-[#9E2424]/75 shadow-[0_20px_42px_-10px_rgba(45,28,10,0.45)]'
          : 'border-[#A69274] shadow-[0_14px_30px_-8px_rgba(45,28,10,0.36)]'
      } rotate-[0.35deg]`}
    >
      <span
        aria-hidden="true"
        className="masking-tape w-10 h-2.5 -rotate-12 absolute -top-1.5 -left-2 z-20"
      />
      <span
        aria-hidden="true"
        className="masking-tape w-10 h-2.5 rotate-12 absolute -top-1.5 -right-2 z-20"
      />

      {/* Header */}
      <div className="shrink-0 px-4 sm:px-6 pt-4 pb-3 border-b border-[#C6B8A1]">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#9E2424] font-semibold">
            Bilanz 2 · Wirkungsweise
          </span>
          <BookOpen className="w-4 h-4 text-[#2C4E84] shrink-0" />
        </div>
        <h2 className="mt-0.5 font-serif text-lg sm:text-xl font-bold text-[#173668] leading-tight">
          Die 3 Säulen der Macht
        </h2>
      </div>

      {/* Scrollable Body — Two Side-by-Side Columns on Double-Wide Card */}
      <div className="flex-1 min-h-0 overflow-y-auto ipad-note-scroll px-4 sm:px-6 py-3.5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {/* Left Column: 3 Power Pillars Selector */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#2C4E84] mb-2">
              Zusammenspiel (Säule antippen)
            </p>

            <div className="space-y-2">
              {POWER_PILLARS.map((pillar) => {
                const isSelected = pillar.id === activePillar.id;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    onClick={() => setActivePillarId(pillar.id)}
                    className={`w-full min-h-[52px] text-left border px-3.5 py-2.5 transition-colors cursor-pointer touch-manipulation ${
                      isSelected
                        ? 'bg-[#173668] border-[#10254A] text-[#FAF4E6] shadow-xs'
                        : 'bg-[#FAF6EC] border-[#C2B6A2] text-[#173668] hover:border-[#173668]'
                    }`}
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-serif text-[13px] sm:text-sm font-semibold leading-tight">
                        {pillar.numberLabel}. {pillar.title}
                      </span>
                      <span
                        className={`font-mono text-[10px] shrink-0 ${
                          isSelected ? 'text-[#F5C6A5]' : 'text-[#9E2424]'
                        }`}
                      >
                        {pillar.subtitle}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Explanation & Linked Events */}
          <div className="pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-dashed border-[#B29E7F] md:pl-5 flex flex-col justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#9E2424] font-semibold">
                Säule {activePillar.numberLabel} · {activePillar.subtitle}
              </p>
              <h3 className="mt-0.5 font-serif text-base font-bold text-[#173668]">
                {activePillar.title}
              </h3>
              <p className="mt-2 text-xs sm:text-[13px] text-[#173668] leading-relaxed bg-white/65 border border-[#C2B6A2] px-3.5 py-3">
                {activePillar.explanation}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-[#D6CBBA]">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#2C4E84] mb-1.5">
                Zentrale Stationen dazu
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activePillar.linkedEvents.map((ev) => (
                  <button
                    key={ev.eventId}
                    type="button"
                    onClick={() => onJumpToEvent(ev.eventId)}
                    className="min-h-[36px] inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/80 border border-[#B8A58B] hover:border-[#9E2424] text-[11px] text-[#173668] hover:text-[#9E2424] transition-colors cursor-pointer touch-manipulation whitespace-nowrap"
                  >
                    <span className="font-mono text-[10px] text-[#9E2424] tabular-nums">
                      {ev.dateLabel}
                    </span>
                    <span>· {ev.label}</span>
                    <ArrowUpRight className="w-3 h-3 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ============================================================================
 * 3. NOTIZZETTEL: ANKREUZ-CHECK (5 Aufgaben ohne Schreiben)
 * ========================================================================== */
export function ConclusionCheckNote({
  isExpandedArea,
  isCentered,
  isOverview,
  showControls,
  isCurrentlyVisible,
  onJumpToEvent,
  onFocusSelf,
}: BaseConclusionNoteProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedByQuestion, setSelectedByQuestion] = useState<
    Record<string, string[]>
  >({});
  const [checkedByQuestion, setCheckedByQuestion] = useState<
    Record<string, boolean>
  >({});

  const currentQuestion = CHECK_QUESTIONS[questionIndex] ?? CHECK_QUESTIONS[0];
  const selectedIds = selectedByQuestion[currentQuestion.id] ?? [];
  const isChecked = Boolean(checkedByQuestion[currentQuestion.id]);

  const isQuestionCorrect = (() => {
    if (!isChecked) return false;
    const expected = [...currentQuestion.correctOptionIds].sort();
    const actual = [...selectedIds].sort();
    return (
      expected.length === actual.length &&
      expected.every((val, i) => val === actual[i])
    );
  })();

  const handleToggleOption = (optionId: string) => {
    setCheckedByQuestion((prev) => ({
      ...prev,
      [currentQuestion.id]: false,
    }));

    setSelectedByQuestion((prev) => {
      const existing = prev[currentQuestion.id] ?? [];
      if (currentQuestion.mode === 'single') {
        return { ...prev, [currentQuestion.id]: [optionId] };
      }
      const next = existing.includes(optionId)
        ? existing.filter((id) => id !== optionId)
        : [...existing, optionId];
      return { ...prev, [currentQuestion.id]: next };
    });
  };

  const handleCheckAnswer = () => {
    if (selectedIds.length === 0) return;
    setCheckedByQuestion((prev) => ({
      ...prev,
      [currentQuestion.id]: true,
    }));
  };

  if (!isExpandedArea || isOverview) {
    return (
      <CollapsedConclusionCover
        kicker="Abschluss 3 · Selbstcheck"
        overviewLabel="Bilanz 3 · Selbstcheck"
        title="Kurzer Ankreuz-Check"
        subtitle="5 Verständnisfragen"
        tiltClass="rotate-[0.9deg]"
        Icon={HelpCircle}
        isOverview={isOverview}
        showControls={showControls}
        isCurrentlyVisible={isCurrentlyVisible}
        onFocusSelf={onFocusSelf}
      />
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0.75, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.34, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      aria-label="Abschluss-Notizzettel 3: Ankreuz-Check zur Selbstkontrolle"
      className={`relative w-[99%] flex flex-col min-h-0 max-h-full notepaper-sheet border ${
        isCentered
          ? 'border-[#9E2424]/75 shadow-[0_20px_42px_-10px_rgba(45,28,10,0.45)]'
          : 'border-[#A69274] shadow-[0_14px_30px_-8px_rgba(45,28,10,0.36)]'
      } -rotate-[0.35deg]`}
    >
      <span
        aria-hidden="true"
        className="masking-tape w-10 h-2.5 -rotate-12 absolute -top-1.5 -left-2 z-20"
      />
      <span
        aria-hidden="true"
        className="masking-tape w-10 h-2.5 rotate-12 absolute -top-1.5 -right-2 z-20"
      />

      {/* Header */}
      <div className="shrink-0 px-4 sm:px-6 pt-4 pb-3 border-b border-[#C6B8A1]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#9E2424] font-semibold">
              Bilanz 3 · Selbstkontrolle
            </span>
            <h2 className="mt-0.5 font-serif text-lg sm:text-xl font-bold text-[#173668] leading-tight">
              Kurzer Ankreuz-Check
            </h2>
          </div>

          {/* Step Navigation */}
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-[11px] text-[#2C4E84] tabular-nums">
              Aufgabe {questionIndex + 1} / {CHECK_QUESTIONS.length}
            </span>
            <div className="flex items-center gap-1">
              {CHECK_QUESTIONS.map((q, idx) => {
                const active = idx === questionIndex;
                const done = Boolean(checkedByQuestion[q.id]);
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setQuestionIndex(idx)}
                    aria-label={`Zu Aufgabe ${idx + 1} wechseln`}
                    className={`w-7.5 h-7.5 font-mono text-[11px] tabular-nums border transition-colors cursor-pointer touch-manipulation ${
                      active
                        ? 'bg-[#173668] border-[#10254A] text-[#FAF4E6] font-semibold'
                        : done
                        ? 'bg-[#EFE0CA] border-[#9E2424]/60 text-[#173668]'
                        : 'bg-[#FAF6EC] border-[#C2B6A2] text-[#2C4E84] hover:border-[#173668]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 min-h-0 overflow-y-auto ipad-note-scroll px-4 sm:px-6 py-3.5 space-y-3">
        <div>
          <h3 className="font-serif text-sm sm:text-base font-semibold text-[#173668] leading-snug">
            {currentQuestion.prompt}
          </h3>
          <p className="mt-0.5 font-mono text-[10px] text-[#2C4E84]">
            {currentQuestion.mode === 'multi'
              ? 'Mehrere Aussagen ankreuzen'
              : 'Eine Aussage ankreuzen'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedIds.includes(opt.id);
            const isOptionExpected =
              currentQuestion.correctOptionIds.includes(opt.id);

            let containerStyle =
              'bg-[#FAF6EC] border-[#C2B6A2] text-[#173668] hover:border-[#173668]';

            if (isChecked) {
              if (isOptionExpected) {
                containerStyle = 'bg-[#EDF5EE] border-[#2C6B3F] text-[#173668]';
              } else if (isSelected && !isOptionExpected) {
                containerStyle = 'bg-[#FAE8E8] border-[#9E2424] text-[#173668]';
              } else {
                containerStyle =
                  'bg-[#FAF6EC]/70 border-[#D6CBBA] text-[#284B82]/75';
              }
            } else if (isSelected) {
              containerStyle =
                'bg-[#FFFFFF] border-[#173668] text-[#173668] shadow-xs';
            }

            const SelectIcon =
              currentQuestion.mode === 'multi'
                ? isSelected
                  ? CheckSquare
                  : Square
                : isSelected
                ? CheckCircle2
                : Circle;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleToggleOption(opt.id)}
                className={`w-full min-h-[48px] text-left border px-3 py-2.5 flex items-start gap-2.5 transition-colors cursor-pointer touch-manipulation ${containerStyle}`}
              >
                <SelectIcon
                  className={`w-4 h-4 shrink-0 mt-0.5 ${
                    isChecked && isOptionExpected
                      ? 'text-[#2C6B3F]'
                      : isChecked && isSelected && !isOptionExpected
                      ? 'text-[#9E2424]'
                      : isSelected
                      ? 'text-[#9E2424]'
                      : 'text-[#2C4E84]'
                  }`}
                />
                <span className="text-xs sm:text-[12.5px] leading-snug">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-1 flex items-center justify-between gap-2">
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={handleCheckAnswer}
            className="min-h-[40px] px-4 py-1.5 bg-[#9E2424] hover:bg-[#821B1B] disabled:bg-[#C6B8A1] disabled:text-[#6B5F4E] text-[#FAF4E6] text-xs font-medium transition-colors cursor-pointer disabled:cursor-not-allowed touch-manipulation whitespace-nowrap"
          >
            Antwort prüfen
          </button>

          <button
            type="button"
            onClick={() =>
              setQuestionIndex((prev) =>
                prev + 1 < CHECK_QUESTIONS.length ? prev + 1 : 0
              )
            }
            className="min-h-[40px] px-3.5 py-1.5 border border-[#B09B7C] bg-[#FAF6EC] hover:border-[#173668] text-xs font-medium text-[#173668] transition-colors cursor-pointer touch-manipulation whitespace-nowrap"
          >
            {questionIndex + 1 < CHECK_QUESTIONS.length
              ? 'Nächste Aufgabe →'
              : 'Von vorn beginnen'}
          </button>
        </div>

        <AnimatePresence initial={false}>
          {isChecked && (
            <motion.div
              key={`${currentQuestion.id}-feedback`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={`border px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 ${
                isQuestionCorrect
                  ? 'bg-[#EDF5EE] border-[#2C6B3F]'
                  : 'bg-[#F8EFE2] border-[#9E2424]'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  {isQuestionCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#2C6B3F] shrink-0" />
                      <span className="text-[#1D4E2B]">Richtig eingeordnet</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-[#9E2424] shrink-0" />
                      <span className="text-[#9E2424]">
                        Grün markiert siehst du die richtige Lösung
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-[#173668] leading-snug">
                  {currentQuestion.explanation}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onJumpToEvent(currentQuestion.referenceEventId)
                }
                className="shrink-0 inline-flex items-center gap-1 font-mono text-[10.5px] text-[#9E2424] hover:underline cursor-pointer touch-manipulation whitespace-nowrap"
              >
                <span>Nachsehen ({currentQuestion.referenceLabel})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
