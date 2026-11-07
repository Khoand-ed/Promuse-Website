'use client';

import { ArrowRight } from './icons';
import { Modal, useHashModal } from './Modal';
import { Tabs, type TabItem } from './Tabs';

interface DetailModalProps {
  /** The hash that opens it: `/#features-detail`. */
  hash: string;
  /** Names the tabs and the remembered tab (`promuse:tab:<tabs>`). */
  tabs: string;
  /** The pill on the page. */
  buttonLabel: string;
  /** Names the modal and its tab list for screen readers. */
  label: string;
  items: TabItem[];
  /** The small "Scroll" cue at the foot, from 1024 px. */
  scrollLabel: string;
}

/**
 * A section's "See details" pill and its modal, as on p3re.jp's Features modal (doc/SPEC.md,
 * section 5): a full sheet with the tabs down the left (a row on phones), the panel beside them, and
 * a pale wave at the foot. The wheel moves between tabs on a desktop; Esc and Back close it.
 */
export function DetailModal({
  hash,
  tabs,
  buttonLabel,
  label,
  items,
  scrollLabel,
}: DetailModalProps) {
  const { open, show, hide } = useHashModal(hash);

  return (
    <>
      <button type="button" data-beat onClick={show} className="pill pill-xl">
        {buttonLabel}
        <ArrowRight className="shrink-0" />
      </button>
      <Modal open={open} onClose={hide} label={label} variant="sheet">
        <div className="detail">
          <svg
            aria-hidden="true"
            viewBox="0 0 1440 120"
            preserveAspectRatio="none"
            className="detail-wave"
          >
            <path d="M0 64C240 16 480 16 720 56s480 72 720 8V120H0Z" fill="currentColor" />
          </svg>
          <Tabs id={tabs} label={label} items={items} wheel className="detail-tabs" />
          <p aria-hidden="true" className="detail-scroll type-label">
            {scrollLabel}
          </p>
        </div>
      </Modal>
    </>
  );
}
