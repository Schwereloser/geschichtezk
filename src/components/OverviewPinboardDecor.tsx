import { motion } from 'motion/react';
import { ARCHIVAL_IMAGES, GUIDING_QUESTION } from '../data/timelineData';

interface OverviewPinboardDecorProps {
  isOverview: boolean;
}

const ZOOM_EASE = [0.22, 1, 0.36, 1] as const;

export function OverviewPinboardDecor({
  isOverview,
}: OverviewPinboardDecorProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none select-none absolute inset-0 z-[1] overflow-hidden"
    >
      {/* Logical, Nearly-Straight Pinboard Threads (connect pushpins to notes in overview; fade out cleanly on zoom-in) */}
      <motion.svg
        initial={false}
        animate={{
          opacity: isOverview ? 0.85 : 0,
          scale: isOverview ? 1 : 2.15,
        }}
        transition={{
          opacity: { duration: 0.65, ease: ZOOM_EASE },
          scale: { duration: 1.15, ease: ZOOM_EASE },
        }}
        style={{ transformOrigin: '50% 42%' }}
        viewBox="0 0 1400 800"
        preserveAspectRatio="none"
        className="hidden sm:block absolute inset-0 w-full h-full z-0"
      >
        {/* Subtle drop shadow behind taut red threads */}
        <g
          fill="none"
          stroke="rgba(42,22,6,0.2)"
          strokeWidth="3.2"
          strokeLinecap="round"
          transform="translate(1.5,3)"
        >
          {/* Left chain: Title Banner -> Timeline Start / Krolloper -> 30. Jan -> Ausschaltung des Rechts -> InstitutionsMap */}
          <path d="M 350 32 Q 292 165, 235 295" />
          <path d="M 350 32 Q 236 174, 126 312" />
          <path d="M 126 312 Q 120 488, 119 664" />
          <path d="M 119 664 Q 238 660, 357 648" />
          <path d="M 357 648 Q 442 589, 525 525" />

          {/* Right chain: Title Banner -> Timeline End / Bücherverbrennung -> 22. Mär-14. Jul -> Gleichschaltung -> InstitutionsMap */}
          <path d="M 1050 32 Q 1108 165, 1165 295" />
          <path d="M 1050 32 Q 1164 174, 1274 312" />
          <path d="M 1274 312 Q 1280 488, 1281 664" />
          <path d="M 1281 664 Q 1162 660, 1043 648" />
          <path d="M 1043 648 Q 958 589, 875 525" />
        </g>

        {/* Taut, nearly-straight red wool cords connecting pushpins & notes */}
        <g
          fill="none"
          stroke="#9E2424"
          strokeWidth="2.1"
          strokeLinecap="round"
        >
          <path d="M 350 32 Q 292 165, 235 295" />
          <path d="M 350 32 Q 236 174, 126 312" />
          <path d="M 126 312 Q 120 488, 119 664" />
          <path d="M 119 664 Q 238 660, 357 648" />
          <path d="M 357 648 Q 442 589, 525 525" />

          <path d="M 1050 32 Q 1108 165, 1165 295" />
          <path d="M 1050 32 Q 1164 174, 1274 312" />
          <path d="M 1274 312 Q 1280 488, 1281 664" />
          <path d="M 1281 664 Q 1162 660, 1043 648" />
          <path d="M 1043 648 Q 958 589, 875 525" />
        </g>

        {/* Anchor pushpin dots at timeline start/end & central chart connectors */}
        <g fill="#9E2424" stroke="#681212" strokeWidth="1.5">
          <circle cx="235" cy="295" r="4" />
          <circle cx="1165" cy="295" r="4" />
          <circle cx="525" cy="525" r="4" />
          <circle cx="875" cy="525" r="4" />
        </g>
      </motion.svg>

      {/* PROMINENT TOP PINNED TITLE BANNER (glides up & shrinks into top bar during zoom) */}
      <motion.div
        initial={false}
        animate={{
          y: isOverview ? 0 : -190,
          scale: isOverview ? 1 : 0.56,
          rotate: isOverview ? -0.4 : 0,
        }}
        transition={{ duration: 1.05, ease: ZOOM_EASE }}
        style={{ transformOrigin: 'top center' }}
        className="absolute top-3 sm:top-5 left-1/2 -translate-x-1/2 w-[92%] max-w-[780px] z-20"
      >
        <div className="relative notepaper-sheet border border-[#A69070] px-6 sm:px-10 py-3 sm:py-4 shadow-[4px_10px_24px_rgba(38,20,6,0.42)] text-center">
          <span className="masking-tape w-14 h-3.5 -rotate-12 absolute -top-2 -left-3" />
          <span className="masking-tape w-14 h-3.5 rotate-12 absolute -top-2 -right-3" />
          <span className="absolute top-2 left-3 w-3 h-3 rounded-full bg-[#9E2424] border-2 border-[#681212] shadow-xs" />
          <span className="absolute top-2 right-3 w-3 h-3 rounded-full bg-[#9E2424] border-2 border-[#681212] shadow-xs" />

          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#9E2424] font-semibold">
            Historischer Zeitstrahl · Januar – Juli 1933
          </p>
          <h1 className="mt-1 font-serif text-xl sm:text-3xl lg:text-[38px] font-bold text-[#173668] leading-tight tracking-tight">
            Einrichtung und Sicherung der NS-Diktatur
          </h1>
          <p className="mt-1 font-serif italic text-xs sm:text-sm text-[#284B82]">
            22 Stationen – „{GUIDING_QUESTION}“
          </p>
        </div>
      </motion.div>

      {/* OUTER LEFT COLLAGE ITEMS (fly outward past the left/bottom edge as camera zooms in) */}
      <motion.div
        initial={false}
        animate={{
          x: isOverview ? 0 : -520,
          y: isOverview ? 0 : 120,
          scale: isOverview ? 1 : 1.45,
          rotate: isOverview ? -4 : -10,
        }}
        transition={{ duration: 1.15, ease: ZOOM_EASE }}
        className="hidden sm:block absolute left-[2.5%] top-[39%] z-10 w-36 md:w-44 lg:w-48 bg-[#FAF6EC] p-2 pb-3 border border-[#B8A58B] shadow-[5px_10px_20px_rgba(38,20,6,0.4)]"
      >
        <div className="masking-tape w-12 h-3 -rotate-12 absolute -top-1.5 -left-2" />
        <div className="w-3.5 h-3.5 rounded-full bg-[#9E2424] border-2 border-[#681212] mx-auto -mt-4 mb-1.5 shadow-[1px_2px_4px_rgba(38,20,6,0.45)]" />
        <img
          src={ARCHIVAL_IMAGES.parliament}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full aspect-[4/3] object-cover sepia-[0.42] grayscale-[0.22] contrast-[1.06] border border-[#D4C7B2]"
        />
        <p className="mt-1.5 text-[10px] font-mono text-[#173668] text-center">
          Krolloper · 23. März 1933
        </p>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          x: isOverview ? 0 : -480,
          y: isOverview ? 0 : 280,
          scale: isOverview ? 1 : 1.4,
          rotate: isOverview ? -2 : -7,
        }}
        transition={{ duration: 1.15, ease: ZOOM_EASE }}
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(44,78,132,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(44,78,132,0.12) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
        className="hidden lg:block absolute left-[18%] bottom-[5%] z-10 w-48 xl:w-56 bg-[#FAF7F0] p-3 pt-4 border border-[#BFB29C] shadow-[5px_10px_22px_rgba(38,20,6,0.38)]"
      >
        <div className="w-3.5 h-3.5 rounded-full bg-[#9E2424] border-2 border-[#681212] mx-auto -mt-5.5 mb-1.5 shadow-[1px_2px_4px_rgba(38,20,6,0.45)]" />
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#9E2424] mb-1">
          Ausschaltung des Rechts
        </p>
        <ul className="space-y-0.5 text-[11px] font-serif text-[#173668] leading-snug">
          <li>· Art. 48 WRV (28. Feb)</li>
          <li>· Schutzhaft &amp; Hilfspolizei</li>
          <li>· Ermächtigungsgesetz (23. Mär)</li>
        </ul>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          x: isOverview ? 0 : -460,
          y: isOverview ? 0 : 260,
          scale: isOverview ? 1 : 1.35,
          rotate: isOverview ? 3.5 : 8,
        }}
        transition={{ duration: 1.15, ease: ZOOM_EASE }}
        className="hidden md:block absolute left-[3%] bottom-[6%] z-10 w-40 bg-[#EFE3BA] p-2.5 pt-3.5 border border-[#C6B383] shadow-[4px_8px_16px_rgba(38,20,6,0.34)]"
      >
        <div className="w-3.5 h-3.5 rounded-full bg-[#9E2424] border-2 border-[#681212] mx-auto -mt-5 mb-1.5 shadow-[1px_2px_4px_rgba(38,20,6,0.45)]" />
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#9E2424] font-semibold">
          30. Jan 1933
        </p>
        <p className="mt-0.5 font-serif text-[11px] text-[#173668] leading-snug">
          Ernennung Hitlers zum Reichskanzler.
        </p>
      </motion.div>

      {/* OUTER RIGHT COLLAGE ITEMS (fly outward past the right/bottom edge as camera zooms in) */}
      <motion.div
        initial={false}
        animate={{
          x: isOverview ? 0 : 520,
          y: isOverview ? 0 : 120,
          scale: isOverview ? 1 : 1.45,
          rotate: isOverview ? 3.8 : 10,
        }}
        transition={{ duration: 1.15, ease: ZOOM_EASE }}
        className="hidden sm:block absolute right-[2.5%] top-[39%] z-10 w-36 md:w-44 lg:w-48 bg-[#FAF6EC] p-2 pb-3 border border-[#B8A58B] shadow-[5px_10px_20px_rgba(38,20,6,0.4)]"
      >
        <div className="masking-tape w-12 h-3 rotate-12 absolute -top-1.5 -right-2" />
        <div className="w-3.5 h-3.5 rounded-full bg-[#9E2424] border-2 border-[#681212] mx-auto -mt-4 mb-1.5 shadow-[1px_2px_4px_rgba(38,20,6,0.45)]" />
        <img
          src={ARCHIVAL_IMAGES.library}
          alt=""
          referrerPolicy="no-referrer"
          className="w-full aspect-[4/3] object-cover sepia-[0.42] grayscale-[0.22] contrast-[1.06] border border-[#D4C7B2]"
        />
        <p className="mt-1.5 text-[10px] font-mono text-[#173668] text-center">
          Bücherverbrennung · Mai 1933
        </p>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          x: isOverview ? 0 : 480,
          y: isOverview ? 0 : 280,
          scale: isOverview ? 1 : 1.4,
          rotate: isOverview ? 2.2 : 7,
        }}
        transition={{ duration: 1.15, ease: ZOOM_EASE }}
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(44,78,132,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(44,78,132,0.12) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
        className="hidden lg:block absolute right-[18%] bottom-[5%] z-10 w-48 xl:w-56 bg-[#FAF7F0] p-3 pt-4 border border-[#BFB29C] shadow-[5px_10px_22px_rgba(38,20,6,0.38)]"
      >
        <div className="w-3.5 h-3.5 rounded-full bg-[#9E2424] border-2 border-[#681212] mx-auto -mt-5.5 mb-1.5 shadow-[1px_2px_4px_rgba(38,20,6,0.45)]" />
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#9E2424] mb-1">
          Gleichschaltung
        </p>
        <ul className="space-y-0.5 text-[11px] font-serif text-[#173668] leading-snug">
          <li>· Zerschlagung Gewerkschaften</li>
          <li>· Parteiverbote &amp; Einparteienstaat</li>
          <li>· Reichskonkordat (20. Jul)</li>
        </ul>
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          x: isOverview ? 0 : 460,
          y: isOverview ? 0 : 260,
          scale: isOverview ? 1 : 1.35,
          rotate: isOverview ? -4 : -9,
        }}
        transition={{ duration: 1.15, ease: ZOOM_EASE }}
        className="hidden md:block absolute right-[3%] bottom-[6%] z-10 w-40 bg-[#F4E8C6] p-2.5 pt-3.5 border border-[#C6B383] shadow-[4px_8px_16px_rgba(38,20,6,0.34)]"
      >
        <div className="w-3.5 h-3.5 rounded-full bg-[#9E2424] border-2 border-[#681212] mx-auto -mt-5 mb-1.5 shadow-[1px_2px_4px_rgba(38,20,6,0.45)]" />
        <p className="font-mono text-[10px] uppercase tracking-wider text-[#9E2424] font-semibold">
          22. Mär – 14. Jul
        </p>
        <p className="mt-0.5 font-serif text-[11px] text-[#173668] leading-snug">
          KZ Dachau, DAF &amp; NSDAP-Staatspartei.
        </p>
      </motion.div>
    </div>
  );
}
