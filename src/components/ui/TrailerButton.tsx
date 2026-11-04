'use client';

import { Lightbox } from './Lightbox';
import { useHashModal } from './Modal';
import { ArrowRight } from './icons';

/** "Watch trailer" and its lightbox; `/#trailer` opens it directly. */
export function TrailerButton({ videoId, label }: { videoId: string; label: string }) {
  const { open, show, hide } = useHashModal('trailer');

  return (
    <>
      <button type="button" onClick={show} className="trailer-button type-label">
        <span aria-hidden="true" className="trailer-play">
          <ArrowRight />
        </span>
        {label}
      </button>
      <Lightbox open={open} onClose={hide} videoId={videoId} title={label} />
    </>
  );
}
