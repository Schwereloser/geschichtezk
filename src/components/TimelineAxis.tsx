import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ARCHIVAL_IMAGES,
  GUIDING_QUESTION,
  PHASES,
  PhaseId,
  TimelineEvent,
} from '../data/timelineData';

interface TimelineAxisProps {
  events: TimelineEvent[];
  startIndex: number;
  maxStartIndex: number;
  direction: number;
  windowSize: number;
  expandedIds: string[];
  onToggleExpand: (id: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onJumpToPhase: (phaseId: PhaseId) => void;
}

const EVENT_BACKDROPS: Record<string, { main: string; secondary: string; caption: string }> = {
  'ernennung-hitler': {
    main: ARCHIVAL_IMAGES.reichstag,
    secondary: ARCHIVAL_IMAGES.decree,
    caption: 'Berlin · Reichstag, Jan 1933',
  },
  'aufloesung-reichstag': {
    main: ARCHIVAL_IMAGES.reichstag,
    secondary: ARCHIVAL_IMAGES.parliament,
    caption: 'Berlin · Reichstag, Feb 1933',
  },
  'verordnung-schutz-volk': {
    main: ARCHIVAL_IMAGES.decree,
    secondary: ARCHIVAL_IMAGES.reichstag,
    caption: 'Verordnungen · Februar 1933',
  },
  'geheimtreffen-wirtschaft': {
    main: ARCHIVAL_IMAGES.parliament,
    secondary: ARCHIVAL_IMAGES.decree,
    caption: 'Berlin · Februar 1933',
  },
  'sa-ss-hilfspolizei': {
    main: ARCHIVAL_IMAGES.reichstag,
    secondary: ARCHIVAL_IMAGES.decree,
    caption: 'Preußen · Februar 1933',
  },
  'reichstagsbrand': {
    main: ARCHIVAL_IMAGES.reichstag,
    secondary: ARCHIVAL_IMAGES.parliament,
    caption: 'Berlin · 27. Februar 1933',
  },
  'reichstagsbrandverordnung': {
    main: ARCHIVAL_IMAGES.decree,
    secondary: ARCHIVAL_IMAGES.reichstag,
    caption: 'Notverordnung · 28. Feb 1933',
  },
  'reichstagswahl-1933': {
    main: ARCHIVAL_IMAGES.parliament,
    secondary: ARCHIVAL_IMAGES.reichstag,
    caption: 'Reichstagswahl · 5. März 1933',
  },
  'tag-von-potsdam': {
    main: ARCHIVAL_IMAGES.parliament,
    secondary: ARCHIVAL_IMAGES.reichstag,
    caption: 'Potsdam · 21. März 1933',
  },
  'kz-dachau': {
    main: ARCHIVAL_IMAGES.library,
    secondary: ARCHIVAL_IMAGES.decree,
    caption: 'Dachau · 22. März 1933',
  },
  'ermaechtigungsgesetz': {
    main: ARCHIVAL_IMAGES.parliament,
    secondary: ARCHIVAL_IMAGES.decree,
    caption: 'Krolloper · 23. März 1933',
  },
  'gleichschaltung-laender-1': {
    main: ARCHIVAL_IMAGES.decree,
    secondary: ARCHIVAL_IMAGES.parliament,
    caption: 'Ländergleichschaltung · März 1933',
  },
  'gleichschaltung-laender-2': {
    main: ARCHIVAL_IMAGES.decree,
    secondary: ARCHIVAL_IMAGES.parliament,
    caption: 'Reichsstatthalter · April 1933',
  },
  'berufsbeamtentum': {
    main: ARCHIVAL_IMAGES.decree,
    secondary: ARCHIVAL_IMAGES.library,
    caption: 'Berufsbeamtentum · 7. April 1933',
  },
  'tag-der-nationalen-arbeit': {
    main: ARCHIVAL_IMAGES.library,
    secondary: ARCHIVAL_IMAGES.parliament,
    caption: '1. Mai 1933',
  },
  'zerschlagung-gewerkschaften': {
    main: ARCHIVAL_IMAGES.library,
    secondary: ARCHIVAL_IMAGES.decree,
    caption: 'Gewerkschaften · 2. Mai 1933',
  },
  'gruendung-daf': {
    main: ARCHIVAL_IMAGES.library,
    secondary: ARCHIVAL_IMAGES.decree,
    caption: 'DAF · 10. Mai 1933',
  },
  'buecherverbrennungen': {
    main: ARCHIVAL_IMAGES.library,
    secondary: ARCHIVAL_IMAGES.decree,
    caption: 'Bücherverbrennungen · 10. Mai 1933',
  },
  'verbot-spd': {
    main: ARCHIVAL_IMAGES.parliament,
    secondary: ARCHIVAL_IMAGES.decree,
    caption: 'SPD-Verbot · 22. Juni 1933',
  },
  'selbstaufloesung-parteien': {
    main: ARCHIVAL_IMAGES.parliament,
    secondary: ARCHIVAL_IMAGES.decree,
    caption: 'Juni–Juli 1933',
  },
  'einparteienstaat-gesetz': {
    main: ARCHIVAL_IMAGES.decree,
    secondary: ARCHIVAL_IMAGES.parliament,
    caption: 'Einparteienstaat · 14. Juli 1933',
  },
  'reichskonkordat': {
    main: ARCHIVAL_IMAGES.decree,
    secondary: ARCHIVAL_IMAGES.parliament,
    caption: 'Reichskonkordat · 20. Juli 1933',
  },
};

const cardVariants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? 48 : -48,
    scale: 0.97,
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: (dir: number) => ({
    opacity: 0,
    x: dir >= 0 ? -48 : 48,
    scale: 0.97,
  }),
};

export function TimelineAxis({
  events,
  startIndex,
  maxStartIndex,
  direction,
  windowSize,
  expandedIds,
  onToggleExpand,
  onPrev,
  onNext,
  onJumpToPhase,
}: TimelineAxisProps) {
  const visibleEvents = events.slice(startIndex, startIndex + windowSize);
  const centerEvent = visibleEvents[1] ?? visibleEvents[0];
  const activePhase = centerEvent
    ? PHASES.find((p) => p.id === centerEvent.phaseId)
    : undefined;

  const backdrop =
    (centerEvent && EVENT_BACKDROPS[centerEvent.id]) ||
    EVENT_BACKDROPS['ernennung-hitler'];

  const hasPrev = startIndex > 0;
  const hasNext = startIndex < maxStartIndex;

  return (
    <section
      aria-label="Papier-Zeitstrahl"
      className="relative flex-1 min-h-0 flex flex-col border border-[#9F8560] kraft-paper-bg shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_14px_36px_-12px_rgba(45,30,12,0.4)] overflow-hidden"
    >
      {/* Compact Top Board Bar: Title + Direct Phase Jumps */}
      <div className="relative z-20 shrink-0 px-4 sm:px-6 py-3 border-b border-[#A68C66] bg-[#C8AF87]/85 backdrop-blur-[2px] flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-serif text-lg sm:text-xl font-semibold text-[#173668] leading-tight truncate">
            Einrichtung und Sicherung der NS-Diktatur (1933–1934)
          </h1>
          <p className="mt-0.5 text-[11px] font-mono text-[#2C4E84] tabular-nums truncate">
            {activePhase
              ? `Phase ${activePhase.numberLabel}: ${activePhase.title}`
              : ''}
            {visibleEvents.length > 0
              ? ` · ${visibleEvents[0].shortDate} – ${visibleEvents[visibleEvents.length - 1].shortDate}`
              : ''}
          </p>
        </div>

        {/* Phase Quick-Jump Tabs */}
        <div
          className="flex flex-wrap items-center gap-1.5 shrink-0"
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
                className={`px-2.5 py-1.5 text-[11px] font-mono transition-colors cursor-pointer touch-manipulation whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E2424] ${
                  isActive
                    ? 'bg-[#9E2424] text-[#FAF4E6] font-medium'
                    : 'bg-[#DFCAA6]/85 text-[#173668] border border-[#A68C66] hover:bg-[#FAF4E6]'
                }`}
              >
                {phase.numberLabel}. {phase.periodLabel.split(' ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Locked-Height Board Area with Side Arrows */}
      <div className="relative flex-1 min-h-0 flex items-stretch overflow-hidden">
        {/* Left Side Arrow Button */}
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          aria-label="Ein Datum zurück"
          className="relative z-20 shrink-0 w-12 sm:w-16 md:w-20 flex flex-col items-center justify-center border-r border-[#A68C66]/75 bg-[#BFA37B]/55 hover:bg-[#DFCAA6]/85 active:bg-[#DFCAA6] text-[#173668] disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9E2424]"
        >
          <ChevronLeft className="w-8 h-8" strokeWidth={2.2} />
          <span className="hidden md:block mt-1 text-[11px] font-mono uppercase tracking-wider">
            Zurück
          </span>
        </button>

        {/* Center Board Canvas (Fixed Height – Never Expands Page) */}
        <div className="relative flex-1 min-h-0 px-3 sm:px-6 md:px-8 py-4 sm:py-6 flex flex-col overflow-hidden">
          {/* Time-Matched Background Archival Images */}
          <AnimatePresence mode="sync">
            <motion.div
              key={backdrop.main + backdrop.caption}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeInOut' }}
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none select-none overflow-hidden"
            >
              <img
                src={backdrop.main}
                alt=""
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-[0.16] mix-blend-multiply sepia-[0.55] contrast-[1.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#CBB38E]/50 via-[#CBB38E]/20 to-[#CBB38E]/75" />

              {/* Pinned Vintage Photo Print Left */}
              <div className="hidden lg:block absolute left-6 bottom-5 w-48 bg-[#FAF4E6]/80 p-2 pb-3 border border-[#A68C66]/70 shadow-[0_8px_18px_rgba(45,28,10,0.22)] -rotate-3 opacity-75">
                <div className="w-2.5 h-2.5 rounded-full bg-[#9E2424] border border-[#681212] mx-auto -mt-3 mb-1.5" />
                <img
                  src={backdrop.main}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover sepia-[0.45] grayscale-[0.3] contrast-[1.05]"
                />
                <p className="mt-1 text-[10px] font-mono text-[#173668]/80 truncate text-center">
                  {backdrop.caption}
                </p>
              </div>

              {/* Pinned Vintage Photo Print Right */}
              <div className="hidden lg:block absolute right-6 bottom-6 w-40 bg-[#FAF4E6]/75 p-2 pb-2.5 border border-[#A68C66]/70 shadow-[0_8px_18px_rgba(45,28,10,0.2)] rotate-[2.5deg] opacity-65">
                <div className="w-2.5 h-2.5 rounded-full bg-[#9E2424] border border-[#681212] mx-auto -mt-3 mb-1.5" />
                <img
                  src={backdrop.secondary}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full aspect-[4/3] object-cover sepia-[0.45] grayscale-[0.35] contrast-[1.05]"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Horizontal Red Thread Line behind the 3 Pins */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute left-0 right-0 top-[26px] sm:top-[34px] h-7 pointer-events-none z-0"
          >
            <svg
              viewBox="0 0 1200 36"
              preserveAspectRatio="none"
              className="w-full h-full overflow-visible"
            >
              <path
                d="M 0 16 Q 200 24, 400 16 T 800 16 T 1200 16"
                fill="none"
                stroke="rgba(55, 25, 10, 0.24)"
                strokeWidth="4"
                transform="translate(0, 3)"
              />
              <path
                d="M 0 16 Q 200 24, 400 16 T 800 16 T 1200 16"
                fill="none"
                stroke="#9E2424"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Mobile Vertical Red Thread */}
          <div
            aria-hidden="true"
            className="md:hidden absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[3px] bg-[#9E2424]/80 pointer-events-none"
          />

          {/* 1-by-1 Sliding 3-Column Grid (Clean Layout Glide) */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70 && hasNext) {
                onNext();
              } else if (info.offset.x > 70 && hasPrev) {
                onPrev();
              }
            }}
            className="relative z-10 flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 items-stretch max-md:overflow-y-auto"
          >
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              {visibleEvents.map((event) => {
                const isExpanded = expandedIds.includes(event.id);
                const phase = PHASES.find((p) => p.id === event.phaseId);

                const totalVotes = event.voteResult
                  ? event.voteResult.yes + event.voteResult.no
                  : 0;
                const yesPercent = event.voteResult
                  ? Math.round((event.voteResult.yes / totalVotes) * 100)
                  : 0;

                return (
                  <motion.div
                    key={event.id}
                    layout
                    custom={direction}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      layout: { type: 'spring', stiffness: 300, damping: 30 },
                      opacity: { duration: 0.22, ease: 'easeOut' },
                      x: { type: 'spring', stiffness: 300, damping: 30 },
                      scale: { duration: 0.22 },
                    }}
                    className="flex flex-col items-center min-h-0 h-full"
                  >
                    {/* Red Pin & Short Thread */}
                    <div className="shrink-0 flex flex-col items-center mb-1">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#9E2424] border-2 border-[#681212] shadow-[0_3px_6px_rgba(30,15,5,0.4)] flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#F5B7B7]/85 -translate-x-0.5 -translate-y-0.5" />
                      </div>
                      <div className="w-[2px] h-3 sm:h-4 bg-[#9E2424]" />
                    </div>

                    {/* Notizzettel Card (Strictly Constrained Inside Viewport) */}
                    <article
                      className={`w-full notepaper-sheet border border-[#B9A482] flex flex-col min-h-0 transition-shadow duration-200 ${
                        isExpanded
                          ? 'flex-1 shadow-[0_16px_36px_-10px_rgba(45,28,10,0.42)]'
                          : 'shadow-[0_8px_20px_-6px_rgba(45,28,10,0.3)]'
                      }`}
                    >
                      {/* Fixed Note Header (Tap to Fold / Unfold) */}
                      <button
                        type="button"
                        onClick={() => onToggleExpand(event.id)}
                        aria-expanded={isExpanded}
                        className="shrink-0 w-full text-left px-4 sm:px-5 py-3.5 cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9E2424] group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs font-medium text-[#9E2424] tabular-nums">
                            {event.indexNumber} · {event.dateLabel}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#2C4E84] group-hover:text-[#173668]">
                            <span>{isExpanded ? 'Zuklappen' : 'Öffnen'}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </span>
                        </div>

                        <h2 className="mt-1.5 font-serif text-lg sm:text-xl font-semibold text-[#173668] leading-snug">
                          {event.title}
                        </h2>

                        {!isExpanded && (
                          <div className="mt-3 pt-2 border-t border-dashed border-[#C7B698] flex items-center justify-between text-[11px] text-[#2C4E84]">
                            <span>
                              {phase ? `Phase ${phase.numberLabel}` : ''}
                            </span>
                            <span className="italic">Antippen</span>
                          </div>
                        )}
                      </button>

                      {/* Unfolded Well-Structured Blue-Ink Content (Scrolls Inside Note Only) */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            key="note-body"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="flex-1 min-h-0 flex flex-col border-t-2 border-dashed border-[#C5B496]"
                          >
                            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-5 py-3.5 space-y-3.5 text-[#173668]">
                              {/* Compact Meta Badges as Clean Text */}
                              <div className="text-[11px] font-mono text-[#2C4E84] flex flex-wrap gap-x-2 gap-y-0.5">
                                <span>{event.mechanismLabel}</span>
                                {event.location && (
                                  <span>· Ort: {event.location}</span>
                                )}
                              </div>

                              {event.officialTitle && (
                                <p className="text-xs italic text-[#284B82] border-b border-[#E3D8C1] pb-2">
                                  Amtlicher Titel: „{event.officialTitle}“
                                </p>
                              )}

                              {/* Kernaussage */}
                              <div className="bg-[#F2E8D0]/65 border border-[#D8CBB1] px-3 py-2.5">
                                <p className="text-[10px] font-mono uppercase tracking-wider text-[#9E2424] mb-1">
                                  Kurzüberblick
                                </p>
                                <p className="text-[13px] sm:text-sm leading-relaxed text-[#173668] font-medium">
                                  {event.summary}
                                </p>
                              </div>

                              {/* Datierungshinweis */}
                              {event.historicalCorrection && (
                                <div className="py-2 px-3 border-y border-[#C7B698] bg-[#FAF4E6]">
                                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#9E2424] mb-0.5">
                                    Hinweis zur Datierung
                                  </p>
                                  <p className="text-xs text-[#173668] leading-relaxed">
                                    {event.historicalCorrection}
                                  </p>
                                </div>
                              )}

                              {/* Was passiert / Maßnahmen */}
                              <div>
                                <h3 className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#2C4E84] mb-1.5">
                                  Ablauf &amp; Maßnahmen
                                </h3>
                                <ul className="space-y-1.5 text-[13px] leading-snug text-[#173668]">
                                  {event.eventsAndMeasures.map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="font-mono text-[10px] text-[#9E2424] mt-0.5 tabular-nums shrink-0">
                                        {String(i + 1).padStart(2, '0')}
                                      </span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Grundrechte (28. Feb) */}
                              {event.suspendedRights && (
                                <div className="pt-2.5 border-t border-[#D8CBB1]">
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
                                <div className="pt-2.5 border-t border-[#D8CBB1]">
                                  <div className="flex items-baseline justify-between text-[10px] font-mono mb-1">
                                    <span className="uppercase tracking-wider text-[#2C4E84]">
                                      Reichstagsabstimmung
                                    </span>
                                    <span className="text-[#173668] tabular-nums font-medium">
                                      {event.voteResult.yes} Ja :{' '}
                                      {event.voteResult.no} Nein
                                    </span>
                                  </div>
                                  <div className="w-full h-2 bg-[#DFD3BA] flex overflow-hidden">
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
                                    <p
                                      key={i}
                                      className="mt-0.5 text-[11px] text-[#284B82]"
                                    >
                                      · {d}
                                    </p>
                                  ))}
                                </div>
                              )}

                              {/* Reden (23. Mär) */}
                              {event.quotes && event.quotes.length > 0 && (
                                <div className="pt-2.5 border-t border-[#D8CBB1] space-y-2">
                                  <h3 className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#2C4E84]">
                                    Reden im Reichstag
                                  </h3>
                                  {event.quotes.map((q, i) => (
                                    <blockquote
                                      key={i}
                                      className="py-1.5 border-y border-[#D8CBB1]"
                                    >
                                      <p className="font-serif italic text-xs text-[#173668] leading-snug">
                                        {q.text}
                                      </p>
                                    </blockquote>
                                  ))}
                                  {event.welsSpeechPoints && (
                                    <div>
                                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#2C4E84] mb-1">
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
                                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#2C4E84] mb-1">
                                        Antwort Adolf Hitlers
                                      </p>
                                      <ul className="space-y-0.5 text-[11px] text-[#284B82]">
                                        {event.hitlerReplyPoints.map((pt, i) => (
                                          <li key={i}>· {pt}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {event.sourceWorkNote && (
                                    <p className="text-[10px] italic text-[#2C4E84]">
                                      {event.sourceWorkNote}
                                    </p>
                                  )}
                                </div>
                              )}

                              {/* Akteure */}
                              {event.actors.length > 0 && (
                                <div className="pt-2.5 border-t border-[#D8CBB1]">
                                  <h3 className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#2C4E84] mb-1.5">
                                    Beteiligte Akteure
                                  </h3>
                                  <dl className="grid grid-cols-1 gap-1 text-xs">
                                    {event.actors.map((a) => (
                                      <div
                                        key={a.name}
                                        className="flex flex-wrap items-baseline gap-x-1.5"
                                      >
                                        <dt className="font-semibold text-[#173668]">
                                          {a.name}
                                        </dt>
                                        {a.role && (
                                          <dd className="text-[#284B82]">
                                            — {a.role}
                                          </dd>
                                        )}
                                      </div>
                                    ))}
                                  </dl>
                                </div>
                              )}

                              {/* Einordnung */}
                              {event.contextNotes &&
                                event.contextNotes.length > 0 && (
                                  <div className="pt-2.5 border-t border-[#D8CBB1]">
                                    <h3 className="text-[10px] font-mono uppercase tracking-[0.12em] text-[#2C4E84] mb-1">
                                      Historische Einordnung
                                    </h3>
                                    <ul className="space-y-1 text-xs text-[#284B82] leading-snug">
                                      {event.contextNotes.map((n, i) => (
                                        <li key={i}>· {n}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                            </div>

                            {/* Pinned Bottom Fold-Back Control inside the Note */}
                            <button
                              type="button"
                              onClick={() => onToggleExpand(event.id)}
                              className="shrink-0 w-full py-2 border-t border-dashed border-[#C5B496] flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#173668] bg-[#F0E6CE] hover:bg-[#E6D7B4] transition-colors cursor-pointer touch-manipulation"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                              <span>Zuklappen</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </article>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Right Side Arrow Button */}
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          aria-label="Ein Datum weiter"
          className="relative z-20 shrink-0 w-12 sm:w-16 md:w-20 flex flex-col items-center justify-center border-l border-[#A68C66]/75 bg-[#BFA37B]/55 hover:bg-[#DFCAA6]/85 active:bg-[#DFCAA6] text-[#173668] disabled:opacity-25 disabled:cursor-not-allowed transition-colors cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#9E2424]"
        >
          <ChevronRight className="w-8 h-8" strokeWidth={2.2} />
          <span className="hidden md:block mt-1 text-[11px] font-mono uppercase tracking-wider">
            Weiter
          </span>
        </button>
      </div>

      {/* Compact Bottom Strip: Leitfrage & Window Indicator */}
      <div className="relative z-20 shrink-0 px-4 sm:px-6 py-2.5 border-t border-[#A68C66] bg-[#C8AF87]/85 backdrop-blur-[2px] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs text-[#173668]">
        <p className="font-serif italic truncate">
          <span className="font-mono not-italic text-[10px] uppercase tracking-wider text-[#9E2424] mr-2">
            Leitfrage:
          </span>
          „{GUIDING_QUESTION}“
        </p>
        <span className="font-mono text-[11px] text-[#2C4E84] tabular-nums shrink-0">
          Stationen {startIndex + 1}–{startIndex + visibleEvents.length} von{' '}
          {events.length}
        </span>
      </div>
    </section>
  );
}
