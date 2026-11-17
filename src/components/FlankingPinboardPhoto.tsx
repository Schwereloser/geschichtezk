import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ContextualBoardPhoto } from '../data/timelineData';

interface FlankingPinboardPhotoProps {
  photo: ContextualBoardPhoto | null;
  side: 'left' | 'right';
  onSelect: (photo: ContextualBoardPhoto) => void;
}

export function FlankingPinboardPhoto({
  photo,
  side,
  onSelect,
}: FlankingPinboardPhotoProps) {
  const [imgSrc, setImgSrc] = useState(photo?.src ?? '');

  useEffect(() => {
    setImgSrc(photo?.src ?? '');
  }, [photo?.id, photo?.src]);

  const fallRotationDelta =
    photo?.fastener === 'pin'
      ? side === 'left'
        ? -15
        : 15
      : side === 'left'
      ? 13
      : -13;

  return (
    <AnimatePresence mode="wait">
      {photo && (
        <motion.div
          key={photo.id}
          initial={{
            opacity: 0,
            x: photo.offsetX,
            y: -34,
            rotate: photo.tiltDeg + (side === 'left' ? -7 : 7),
            scale: 1.06,
          }}
          animate={{
            opacity: 1,
            x: photo.offsetX,
            y: photo.offsetY,
            rotate: photo.tiltDeg,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 230,
              damping: 20,
              mass: 0.85,
            },
          }}
          exit={{
            opacity: 0,
            y: 135,
            rotate: photo.tiltDeg + fallRotationDelta,
            scale: 0.93,
            transition: {
              duration: 0.36,
              delay: 0.1,
              ease: [0.45, 0, 0.85, 0.5],
            },
          }}
          className="relative pointer-events-auto"
        >
          {/* Fastener Animation Layer: Red Pushpin OR Masking Tape Strips */}
          {photo.fastener === 'pin' ? (
            <motion.span
              aria-hidden="true"
              initial={{ opacity: 0, y: -18, scale: 1.55 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  delay: 0.16,
                  type: 'spring',
                  stiffness: 340,
                  damping: 20,
                },
              }}
              exit={{
                opacity: 0,
                y: -16,
                scale: 1.35,
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
                  transition: { delay: 0.16, duration: 0.2, ease: 'easeOut' },
                }}
                exit={{
                  opacity: 0,
                  scaleX: 0.35,
                  y: -10,
                  transition: { duration: 0.14, ease: 'easeIn' },
                }}
                style={{ transformOrigin: 'left center' }}
                className="pointer-events-none masking-tape w-9 h-2.5 -rotate-12 absolute -top-1.5 -left-2 z-20"
              />
              <motion.span
                aria-hidden="true"
                initial={{ opacity: 0, scaleX: 0.25, y: -6 }}
                animate={{
                  opacity: 1,
                  scaleX: 1,
                  y: 0,
                  transition: { delay: 0.2, duration: 0.2, ease: 'easeOut' },
                }}
                exit={{
                  opacity: 0,
                  scaleX: 0.35,
                  y: -10,
                  transition: { duration: 0.14, ease: 'easeIn' },
                }}
                style={{ transformOrigin: 'right center' }}
                className="pointer-events-none masking-tape w-9 h-2.5 rotate-12 absolute -top-1.5 -right-2 z-20"
              />
            </>
          )}

          {/* Clickable Photo Print (no subtitle until clicked) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(photo);
            }}
            aria-label={`Archivbild zu ${photo.dateLabel} vergrößern`}
            className="block w-[114px] lg:w-[126px] xl:w-[156px] bg-[#FAF6EC] p-1.5 border border-[#B8A58B] shadow-[4px_9px_18px_rgba(38,20,6,0.36)] hover:scale-[1.05] hover:-translate-y-1 hover:shadow-[6px_14px_24px_rgba(38,20,6,0.46)] transition-transform cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9E2424]"
          >
            <img
              src={imgSrc || photo.src}
              alt={photo.caption}
              referrerPolicy="no-referrer"
              onError={() => {
                if (photo.fallbackSrc && imgSrc !== photo.fallbackSrc) {
                  setImgSrc(photo.fallbackSrc);
                }
              }}
              className="w-full aspect-[4/3] object-cover sepia-[0.38] grayscale-[0.2] contrast-[1.06] border border-[#D4C7B2]"
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
