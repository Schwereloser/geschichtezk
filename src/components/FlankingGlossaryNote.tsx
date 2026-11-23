import { AnimatePresence, motion } from 'motion/react';
import { BookOpen } from 'lucide-react';
import { ContextualGlossaryNote } from '../data/timelineData';

interface FlankingGlossaryNoteProps {
  note: ContextualGlossaryNote | null;
  side: 'left' | 'right';
  onSelect: (note: ContextualGlossaryNote) => void;
}

export function FlankingGlossaryNote({
  note,
  side,
  onSelect,
}: FlankingGlossaryNoteProps) {
  const fallRotationDelta =
    note?.fastener === 'pin'
      ? side === 'left'
        ? -14
        : 14
      : side === 'left'
      ? 12
      : -12;

  return (
    <AnimatePresence mode="wait">
      {note && (
        <motion.div
          key={note.id}
          initial={{
            opacity: 0,
            x: note.offsetX,
            y: note.offsetY - 22,
            rotate: note.tiltDeg + (side === 'left' ? -6 : 6),
            scale: 1.05,
          }}
          animate={{
            opacity: 1,
            x: note.offsetX,
            y: note.offsetY,
            rotate: note.tiltDeg,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 240,
              damping: 20,
              mass: 0.82,
            },
          }}
          exit={{
            opacity: 0,
            y: note.offsetY + 95,
            rotate: note.tiltDeg + fallRotationDelta,
            scale: 0.92,
            transition: {
              duration: 0.32,
              delay: 0.06,
              ease: [0.45, 0, 0.85, 0.5],
            },
          }}
          className="relative pointer-events-auto"
        >
          {/* Fastener Layer: Red Pushpin or Masking Tape */}
          {note.fastener === 'pin' ? (
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, y: -14, scale: 1.45 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  delay: 0.14,
                  type: 'spring',
                  stiffness: 340,
                  damping: 20,
                },
              }}
              exit={{
                opacity: 0,
                y: -14,
                scale: 1.25,
                transition: { duration: 0.14, ease: 'easeOut' },
              }}
              className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-3.5 h-3.5 rounded-full bg-[#9E2424] border-2 border-[#681212] shadow-[1px_3px_5px_rgba(35,16,5,0.48)] flex items-center justify-center"
            >
              <span className="w-1 h-1 rounded-full bg-[#F5B7B7]/85 -translate-x-0.5 -translate-y-0.5" />
            </motion.span>
          ) : (
            <>
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0, scaleX: 0.25, y: -6 }}
                animate={{
                  opacity: 1,
                  scaleX: 1,
                  y: 0,
                  transition: { delay: 0.14, duration: 0.18, ease: 'easeOut' },
                }}
                exit={{
                  opacity: 0,
                  scaleX: 0.35,
                  y: -10,
                  transition: { duration: 0.14, ease: 'easeIn' },
                }}
                style={{ transformOrigin: 'left center' }}
                className="pointer-events-none masking-tape w-8 h-2 -rotate-12 absolute -top-1 -left-2 z-20"
              />
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0, scaleX: 0.25, y: -6 }}
                animate={{
                  opacity: 1,
                  scaleX: 1,
                  y: 0,
                  transition: { delay: 0.18, duration: 0.18, ease: 'easeOut' },
                }}
                exit={{
                  opacity: 0,
                  scaleX: 0.35,
                  y: -10,
                  transition: { duration: 0.14, ease: 'easeIn' },
                }}
                style={{ transformOrigin: 'right center' }}
                className="pointer-events-none masking-tape w-8 h-2 rotate-12 absolute -top-1 -right-2 z-20"
              />
            </>
          )}

          {/* Tactile Sticky-Note Card for Important Term */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(note);
            }}
            aria-label={`Begriff ${note.term} erklären`}
            className="block w-[114px] lg:w-[126px] xl:w-[156px] text-left bg-[#F3E7C2] hover:bg-[#F7ECCD] px-2.5 py-2 border border-[#BFA878] shadow-[4px_8px_16px_rgba(38,20,6,0.32)] hover:scale-[1.05] hover:-translate-y-1 hover:shadow-[6px_12px_22px_rgba(38,20,6,0.42)] transition-transform cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E2424]"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#9E2424] font-semibold">
                Begriff
              </span>
              <BookOpen className="w-3 h-3 text-[#2C4E84] shrink-0" />
            </div>
            <p className="mt-1 font-serif text-xs xl:text-[13px] font-bold text-[#173668] leading-snug break-words">
              {note.term}
            </p>
            <p className="mt-1 pt-1 border-t border-[#D6C498] font-mono text-[9px] text-[#2C4E84] leading-tight">
              Antippen für Erklärung →
            </p>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
