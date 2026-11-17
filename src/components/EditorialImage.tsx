import { useState } from 'react';
import { Sprout } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export function EditorialImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
}: EditorialImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#EAE9DF] text-[#173D32] border border-[#202722]/10 p-6 text-center ${className}`}
      >
        <Sprout className="w-8 h-8 mb-3 text-[#2E7055]" strokeWidth={1.5} aria-hidden="true" />
        <p className="text-sm font-medium max-w-xs text-[#202722]/80">{alt}</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
