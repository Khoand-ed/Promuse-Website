import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { hasFile, type Slot } from '@/content/images';

interface ImageSlotProps {
  slot: Slot;
  sizes: string;
  className?: string;
  /** Only for the image that is the largest paint above the fold. */
  preload?: boolean;
}

/**
 * The image a content slot declares. Until the owner adds the file, a box with the same aspect
 * ratio shows the file name and size it needs (doc/SPEC.md, section 6).
 */
export async function ImageSlot({ slot, sizes, className = '', preload }: ImageSlotProps) {
  const t = await getTranslations();

  if (hasFile(slot)) {
    return (
      <Image
        src={slot.src}
        width={slot.width}
        height={slot.height}
        alt={t(slot.alt as Parameters<typeof t>[0])}
        sizes={sizes}
        preload={preload}
        className={`h-auto w-full ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`image-slot w-full ${className}`}
      style={{ aspectRatio: `${slot.width} / ${slot.height}` }}
    >
      <span>
        {t('common.imagePlaceholder', {
          name: slot.src.split('/').pop() ?? slot.src,
          width: slot.width,
          height: slot.height,
        })}
      </span>
    </div>
  );
}
