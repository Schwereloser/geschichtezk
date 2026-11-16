import { PhaseId } from '../data/timelineData';

interface TopBarProps {
  activePhaseId: PhaseId | null;
  onJumpToPhase: (phaseId: PhaseId) => void;
  onOpenPresentation: () => void;
}

export function TopBar({
  activePhaseId,
  onJumpToPhase,
  onOpenPresentation,
}: TopBarProps) {
  const navItems: { id: PhaseId; label: string }[] = [
    { id: 'phase-1', label: 'Jan–Feb 1933' },
    { id: 'phase-2', label: 'März–April 1933' },
    { id: 'phase-3', label: 'Mai–Juli 1933' },
    { id: 'phase-4', label: 'Führerstaat' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#F7F4EE]/95 backdrop-blur-sm border-b border-[#D6CEBE]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#zeitstrahl"
          onClick={(e) => {
            e.preventDefault();
            onJumpToPhase('phase-1');
          }}
          className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#1C1917] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C2D19]"
        >
          NS-Diktatur 1933–1934
        </a>

        {/* Zone 2: 4 concise single-line phase jump links */}
        <nav
          aria-label="Phasen-Sprungmarken"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#57534E]"
        >
          {navItems.map((item) => {
            const isActive = activePhaseId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onJumpToPhase(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C2D19] ${
                  isActive
                    ? 'text-[#1C1917] underline decoration-[#8C2D19]'
                    : 'hover:text-[#1C1917] hover:underline decoration-[#8C2D19]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenPresentation}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-[#FBF9F5] bg-[#1C1917] hover:bg-[#8C2D19] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C2D19]"
          >
            Präsentationsmodus
          </button>
        </div>
      </div>
    </header>
  );
}
