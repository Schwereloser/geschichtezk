import {
  BookOpen,
  Building2,
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
  isOverview: boolean;
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

const CARD_TILTS = [
  '-rotate-[0.7deg]',
  'rotate-[0.5deg]',
  '-rotate-[0.4deg]',
  'rotate-[0.6deg]',
  '-rotate-[0.5deg]',
  'rotate-[0.7deg]',
  '-rotate-[0.4deg]',
  'rotate-[0.5deg]',
  '-rotate-[0.6deg]',
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
    card: 'bg-[#FFFFFF] border-[#AE9D82] shadow-[2px_4px_9px_rgba(45,28,10,0.2)]',
    iconColor: 'text-[#173668]',
    title: 'text-[#173668]',
    stamp: 'text-[#173668] border-[#C9BCAA] bg-[#FAF7F0]',
    label: 'Intakt',
    pinColor: 'bg-[#9E2424] border-[#681212]',
  },
  attacked: {
    card: 'bg-[#BA2525] border-[#781212] shadow-[3px_6px_14px_rgba(110,16,16,0.42)]',
    iconColor: 'text-[#FAF4E6]',
    title: 'text-[#FFFFFF]',
    stamp: 'text-[#FFF4E6] border-[#F0A0A0]/60 bg-[#8F1919]',
    label: 'Eingriff',
    pinColor: 'bg-[#FAF4E6] border-[#781212]',
  },
  destroyed: {
    card: 'bg-[#D6D2CA]/90 border-[#9F9A90] border-dashed shadow-[1px_2px_4px_rgba(45,28,10,0.1)] opacity-85',
    iconColor: 'text-[#6A665E]',
    title: 'text-[#615D56] line-through decoration-[#7A756D]/65',
    stamp: 'text-[#615D56] border-[#ABA69C] bg-[#C8C4BC]',
    label: 'Zerstört',
    pinColor: 'bg-[#8E8980] border-[#5E5A52]',
  },
};

export function InstitutionsMap({
  centerEvent,
  isOverview,
}: InstitutionsMapProps) {
  const institutionById = new Map(INSTITUTIONS.map((inst) => [inst.id, inst]));

  const activeNewOrgansCount = Object.keys(centerEvent.newOrgans).length;

  return (
    <motion.div
      initial={false}
      animate={{
        scale: isOverview ? 0.64 : 1,
        y: isOverview ? 16 : 0,
        rotate: isOverview ? -0.9 : 0,
      }}
      transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: 'bottom center' }}
      aria-label="Pinwand: Zustand der Institutionen und neue NS-Organe"
      className="pointer-events-none absolute inset-x-3 sm:inset-x-6 top-[182px] sm:top-[200px] bottom-2.5 z-[5] flex flex-col justify-end"
    >
      {/* Pinned Paper Sheet Backdrop on the Cork Pinboard */}
      <div className="relative w-full max-w-[580px] xl:max-w-[740px] mx-auto notepaper-sheet border border-[#A69274] shadow-[4px_12px_28px_-6px_rgba(38,20,6,0.45)] px-3 sm:px-5 pt-3 pb-2.5">
        {/* Corner Masking Tape & Red Pinboard Tacks */}
        <span
          aria-hidden="true"
          className="masking-tape w-11 h-3 -rotate-12 absolute -top-1.5 -left-2.5"
        />
        <span
          aria-hidden="true"
          className="masking-tape w-11 h-3 rotate-12 absolute -top-1.5 -right-2.5"
        />
        <span
          aria-hidden="true"
          className="absolute top-1.5 left-2.5 w-2.5 h-2.5 rounded-full bg-[#9E2424] border border-[#681212] shadow-[1px_2px_3px_rgba(38,20,6,0.45)]"
        />
        <span
          aria-hidden="true"
          className="absolute top-1.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#9E2424] border border-[#681212] shadow-[1px_2px_3px_rgba(38,20,6,0.45)]"
        />

        {/* Header Strip: Centered Date & Summary Note */}
        <div className="relative z-10 pb-2 mb-2.5 pl-4 pr-4 border-b border-[#C6B8A1]">
          <span className="block font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-[#9E2424] font-semibold">
            Institutionen · {centerEvent.dateLabel}
          </span>
          <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-[#173668] leading-snug truncate">
            {centerEvent.institutionNote}
          </p>
        </div>

        {/* Weimar & Societal Institutions */}
        <div className="relative">
          <div className="relative z-10 space-y-2">
            {TIERS.map((tier, tierIdx) => (
              <div key={tierIdx} className="grid grid-cols-3 gap-2 sm:gap-3">
                {tier.map((id, colIdx) => {
                  const inst = institutionById.get(id);
                  if (!inst) return null;
                  const status = centerEvent.institutionStates[id];
                  const style = STATUS_STYLE[status];
                  const Icon = INSTITUTION_ICONS[id];
                  const tilt = CARD_TILTS[(tierIdx * 3 + colIdx) % CARD_TILTS.length];

                  return (
                    <motion.div
                      key={id}
                      animate={{
                        scale: status === 'attacked' ? 1.025 : 1,
                      }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className={`relative border px-2 sm:px-2.5 py-1.5 flex items-center justify-between gap-1.5 transition-colors duration-300 ${tilt} ${style.card}`}
                    >
                      {/* Miniature Pushpin on Each Card */}
                      <span
                        aria-hidden="true"
                        className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border shadow-xs ${style.pinColor}`}
                      />

                      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                        <Icon
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors duration-300 ${style.iconColor}`}
                        />
                        <p
                          className={`text-[10px] sm:text-xs font-serif font-semibold leading-tight truncate transition-colors duration-300 ${style.title}`}
                        >
                          <span className="hidden xl:inline">{inst.label}</span>
                          <span className="xl:hidden">{inst.shortLabel}</span>
                        </p>
                      </div>

                      <span
                        className={`hidden sm:inline-block shrink-0 px-1 py-0.5 text-[9px] font-mono uppercase tracking-wider border transition-colors duration-300 ${style.stamp}`}
                      >
                        {style.label}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* New NS Organs Added Over Time ("Neue NS-Organe") */}
        <div className="relative z-10 mt-2.5 pt-2 border-t border-dashed border-[#B29E7F]">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#9E2424] font-semibold">
              <Plus className="w-3 h-3" />
              <span>Neu geschaffene NS-Organe</span>
            </span>
            <span className="font-mono text-[10px] text-[#2C4E84] tabular-nums">
              {activeNewOrgansCount} von {NEW_ORGANS.length} eingerichtet
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
            {NEW_ORGANS.map((organ, idx) => {
              const status = centerEvent.newOrgans[organ.id];
              const Icon = NEW_ORGAN_ICONS[organ.id];
              const tilt = idx % 2 === 0 ? '-rotate-[0.6deg]' : 'rotate-[0.6deg]';

              if (!status) {
                return (
                  <div
                    key={organ.id}
                    className="border border-dashed border-[#BFB096] bg-[#EAE1CF]/45 px-2 py-1 flex items-center justify-between gap-1 opacity-55"
                  >
                    <span className="text-[10px] font-mono text-[#6F6351] truncate">
                      {organ.shortLabel}
                    </span>
                    <span className="text-[9px] font-mono text-[#8A7B64] shrink-0">
                      {organ.foundedLabel}
                    </span>
                  </div>
                );
              }

              const isJustCreated = status === 'created';

              return (
                <motion.div
                  key={organ.id}
                  initial={{ opacity: 0, y: -8, scale: 0.92 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: isJustCreated ? 1.03 : 1,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 22,
                  }}
                  className={`relative border px-2 py-1 flex items-center justify-between gap-1 ${tilt} ${
                    isJustCreated
                      ? 'bg-[#9E2424] border-[#641010] text-[#FAF4E6] shadow-[2px_4px_12px_rgba(158,36,36,0.4)]'
                      : 'bg-[#EFE0CA] border-[#9E2424] text-[#173668] shadow-[1px_3px_6px_rgba(45,28,10,0.16)]'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border ${
                      isJustCreated
                        ? 'bg-[#FAF4E6] border-[#641010]'
                        : 'bg-[#9E2424] border-[#641010]'
                    }`}
                  />
                  <div className="flex items-center gap-1 min-w-0">
                    <Icon
                      className={`w-3 h-3 shrink-0 ${
                        isJustCreated ? 'text-[#FAF4E6]' : 'text-[#9E2424]'
                      }`}
                    />
                    <span className="text-[10px] font-serif font-semibold truncate">
                      {organ.shortLabel}
                    </span>
                  </div>
                  <span
                    className={`text-[8px] font-mono uppercase tracking-wider px-1 border shrink-0 ${
                      isJustCreated
                        ? 'border-[#FAF4E6]/50 bg-[#781515] text-[#FAF4E6]'
                        : 'border-[#9E2424]/40 bg-[#FAF4E6]/70 text-[#9E2424]'
                    }`}
                  >
                    {isJustCreated ? 'Neu' : 'Aktiv'}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
