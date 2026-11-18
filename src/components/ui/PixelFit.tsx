'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { pixelFit, type Size } from '@/lib/pixel';

interface PixelFitProps {
  /** The art's own size in pixels. */
  width: number;
  height: number;
  /** The image, drawn with `image-rendering: pixelated`. */
  children: ReactNode;
  className?: string;
}

/**
 * Pixel art in a box with the art's aspect ratio (doc/SPEC.md, section 11). The box takes the
 * place an ordinary image would; inside it, the art takes the largest size at which each of its
 * pixels covers a whole number of device pixels, and it follows resizes and zoom.
 */
export function PixelFit({ width, height, children, className = '' }: PixelFitProps) {
  const box = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState<Size | null>(null);

  useEffect(() => {
    const element = box.current;
    if (!element) return;
    let space: Size = { width: element.clientWidth, height: element.clientHeight };
    let zoom: MediaQueryList | undefined;
    const update = () => {
      const ratio = window.devicePixelRatio || 1;
      const fit = pixelFit(space, { width, height }, ratio);
      setSize({ width: fit.width, height: fit.height });
      // Zooming or moving to another screen changes the ratio without resizing the box.
      zoom?.removeEventListener('change', update);
      zoom = window.matchMedia(`(resolution: ${ratio}dppx)`);
      zoom.addEventListener('change', update);
    };
    const observer = new ResizeObserver(([entry]) => {
      if (entry) space = { width: entry.contentRect.width, height: entry.contentRect.height };
      update();
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
      zoom?.removeEventListener('change', update);
    };
  }, [width, height]);

  return (
    <span
      ref={box}
      className={`pixel-fit ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <span
        className="pixel-art"
        data-scale={size ? 'whole' : undefined}
        style={size ? { width: size.width, height: size.height } : undefined}
      >
        {children}
      </span>
    </span>
  );
}

interface PixelImageProps {
  src: string;
  /** The art's own size in pixels. */
  width: number;
  height: number;
  alt: string;
  id?: string;
  preload?: boolean;
  className?: string;
}

/**
 * Pixel art as the page draws it (AGENTS.md, UI rules): served as it is, never resampled by the
 * image optimiser, drawn with `image-rendering: pixelated` at a whole-number scale.
 */
export function PixelImage({ src, width, height, alt, id, preload, className }: PixelImageProps) {
  return (
    <PixelFit width={width} height={height} className={className}>
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        id={id}
        unoptimized
        preload={preload}
        className="pixelated block h-full w-full"
      />
    </PixelFit>
  );
}
