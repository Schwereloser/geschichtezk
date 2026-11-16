import { ActorEntry } from '../data/timelineData';

interface ActorMiniProfileProps {
  actor: ActorEntry;
  isSelected?: boolean;
  onSelect?: () => void;
}

function getInitials(name: string): string {
  const cleaned = name
    .replace(/\(.*?\)/g, '')
    .replace(/^(von|van der)\s+/i, '')
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0][0] ?? '';
  const last = parts[parts.length - 1][0] ?? '';
  return `${first}${last}`.toUpperCase();
}

function renderPortraitGlyph(name: string) {
  switch (name) {
    case 'Adolf Hitler':
      return (
        <g>
          <path d="M10 38 C10 30, 30 30, 30 38 Z" fill="#173668" />
          <path d="M16 31 L20 36 L24 31" fill="#FAF4E6" />
          <circle cx="20" cy="19" r="7.5" fill="#F2E7CF" stroke="#173668" strokeWidth="1.4" />
          <path d="M12.5 17 C13 11, 22 9.5, 27.5 14 C25 12.5, 17 13, 12.5 17 Z" fill="#173668" />
          <rect x="18.2" y="21.5" width="3.6" height="1.8" rx="0.5" fill="#173668" />
          <circle cx="17.5" cy="18.5" r="0.8" fill="#173668" />
          <circle cx="22.5" cy="18.5" r="0.8" fill="#173668" />
        </g>
      );

    case 'Paul von Hindenburg':
      return (
        <g>
          <path d="M8 38 C9 29.5, 31 29.5, 32 38 Z" fill="#173668" />
          <rect x="17" y="29.5" width="6" height="2" fill="#9E2424" />
          <rect x="12.5" y="11" width="15" height="16.5" rx="6" fill="#F2E7CF" stroke="#173668" strokeWidth="1.4" />
          <path d="M13 14.5 L14.5 10.5 L25.5 10.5 L27 14.5 Z" fill="#173668" />
          <path d="M14.5 22.5 Q17.5 20.5 20 22 Q22.5 20.5 25.5 22.5 Q22.5 24 20 23 Q17.5 24 14.5 22.5 Z" fill="#173668" />
          <circle cx="17" cy="18" r="0.8" fill="#173668" />
          <circle cx="23" cy="18" r="0.8" fill="#173668" />
        </g>
      );

    case 'Franz von Papen':
      return (
        <g>
          <path d="M10 38 C11 30, 29 30, 30 38 Z" fill="#173668" />
          <path d="M16.5 30.5 L20 35.5 L23.5 30.5 Z" fill="#FAF4E6" />
          <ellipse cx="20" cy="18.5" rx="6.5" ry="7.8" fill="#F2E7CF" stroke="#173668" strokeWidth="1.4" />
          <path d="M13.5 16 C14.5 11, 25.5 11, 26.5 16 C23 13.5, 17 13.5, 13.5 16 Z" fill="#173668" />
          <circle cx="22.8" cy="18" r="2.2" fill="none" stroke="#9E2424" strokeWidth="1" />
          <line x1="25" y1="19" x2="26.5" y2="26" stroke="#9E2424" strokeWidth="0.7" />
          <path d="M17.2 21.8 Q20 21 22.8 21.8" stroke="#173668" strokeWidth="1.3" fill="none" />
        </g>
      );

    case 'Hermann Göring':
      return (
        <g>
          <path d="M7.5 38 C8.5 29, 31.5 29, 32.5 38 Z" fill="#173668" />
          <polygon points="15,30 20,34.5 25,30 23,28.5 17,28.5" fill="#FAF4E6" />
          <ellipse cx="20" cy="18.5" rx="8" ry="7.8" fill="#F2E7CF" stroke="#173668" strokeWidth="1.4" />
          <path d="M12.5 16 C14 10.8, 26 10.8, 27.5 16 C24 13, 16 13, 12.5 16 Z" fill="#173668" />
          <circle cx="17.2" cy="18" r="0.8" fill="#173668" />
          <circle cx="22.8" cy="18" r="0.8" fill="#173668" />
          <line x1="17.5" y1="22.2" x2="22.5" y2="22.2" stroke="#173668" strokeWidth="1.2" />
        </g>
      );

    case 'Heinrich Himmler':
      return (
        <g>
          <path d="M10 38 C10.5 30, 29.5 30, 30 38 Z" fill="#173668" />
          <circle cx="20" cy="18.5" r="7" fill="#F2E7CF" stroke="#173668" strokeWidth="1.4" />
          <path d="M13 16 C14 11.2, 26 11.2, 27 16 Z" fill="#173668" />
          <circle cx="17.2" cy="18.5" r="2.2" fill="none" stroke="#173668" strokeWidth="1.1" />
          <circle cx="22.8" cy="18.5" r="2.2" fill="none" stroke="#173668" strokeWidth="1.1" />
          <line x1="19.4" y1="18.5" x2="20.6" y2="18.5" stroke="#173668" strokeWidth="1" />
          <rect x="18.5" y="22" width="3" height="1.2" fill="#173668" />
        </g>
      );

    case 'Wilhelm Frick':
    case 'Hjalmar Schacht':
    case 'Alfred Hugenberg':
      return (
        <g>
          <path d="M10 38 C11 30, 29 30, 30 38 Z" fill="#173668" />
          <path d="M16.5 29.5 L20 35 L23.5 29.5 Z" fill="#FAF4E6" />
          <circle cx="20" cy="18.5" r="7" fill="#F2E7CF" stroke="#173668" strokeWidth="1.4" />
          <path d="M13.5 15.5 C15 11.5, 25 11.5, 26.5 15.5 C23.5 13.5, 16.5 13.5, 13.5 15.5 Z" fill="#173668" />
          <circle cx="17.2" cy="18.5" r="2.1" fill="none" stroke="#173668" strokeWidth="1" />
          <circle cx="22.8" cy="18.5" r="2.1" fill="none" stroke="#173668" strokeWidth="1" />
          <line x1="19.3" y1="18.5" x2="20.7" y2="18.5" stroke="#173668" strokeWidth="1" />
          <line x1="17" y1="22.4" x2="23" y2="22.4" stroke="#173668" strokeWidth="1.2" />
        </g>
      );

    case 'Otto Wels':
      return (
        <g>
          <path d="M10 38 C10.5 30, 29.5 30, 30 38 Z" fill="#173668" />
          <path d="M17 30.5 L20 35 L23 30.5 Z" fill="#FAF4E6" />
          <circle cx="20" cy="18.5" r="7.2" fill="#F2E7CF" stroke="#173668" strokeWidth="1.4" />
          <path d="M13.5 15.5 C15 11.5, 25 11.5, 26.5 15.5 C23 13.5, 17 13.5, 13.5 15.5 Z" fill="#173668" />
          <circle cx="17.2" cy="18.2" r="2" fill="none" stroke="#173668" strokeWidth="1" />
          <circle cx="22.8" cy="18.2" r="2" fill="none" stroke="#173668" strokeWidth="1" />
          <path d="M15.5 22 Q20 26.5 24.5 22 L23 25 Q20 27 17 25 Z" fill="#173668" />
        </g>
      );

    case 'Gustav Krupp':
    case 'Albert Vögler':
    case 'Kurt von Schröder':
    case 'Robert Ley':
      return (
        <g>
          <path d="M9.5 38 C10.5 30, 29.5 30, 30.5 38 Z" fill="#173668" />
          <path d="M16.5 30.5 L20 36 L23.5 30.5 Z" fill="#FAF4E6" />
          <line x1="20" y1="31.5" x2="20" y2="36" stroke="#9E2424" strokeWidth="1.3" />
          <circle cx="20" cy="18.5" r="7.2" fill="#F2E7CF" stroke="#173668" strokeWidth="1.4" />
          <path d="M13 16.5 C14 11, 26 11, 27 16.5 C23.5 13.5, 16.5 13.5, 13 16.5 Z" fill="#173668" />
          <circle cx="17.4" cy="18.2" r="0.8" fill="#173668" />
          <circle cx="22.6" cy="18.2" r="0.8" fill="#173668" />
          <line x1="17.5" y1="22.3" x2="22.5" y2="22.3" stroke="#173668" strokeWidth="1.2" />
        </g>
      );

    case 'Erich Kästner':
    case 'Heinrich Mann':
    case 'Erich Maria Remarque':
    case 'Bertolt Brecht':
      return (
        <g>
          <path d="M10 38 C11 30, 29 30, 30 38 Z" fill="#284B82" />
          <circle cx="20" cy="18" r="7" fill="#F2E7CF" stroke="#173668" strokeWidth="1.4" />
          <path d="M13 16 C14.5 10.5, 25.5 10.5, 27 16 C23 13, 17 13, 13 16 Z" fill="#173668" />
          <circle cx="17.5" cy="18" r="0.8" fill="#173668" />
          <circle cx="22.5" cy="18" r="0.8" fill="#173668" />
          <path d="M18 21.8 Q20 23 22 21.8" stroke="#173668" strokeWidth="1.1" fill="none" />
          <rect x="26" y="26.5" width="7" height="8" rx="1" fill="#FAF4E6" stroke="#9E2424" strokeWidth="1.1" />
          <line x1="29.5" y1="27" x2="29.5" y2="34" stroke="#9E2424" strokeWidth="0.9" />
        </g>
      );

    case 'Marinus van der Lubbe':
      return (
        <g>
          <path d="M10.5 38 C11.5 30.5, 28.5 30.5, 29.5 38 Z" fill="#284B82" />
          <circle cx="20" cy="19" r="7" fill="#F2E7CF" stroke="#173668" strokeWidth="1.4" />
          <path d="M12.5 17 C12 11.5, 18 9, 24 10.5 C27 11.5, 28 15, 27 17 C24 14, 16 14, 12.5 17 Z" fill="#173668" />
          <circle cx="17.5" cy="19" r="0.8" fill="#173668" />
          <circle cx="22.5" cy="19" r="0.8" fill="#173668" />
        </g>
      );

    case 'Eugenio Pacelli':
    case 'Papst Pius XI.':
      return (
        <g>
          <path d="M9.5 38 C10.5 29.5, 29.5 29.5, 30.5 38 Z" fill="#9E2424" />
          <line x1="20" y1="30.5" x2="20" y2="36" stroke="#FAF4E6" strokeWidth="1.3" />
          <line x1="17.8" y1="32.5" x2="22.2" y2="32.5" stroke="#FAF4E6" strokeWidth="1.3" />
          <circle cx="20" cy="18.5" r="6.8" fill="#F2E7CF" stroke="#173668" strokeWidth="1.4" />
          <path d="M14.5 13.5 Q20 9.5 25.5 13.5 Z" fill="#FAF4E6" stroke="#173668" strokeWidth="1.1" />
          <circle cx="17.6" cy="18.5" r="0.8" fill="#173668" />
          <circle cx="22.4" cy="18.5" r="0.8" fill="#173668" />
        </g>
      );

    case 'Reichsregierung':
      return (
        <g>
          <polygon points="9,16 20,10 31,16" fill="#173668" />
          <rect x="10" y="16.5" width="20" height="2" fill="#9E2424" />
          <rect x="11.5" y="19" width="2.8" height="10" fill="#173668" />
          <rect x="18.6" y="19" width="2.8" height="10" fill="#173668" />
          <rect x="25.7" y="19" width="2.8" height="10" fill="#173668" />
          <rect x="9" y="29" width="22" height="2.5" fill="#173668" />
        </g>
      );

    case 'Preußische Polizei':
    case 'Bayerische Polizei':
      return (
        <g>
          <path
            d="M11.5 12.5 L20 10 L28.5 12.5 L28.5 21.5 C28.5 26.5, 20 31, 20 31 C20 31, 11.5 26.5, 11.5 21.5 Z"
            fill="#173668"
          />
          <circle cx="20" cy="20" r="4.2" fill="#FAF4E6" />
          <circle cx="20" cy="20" r="1.8" fill="#9E2424" />
        </g>
      );

    case 'Gewerkschaften':
    case 'Deutsche Arbeitsfront (DAF)':
      return (
        <g>
          <circle cx="20" cy="20" r="6.5" fill="none" stroke="#173668" strokeWidth="3.2" strokeDasharray="3 2.1" />
          <circle cx="20" cy="20" r="4.2" fill="#FAF4E6" stroke="#9E2424" strokeWidth="1.4" />
          <circle cx="20" cy="20" r="1.5" fill="#173668" />
        </g>
      );

    case 'SA':
    case 'SS':
    case 'NSBO':
    case 'NS-Studentenverbände':
      return (
        <g>
          <rect x="11" y="11" width="18" height="18" rx="2" fill="#9E2424" />
          <circle cx="20" cy="20" r="5.5" fill="#FAF4E6" />
          <text
            x="20"
            y="22.3"
            textAnchor="middle"
            fontSize="6.8"
            fontWeight="700"
            fontFamily="monospace"
            fill="#173668"
          >
            {name === 'SA' || name === 'SS' ? name : name === 'NSBO' ? 'NS' : 'ST'}
          </text>
        </g>
      );

    default:
      return (
        <g>
          <circle cx="20" cy="20" r="9.5" fill="#FAF4E6" stroke="#173668" strokeWidth="1.5" />
          <circle
            cx="20"
            cy="20"
            r="7"
            fill={name === 'NSDAP' ? '#9E2424' : '#173668'}
          />
          <text
            x="20"
            y="22.3"
            textAnchor="middle"
            fontSize="6.5"
            fontWeight="700"
            fontFamily="monospace"
            fill="#FAF4E6"
          >
            {getInitials(name)}
          </text>
        </g>
      );
  }
}

export function ActorAvatar({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  const dims = size === 'md' ? 'w-9 h-9' : 'w-8 h-8';
  return (
    <div
      className={`${dims} rounded-full bg-[#EFE7D6] border border-[#B8A890] overflow-hidden shrink-0 flex items-center justify-center`}
    >
      <svg viewBox="0 0 40 40" className="w-full h-full" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="#F5EFE1" stroke="#CBBBA0" strokeWidth="1" />
        {renderPortraitGlyph(name)}
      </svg>
    </div>
  );
}

export function ActorMiniProfile({
  actor,
  isSelected = false,
  onSelect,
}: ActorMiniProfileProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      title={`${actor.name} – Klicken für Info`}
      className={`group relative inline-flex items-center gap-2 px-2 py-1.5 text-left transition-all cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#9E2424] ${
        isSelected
          ? 'bg-[#FAF4E6] border border-[#9E2424] shadow-[0_3px_8px_rgba(158,36,36,0.22)] -translate-y-0.5'
          : 'bg-[#FAF4E6]/85 border border-[#C6B9A4] shadow-[0_1px_3px_rgba(45,28,10,0.12)] hover:border-[#173668] hover:bg-[#FAF4E6]'
      }`}
    >
      {/* Miniature Red Pin Dot when selected */}
      {isSelected && (
        <span
          aria-hidden="true"
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#9E2424] border border-[#681212] shadow-xs"
        />
      )}
      <ActorAvatar name={actor.name} size="sm" />
      <span className="text-xs font-semibold text-[#173668] leading-tight">
        {actor.name}
      </span>
    </button>
  );
}
