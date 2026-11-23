import { useEffect, useState } from 'react';
import { ActorEntry, ARCHIVAL_IMAGES } from '../data/timelineData';

interface ActorMiniProfileProps {
  actor: ActorEntry;
  isSelected?: boolean;
  onSelect?: () => void;
}

type ActorVisual =
  | {
      kind: 'portrait';
      src: string;
      fallbackSrc?: string;
      focal?: 'top' | 'center';
    }
  | {
      kind: 'logo';
      src: string;
      fallbackSrc?: string;
    }
  | {
      kind: 'dual-logo';
      srcs: [string, string];
      fallbackSrc?: string;
    }
  | {
      kind: 'svg-emblem';
      emblem: 'bvp' | 'adgb';
    };

// Verified Wikimedia Commons / Bundesarchiv historical portraits for individuals
// and official historical party/organization/state logos & emblems for collective actors.
const ACTOR_VISUALS: Record<string, ActorVisual> = {
  'Adolf Hitler': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/Bundesarchiv_Bild_183-H1216-0500-002%2C_Adolf_Hitler.jpg/330px-Bundesarchiv_Bild_183-H1216-0500-002%2C_Adolf_Hitler.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.berlinStreet,
    focal: 'top',
  },
  'Paul von Hindenburg': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/62/Bundesarchiv_Bild_183-R17289%2C_Paul_v._Hindenburg.jpg/330px-Bundesarchiv_Bild_183-R17289%2C_Paul_v._Hindenburg.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.potsdam,
    focal: 'top',
  },
  'Franz von Papen': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Bundesarchiv_Bild_183-1988-0113-500%2C_Franz_v._Papen_%28cropped%29.jpg/330px-Bundesarchiv_Bild_183-1988-0113-500%2C_Franz_v._Papen_%28cropped%29.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.decree,
    focal: 'top',
  },
  'Alfred Hugenberg': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/eb/Bundesarchiv_Bild_183-2005-0621-500%2C_Reichsminister_Alfred_Hugenberg.jpg/330px-Bundesarchiv_Bild_183-2005-0621-500%2C_Reichsminister_Alfred_Hugenberg.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.printingPress,
    focal: 'top',
  },
  'Wilhelm Frick': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/ca/Frick_912_%283x4_cropped%29_%282%29.jpg/330px-Frick_912_%283x4_cropped%29_%282%29.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.decree,
    focal: 'top',
  },
  'Hermann Göring': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6b/Bundesarchiv_Bild_102-13805%2C_Hermann_G%C3%B6ring.jpg/330px-Bundesarchiv_Bild_102-13805%2C_Hermann_G%C3%B6ring.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.reichstag,
    focal: 'top',
  },
  'Gustav Krupp': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/8/8e/Bundesarchiv_Bild_102-12331%2C_Gustav_Krupp_von_Bohlen_und_Halbach.jpg/330px-Bundesarchiv_Bild_102-12331%2C_Gustav_Krupp_von_Bohlen_und_Halbach.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.berlinStreet,
    focal: 'top',
  },
  'Albert Vögler': {
    kind: 'portrait',
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/40/VoglerAlbert_Blitz.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.berlinStreet,
    focal: 'top',
  },
  'Hjalmar Schacht': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a9/Bundesarchiv_Bild_102-12733%2C_Hjalmar_Schacht.jpg/330px-Bundesarchiv_Bild_102-12733%2C_Hjalmar_Schacht.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.berlinStreet,
    focal: 'top',
  },
  'Kurt von Schröder': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/K%C3%B6ln-Lindenthal_Stadtwaldg%C3%BCrtel_35.jpg/330px-K%C3%B6ln-Lindenthal_Stadtwaldg%C3%BCrtel_35.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.berlinStreet,
    focal: 'center',
  },
  'Marinus van der Lubbe': {
    kind: 'portrait',
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/MarinusvanderLubbe1.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.reichstag,
    focal: 'top',
  },
  'Heinrich Himmler': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/79/Bundesarchiv_Bild_183-S72707%2C_Heinrich_Himmler.jpg/330px-Bundesarchiv_Bild_183-S72707%2C_Heinrich_Himmler.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.dachau,
    focal: 'top',
  },
  'Otto Wels': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Bundesarchiv_Bild_102-13200%2C_Otto_Wels.jpg/330px-Bundesarchiv_Bild_102-13200%2C_Otto_Wels.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.parliament,
    focal: 'top',
  },
  'Eugenio Pacelli': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/03/Pius_XII%2C_Papst.jpg/330px-Pius_XII%2C_Papst.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.vatican,
    focal: 'top',
  },
  'Ludwig Kaas': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/4/46/Ludwig_Kaas_1928.jpg/330px-Ludwig_Kaas_1928.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.vatican,
    focal: 'top',
  },
  'Robert Ley': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Bundesarchiv_Bild_183-2008-0922-501%2C_Robert_Ley.jpg/330px-Bundesarchiv_Bild_183-2008-0922-501%2C_Robert_Ley.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.unionHouse,
    focal: 'top',
  },
  'Erich Kästner': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/52/Erich_K%C3%A4stner_1961.jpg/330px-Erich_K%C3%A4stner_1961.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.library,
    focal: 'top',
  },
  'Heinrich Mann': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Heinrich_Mann_in_seinen_M%C3%BCnchner_Jahren.png/330px-Heinrich_Mann_in_seinen_M%C3%BCnchner_Jahren.png',
    fallbackSrc: ARCHIVAL_IMAGES.library,
    focal: 'top',
  },
  'Erich Maria Remarque': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Bundesarchiv_Bild_183-R04034%2C_Erich_Maria_Remarque_%28cropped%29.jpg/330px-Bundesarchiv_Bild_183-R04034%2C_Erich_Maria_Remarque_%28cropped%29.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.library,
    focal: 'top',
  },
  'Bertolt Brecht': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Bundesarchiv_Bild_183-W0409-300%2C_Bertolt_Brecht.jpg/330px-Bundesarchiv_Bild_183-W0409-300%2C_Bertolt_Brecht.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.library,
    focal: 'top',
  },
  'Papst Pius XI.': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f9/Pius_XI%2C_by_Nicola_Perscheid_%28retouched%29.jpg/330px-Pius_XI%2C_by_Nicola_Perscheid_%28retouched%29.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.vatican,
    focal: 'top',
  },
  'Erich Klausener': {
    kind: 'portrait',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/30/E.Klausener0002.jpg/330px-E.Klausener0002.jpg',
    fallbackSrc: ARCHIVAL_IMAGES.vatican,
    focal: 'top',
  },

  // Official Party, Organization & State Institution Logos / Crests
  NSDAP: {
    kind: 'logo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fc/NSDAP-Logo.svg/330px-NSDAP-Logo.svg.png',
    fallbackSrc: ARCHIVAL_IMAGES.ballotBox,
  },
  Reichsregierung: {
    kind: 'logo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/fb/Wappen_Deutsches_Reich_%28Weimarer_Republik%29.svg/330px-Wappen_Deutsches_Reich_%28Weimarer_Republik%29.svg.png',
    fallbackSrc: ARCHIVAL_IMAGES.parliament,
  },
  SA: {
    kind: 'logo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/dc/SA-Logo.svg/330px-SA-Logo.svg.png',
    fallbackSrc: ARCHIVAL_IMAGES.berlinStreet,
  },
  SS: {
    kind: 'logo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/Schutzstaffel_Abzeichen.svg/330px-Schutzstaffel_Abzeichen.svg.png',
    fallbackSrc: ARCHIVAL_IMAGES.dachau,
  },
  'Preußische Polizei': {
    kind: 'logo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/05/Coat_of_arms_of_Prussia_%281918%E2%80%931933%29.svg/330px-Coat_of_arms_of_Prussia_%281918%E2%80%931933%29.svg.png',
    fallbackSrc: ARCHIVAL_IMAGES.berlinStreet,
  },
  'Bayerische Polizei': {
    kind: 'logo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d5/Coat_of_arms_of_Bavaria.svg/330px-Coat_of_arms_of_Bavaria.svg.png',
    fallbackSrc: ARCHIVAL_IMAGES.berlinStreet,
  },
  DNVP: {
    kind: 'logo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ea/DNVP_logo_%28basic%29.svg/330px-DNVP_logo_%28basic%29.svg.png',
    fallbackSrc: ARCHIVAL_IMAGES.parliament,
  },
  'KPD & SPD': {
    kind: 'dual-logo',
    srcs: [
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Kommunistische_Partei_Deutschlands%2C_Logo_um_1920.svg/330px-Kommunistische_Partei_Deutschlands%2C_Logo_um_1920.svg.png',
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Flag_of_the_Social_Democratic_Party_of_Germany.svg/330px-Flag_of_the_Social_Democratic_Party_of_Germany.svg.png',
    ],
    fallbackSrc: ARCHIVAL_IMAGES.printingPress,
  },
  SPD: {
    kind: 'logo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/df/Flag_of_the_Social_Democratic_Party_of_Germany.svg/330px-Flag_of_the_Social_Democratic_Party_of_Germany.svg.png',
    fallbackSrc: ARCHIVAL_IMAGES.parliament,
  },
  Zentrumspartei: {
    kind: 'logo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d2/Logo_of_the_German_Centre_Party.svg/330px-Logo_of_the_German_Centre_Party.svg.png',
    fallbackSrc: ARCHIVAL_IMAGES.vatican,
  },
  'Bayerische Volkspartei': {
    kind: 'svg-emblem',
    emblem: 'bvp',
  },
  Gewerkschaften: {
    kind: 'svg-emblem',
    emblem: 'adgb',
  },
  NSBO: {
    kind: 'logo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/ab/NSBO.svg/330px-NSBO.svg.png',
    fallbackSrc: ARCHIVAL_IMAGES.unionHouse,
  },
  'Deutsche Arbeitsfront (DAF)': {
    kind: 'logo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f8/Deutsche_Arbeitsfront.svg/330px-Deutsche_Arbeitsfront.svg.png',
    fallbackSrc: ARCHIVAL_IMAGES.unionHouse,
  },
  'NS-Studentenverbände': {
    kind: 'logo',
    src: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Nationalsozialistischer_Deutscher_Studentenbund.svg/330px-Nationalsozialistischer_Deutscher_Studentenbund.svg.png',
    fallbackSrc: ARCHIVAL_IMAGES.library,
  },
};

function getInitials(name: string): string {
  const cleaned = name
    .replace(/\(.*?\)/g, '')
    .replace(/^(von|van der)\s+/i, '')
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase();
}

function HistoricalOrgEmblem({ emblem }: { emblem: 'bvp' | 'adgb' }) {
  if (emblem === 'bvp') {
    return (
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="w-full h-full p-1"
      >
        <path
          d="M10 10 H54 V34 C54 47 32 56 32 56 C32 56 10 47 10 34 Z"
          fill="#FAF6EC"
          stroke="#173668"
          strokeWidth="3"
        />
        <clipPath id="bvp-shield">
          <path d="M12 12 H52 V34 C52 45 32 53 32 53 C32 53 12 45 12 34 Z" />
        </clipPath>
        <g clipPath="url(#bvp-shield)" opacity="0.26">
          <polygon points="10,12 26,12 10,28" fill="#173668" />
          <polygon points="34,12 52,12 22,42 10,30" fill="#173668" />
          <polygon points="52,20 52,38 30,54 18,48" fill="#173668" />
        </g>
        <rect
          x="13"
          y="23"
          width="38"
          height="18"
          fill="#173668"
          stroke="#FAF6EC"
          strokeWidth="1.5"
        />
        <text
          x="32"
          y="36"
          textAnchor="middle"
          fill="#FAF6EC"
          fontSize="12"
          fontWeight="bold"
          fontFamily="Georgia, serif"
          letterSpacing="1"
        >
          BVP
        </text>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="w-full h-full p-1"
    >
      <circle
        cx="32"
        cy="32"
        r="24"
        fill="#FAF6EC"
        stroke="#9E2424"
        strokeWidth="3"
        strokeDasharray="6 3"
      />
      <circle
        cx="32"
        cy="32"
        r="19"
        fill="#9E2424"
        stroke="#681212"
        strokeWidth="1.5"
      />
      <text
        x="32"
        y="36"
        textAnchor="middle"
        fill="#FAF6EC"
        fontSize="11.5"
        fontWeight="bold"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.5"
      >
        ADGB
      </text>
    </svg>
  );
}

export function ActorAvatar({
  name,
  size = 'sm',
}: {
  name: string;
  size?: 'sm' | 'md';
}) {
  const visual = ACTOR_VISUALS[name];
  const initialSrc =
    visual?.kind === 'portrait' || visual?.kind === 'logo' ? visual.src : null;

  const [currentSrc, setCurrentSrc] = useState<string | null>(initialSrc);
  const [failedAll, setFailedAll] = useState(false);

  useEffect(() => {
    const nextSrc =
      visual?.kind === 'portrait' || visual?.kind === 'logo'
        ? visual.src
        : null;
    setCurrentSrc(nextSrc);
    setFailedAll(false);
  }, [name, visual]);

  const dims =
    size === 'md'
      ? 'w-12 h-13 p-0.5'
      : 'w-9 h-10 sm:w-10 sm:h-11 p-[2px]';

  if (visual?.kind === 'svg-emblem') {
    return (
      <div
        className={`${dims} relative bg-[#FAF6EC] border border-[#A69274] shadow-[1px_2px_4px_rgba(38,20,6,0.22)] shrink-0 overflow-hidden flex items-center justify-center`}
      >
        <HistoricalOrgEmblem emblem={visual.emblem} />
      </div>
    );
  }

  if (visual?.kind === 'dual-logo') {
    return (
      <div
        className={`${dims} relative bg-[#FAF6EC] border border-[#A69274] shadow-[1px_2px_4px_rgba(38,20,6,0.22)] shrink-0 overflow-hidden grid grid-cols-2 gap-[1px] items-center justify-items-center p-0.5`}
      >
        {visual.srcs.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={i === 0 ? 'KPD Logo' : 'SPD Logo'}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-contain contrast-[1.08]"
          />
        ))}
      </div>
    );
  }

  const isLogo = visual?.kind === 'logo';
  const fallback =
    visual && 'fallbackSrc' in visual ? visual.fallbackSrc : undefined;

  return (
    <div
      className={`${dims} relative bg-[#FAF6EC] border border-[#A69274] shadow-[1px_2px_4px_rgba(38,20,6,0.22)] shrink-0 overflow-hidden flex items-center justify-center`}
    >
      {!failedAll && currentSrc ? (
        <img
          src={currentSrc}
          alt={name}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => {
            if (fallback && currentSrc !== fallback) {
              setCurrentSrc(fallback);
            } else {
              setFailedAll(true);
            }
          }}
          className={
            isLogo
              ? 'w-full h-full object-contain p-0.5 contrast-[1.08]'
              : `w-full h-full object-cover ${
                  visual?.kind === 'portrait' && visual.focal === 'center'
                    ? 'object-center'
                    : 'object-top'
                } grayscale contrast-[1.12] sepia-[0.24] brightness-[0.98]`
          }
        />
      ) : (
        <div className="w-full h-full bg-[#E8DEC8] flex items-center justify-center font-mono text-[10px] font-bold text-[#173668]">
          {getInitials(name)}
        </div>
      )}
      {!isLogo && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 shadow-[inset_0_0_8px_rgba(32,18,6,0.22)]"
        />
      )}
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
      className={`group relative flex flex-col items-center justify-start gap-1.5 px-1.5 py-1.5 text-center transition-all cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#9E2424] ${
        isSelected
          ? 'bg-[#FAF4E6] border border-[#9E2424] shadow-[0_3px_8px_rgba(158,36,36,0.22)] -translate-y-0.5'
          : 'bg-[#FAF4E6]/85 border border-[#C6B9A4] shadow-[0_1px_3px_rgba(45,28,10,0.12)] hover:border-[#173668] hover:bg-[#FAF4E6]'
      }`}
    >
      {/* Miniature Red Pin Dot when selected */}
      {isSelected && (
        <span
          aria-hidden="true"
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#9E2424] border border-[#681212] shadow-xs z-10"
        />
      )}
      <ActorAvatar name={actor.name} size="sm" />
      <span className="text-[9.5px] sm:text-[10px] font-medium text-[#173668] leading-[1.15] break-words w-full">
        {actor.name}
      </span>
    </button>
  );
}
