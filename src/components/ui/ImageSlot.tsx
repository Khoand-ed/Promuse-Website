import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { hasFile, type Slot } from '@/content/images';
import { PixelImage } from './PixelFit';

interface ImageSlotProps {
  slot: Slot;
  sizes: string;
  className?: string;
  /** Only for the image that is the largest paint above the fold. */
  preload?: boolean;
  /** Put on the image, so a control can point at its description. */
  id?: string;
}

/**
 * The image a content slot declares. Until the owner adds the file, a box with the same aspect
 * ratio shows the file name and size it needs (doc/SPEC.md, section 6). A slot marked `pixelated`
 * is pixel art and goes through PixelImage. Everything it renders is phrasing content, so a slot
 * may sit inside a button.
 */
export async function ImageSlot({ slot, sizes, className = '', preload, id }: ImageSlotProps) {
  const t = await getTranslations();

  if (hasFile(slot)) {
    const alt = t(slot.alt as Parameters<typeof t>[0]);
    if (slot.pixelated) {
      return (
        <PixelImage
          src={slot.src}
          width={slot.width}
          height={slot.height}
          alt={alt}
          id={id}
          preload={preload}
          className={className}
        />
      );
    }
    return (
      <Image
        src={slot.src}
        width={slot.width}
        height={slot.height}
        alt={alt}
        id={id}
        sizes={sizes}
        preload={preload}
        className={`h-auto w-full ${className}`}
      />
    );
  }

  return (
    <span
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
    </span>
  );
}
