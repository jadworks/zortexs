import { useState } from 'react';
import { Croissant } from 'lucide-react';

interface ProductImageProps {
  src: string;
  alt: string;
  title: string;
  className?: string;
}

export function ProductImage({ src, alt, title, className = '' }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 to-amber-50 text-stone-600 p-4 text-center ${className}`}
      >
        <Croissant className="w-8 h-8 mb-2 text-amber-800" aria-hidden="true" />
        <span className="text-xs font-medium text-stone-700 line-clamp-2">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
