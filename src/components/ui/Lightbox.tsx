'use client';

import { Modal } from './Modal';

interface LightboxProps {
  open: boolean;
  onClose(): void;
  /** The YouTube video id (11 characters). */
  videoId: string;
  /** Names the dialog and the player for screen readers. */
  title: string;
}

/**
 * The trailer player (doc/SPEC.md, section 6), on the shared Modal. The youtube-nocookie iframe
 * exists only while the lightbox is open, so closing it stops playback.
 */
export function Lightbox({ open, onClose, videoId, title }: LightboxProps) {
  return (
    <Modal open={open} onClose={onClose} label={title} variant="lightbox">
      <div className="grid min-h-full place-items-center p-4 md:p-16">
        <div className="aspect-video w-full max-w-[1280px] bg-black">
          {open ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`}
              title={title}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              className="size-full"
            />
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
