import { useState } from 'react';
import { Archive } from 'lucide-react';

interface ArchivalImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  aspectClassName?: string;
}

export function ArchivalImage({
  src,
  alt,
  caption,
  className = '',
  aspectClassName = 'aspect-[4/3]',
}: ArchivalImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <figure className={`m-0 ${className}`}>
      <div
        className={`relative overflow-hidden bg-[#EBE6DF] border border-[#D6CEBE] ${aspectClassName}`}
      >
        {!hasError ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover grayscale-[15%] contrast-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#EBE6DF] to-[#DFD8CC] text-[#57534E]">
            <Archive className="w-7 h-7 mb-2 opacity-60" strokeWidth={1.5} />
            <p className="text-xs font-serif italic max-w-xs">{alt}</p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="mt-2.5 text-xs font-serif italic text-[#57534E] leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
