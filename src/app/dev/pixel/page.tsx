import { notFound } from 'next/navigation';
import { PixelImage } from '@/components/ui/PixelFit';

// A development page, so its own labels are plain Vietnamese.

/** An 8 × 8 test pattern drawn for this page: navy and sky checks, a pink corner, a white dot. */
const SPRITE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAK0lEQVR42mP4M/n/fxCWtfD6f+DqCwyaAaYAmySIZsClE24CPsnBYAIIAADQhqmf9Bkw9wAAAAABJRU5ErkJggg==';

/** Boxes of awkward widths: the sprite must still land on whole device pixels in each. */
const BOXES = ['w-[37px]', 'w-[100px]', 'w-[33vw]', 'w-[61.3%]'];

/**
 * Pixel art at whole-number scales (doc/SPEC.md, section 11), checked before the owner's art
 * exists: PixelImage is what ImageSlot draws for a slot marked `pixelated`. 404 in production.
 */
export default function PixelPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return (
    <main className="grid gap-10 p-8">
      <p className="type-label text-[11px] tracking-[0.12em]">
        PixelImage · ảnh mẫu 8 × 8 · mỗi điểm ảnh phủ đúng một số nguyên điểm ảnh của màn hình
      </p>
      {BOXES.map((box) => (
        <div key={box} data-box className={`bg-mist ${box}`}>
          <PixelImage src={SPRITE} width={8} height={8} alt="" />
        </div>
      ))}
    </main>
  );
}
