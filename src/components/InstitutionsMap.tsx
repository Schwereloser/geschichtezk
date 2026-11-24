import {
  BookOpen,
  Building2,
  ChevronDown,
  ChevronUp,
  Church,
  Flame,
  Landmark,
  MapPin,
  Plus,
  Scale,
  Shield,
  Users,
  Vote,
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  INSTITUTIONS,
  InstitutionId,
  InstitutionStatus,
  NEW_ORGANS,
  NewOrganId,
  TimelineEvent,
} from '../data/timelineData';

interface InstitutionsMapProps {
  centerEvent: TimelineEvent;
  isCompact: boolean;
  isFocusDimmed: boolean;
  onToggleCompact: () => void;
}

const INSTITUTION_ICONS: Record<InstitutionId, typeof Scale> = {
  grundrechte: Scale,
  reichstag: Landmark,
  regierung: Building2,
  laender: MapPin,
  polizei: Shield,
  parteien: Vote,
  gewerkschaften: Users,
  kultur: BookOpen,
  kirche: Church,
};

const NEW_ORGAN_ICONS: Record<NewOrganId, typeof Shield> = {
  hilfspolizei: Shield,
  'kz-system': Flame,
  reichsstatthalter: MapPin,
  daf: Users,
  einparteienstaat: Landmark,
};

const TIERS: InstitutionId[][] = [
  ['grundrechte', 'reichstag', 'regierung'],
  ['laender', 'polizei', 'parteien'],
  ['gewerkschaften', 'kultur', 'kirche'],
];

const STATUS_STYLE: Record<
  InstitutionStatus,
  {
    card: string;
    iconColor: string;
    title: string;
    stamp: string;
    label: string;
    pinColor: string;
  }
> = {
  normal: {
    card: 'bg-[#FFFFFF] border-[#C2B49B] shadow-[1px_2px_5px_rgba(45,28,10,0.12)]',
    iconColor: 'text-[#173668]',
    title: 'text-[#173668]',
    stamp: 'text-[#173668] border-[#C9BCAA] bg-[#FAF7F0]',
    label: 'Intakt',
    pinColor: 'bg-[#9E2424] border-[#681212]',
  },
  attacked: {
    card: 'bg-[#BA2525] border-[#781212] shadow-[2px_4px_10px_rgba(110,16,16,0.3)]',
    iconColor: 'text-[#FAF4E6]',
    title: 'text-[#FFFFFF]',
    stamp: 'text-[#FFF4E6] border-[#F0A0A0]/60 bg-[#8F1919]',
    label: 'Eingriff',
    pinColor: 'bg-[#FAF4E6] border-[#781212]',
  },
  destroyed: {
    card: 'bg-[#DDD8CE]/90 border-[#ABA599] border-dashed opacity-85',
    iconColor: 'text-[#6A665E]',
    title: 'text-[#615D56] line-through decoration-[#7A756D]/65',
    stamp: 'text-[#615D56] border-[#ABA69C] bg-[#CFCAC0]',
    label: 'Zerstört',
    pinColor: 'bg-[#8E8980] border-[#5E5A52]',
  },
};

export function InstitutionsMap({
  centerEvent,
  isCompact,
  isFocusDimmed,
  onToggleCompact,
}: InstitutionsMapProps) {
  const institutionById = new Map(INSTITUTIONS.map((inst) => [inst.id, inst]));

  const statusCounts = INSTITUTIONS.reduce(
    (acc, inst) => {
      const s = centerEvent.institutionStates[inst.id];
      acc[s] += 1;
      return acc;
    },
    { normal: 0, attacked: 0, destroyed: 0 } as Record<InstitutionStatus, number>
  );

  const activeNewOrgansCount = Object.keys(centerEvent.newOrgans).length;

  return (
    <motion.div
      layoutId="institutions-board"
      transition={{
        layout: { duration: 0.82, ease: [0.22, 1, 0.36, 1] },
      }}
      aria-label="Pinwand: Zustand der Institutionen und neue NS-Organe"
      className={`pointer-events-none relative w-full min-w-0 max-w-[630px] xl:max-w-[740px] z-[5] flex flex-col justify-end transition-opacity duration-300 ${
        isFocusDimmed ? 'opacity-25' : 'opacity-100'
      }`}
    >
      {/* Pinned Paper Sheet Backdrop on the Cork Pinboard */}
      <div className="relative w-full mx-auto notepaper-sheet border border-[#A69274] shadow-[4px_10px_24px_-6px_rgba(38,20,6,0.38)] px-3 sm:px-5 pt-2.5 pb-2">
        {/* Corner Masking Tape & Red Pinboard Tacks */}
        <span
          aria-hidden="true"
          className="masking-tape w-10 h-2.5 -rotate-12 absolute -top-1.5 -left-2"
        />
        <span
          aria-hidden="true"
          className="masking-tape w-10 h-2.5 rotate-12 absolute -top-1.5 -right-2"
        />

        {/* Header Strip: Date, Summary Note & Compact Toggle */}
        <div
          className={`relative z-10 flex items-start justify-between gap-2 ${
            isCompact ? 'pb-1.5' : 'pb-1.5 mb-2 border-b border-[#C6B8A1]'
          }`}
        >
          <div className="min-w-0">
            <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#9E2424] font-semibold">
              Institutionen · {centerEvent.dateLabel}
            </span>
            <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-[#173668] leading-snug">
              {centerEvent.institutionNote}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompact();
            }}
            aria-expanded={!isCompact}
            className="pointer-events-auto shrink-0 inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono bg-[#FAF4E6]/90 hover:bg-white border border-[#B8A58B] hover:border-[#9E2424] text-[#173668] hover:text-[#9E2424] transition-colors cursor-pointer touch-manipulation whitespace-nowrap"
          >
            <span>{isCompact ? 'Tafel öffnen' : 'Kompakt'}</span>
            {isCompact ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>

        {isCompact ? (
          <div className="relative z-10 pt-1.5 border-t border-dashed border-[#C6B8A1] flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[10.5px] font-mono tabular-nums text-[#173668]">
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
              <span>{statusCounts.normal} intakt</span>
              <span aria-hidden="true" className="text-[#9C8B74]">·</span>
              <span className="text-[#9E2424] font-semibold">
                {statusCounts.attacked} Eingriff
              </span>
              <span aria-hidden="true" className="text-[#9C8B74]">·</span>
              <span className="text-[#615D56]">
                {statusCounts.destroyed} zerstört
              </span>
            </div>
            <span className="text-[#2C4E84]">
              NS-Organe: {activeNewOrgansCount}/{NEW_ORGANS.length}
            </span>
          </div>
        ) : (
          <>
            {/* Weimar & Societal Institutions (clean straight grid without jittery tilts) */}
            <div className="relative z-10 space-y-1.5">
              {TIERS.map((tier, tierIdx) => (
                <div key={tierIdx} className="grid grid-cols-3 gap-2 sm:gap-2.5">
                  {tier.map((id) => {
                    const inst = institutionById.get(id);
                    if (!inst) return null;
                    const status = centerEvent.institutionStates[id];
                    const style = STATUS_STYLE[status];
                    const Icon = INSTITUTION_ICONS[id];

                    return (
                      <div
                        key={id}
                        className={`relative border px-2 sm:px-2.5 py-1.5 flex items-center justify-between gap-1.5 transition-colors duration-200 ${style.card}`}
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                          <Icon
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors duration-200 ${style.iconColor}`}
                          />
                          <p
                            className={`text-[10px] sm:text-[11px] font-serif font-semibold leading-tight transition-colors duration-200 truncate ${style.title}`}
                          >
                            <span className="hidden xl:inline">{inst.label}</span>
                            <span className="xl:hidden">{inst.shortLabel}</span>
                          </p>
                        </div>

                        <span
                          className={`hidden sm:inline-block shrink-0 px-1 py-0.5 text-[9px] font-mono uppercase tracking-wider border transition-colors duration-200 ${style.stamp}`}
                        >
                          {style.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* New NS Organs Added Over Time ("Neue NS-Organe") */}
            <div className="relative z-10 mt-2 pt-1.5 border-t border-dashed border-[#B29E7F]">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#9E2424] font-semibold">
                  <Plus className="w-3 h-3" />
                  <span>Neu geschaffene NS-Organe</span>
                </span>
                <span className="font-mono text-[10px] text-[#2C4E84] tabular-nums">
                  {activeNewOrgansCount} von {NEW_ORGANS.length} eingerichtet
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
                {NEW_ORGANS.map((organ) => {
                  const status = centerEvent.newOrgans[organ.id];
                  const Icon = NEW_ORGAN_ICONS[organ.id];

                  if (!status) {
                    return (
                      <div
                        key={organ.id}
                        className="border border-dashed border-[#BFB096] bg-[#EAE1CF]/45 px-2.5 py-1.5 flex flex-col justify-between gap-0.5 opacity-60"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <Icon className="w-3 h-3 text-[#7A6D58] shrink-0" />
                          <span className="text-[9px] font-mono text-[#7A6D58] whitespace-nowrap">
                            {organ.foundedLabel}
                          </span>
                        </div>
                        <span className="text-[11px] font-serif font-medium text-[#5E5343] leading-tight truncate">
                          {organ.shortLabel}
                        </span>
                      </div>
                    );
                  }

                  const isJustCreated = status === 'created';

                  return (
                    <motion.div
                      key={organ.id}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className={`relative border px-2.5 py-1.5 flex flex-col justify-between gap-0.5 ${
                        isJustCreated
                          ? 'bg-[#9E2424] border-[#641010] text-[#FAF4E6] shadow-[2px_4px_10px_rgba(158,36,36,0.32)]'
                          : 'bg-[#EFE0CA] border-[#9E2424]/80 text-[#173668]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <Icon
                          className={`w-3 h-3 shrink-0 ${
                            isJustCreated ? 'text-[#FAF4E6]' : 'text-[#9E2424]'
                          }`}
                        />
                        <span
                          className={`text-[8px] font-mono uppercase tracking-wider px-1 border shrink-0 ${
                            isJustCreated
                              ? 'border-[#FAF4E6]/50 bg-[#781515] text-[#FAF4E6]'
                              : 'border-[#9E2424]/40 bg-[#FAF4E6]/70 text-[#9E2424]'
                          }`}
                        >
                          {isJustCreated ? 'Neu' : 'Aktiv'}
                        </span>
                      </div>
                      <span className="text-[11px] font-serif font-semibold leading-tight truncate">
                        {organ.shortLabel}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

