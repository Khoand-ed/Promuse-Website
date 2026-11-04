'use client';

import { useTranslations } from 'next-intl';
import { useState, type ReactNode } from 'react';
import {
  CoverReveal,
  GrowLine,
  OutlineWord,
  Reveal,
  RiseLetters,
  RiseLines,
  SplitLabel,
  TitleZoom,
} from '@/components/motion/reveal';
import { useMotion } from '@/components/motion/MotionProvider';
import { ArrowRight } from '@/components/ui/icons';
import { MotionToggle } from '@/components/ui/MotionToggle';

// A development page, so its own labels are plain Vietnamese; the samples come from content/.

function Demo({
  name,
  timing,
  children,
  tone = 'bg-sky',
}: {
  name: string;
  timing: string;
  children: ReactNode;
  tone?: string;
}) {
  return (
    <section
      className={`${tone} grid min-h-[80svh] content-center gap-10 overflow-hidden px-[6.7%] py-24`}
    >
      <p className="type-label text-[11px] tracking-[0.12em]">
        {name} · <span className="font-sans tracking-normal normal-case">{timing}</span>
      </p>
      {children}
    </section>
  );
}

export function MotionLab() {
  const t = useTranslations();
  const { enabled } = useMotion();
  const [run, setRun] = useState(0);

  return (
    <main>
      <div className="border-rule sticky top-0 z-30 flex flex-wrap items-center gap-6 border-b bg-white/90 py-3 pr-[6.7%] pl-20 backdrop-blur md:pl-24">
        <strong className="type-label text-[12px]">/dev/motion</strong>
        <MotionToggle />
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
            setRun((value) => value + 1);
          }}
          className="pill min-h-11 px-5 text-[14px]"
        >
          Phát lại
        </button>
        <span className="text-[13px]">
          Hiệu ứng đang {enabled ? 'bật' : 'tắt'}. Cuộn xuống để xem từng hiệu ứng; nút trên cùng
          chạy lại từ đầu.
        </span>
      </div>

      <div key={run}>
        <Demo name="RiseLetters" timing="từng chữ cái trồi 80 px, 1 s ease-out, cách nhau 0,05 s">
          <RiseLetters className="type-display text-[3.25rem] md:text-[5.25rem]">
            {t('features.title')}
          </RiseLetters>
        </Demo>

        <Demo
          name="RiseLines"
          timing="từng dòng trượt lên khỏi khe che, 1 s ease-out"
          tone="bg-white"
        >
          <RiseLines className="type-body max-w-[36rem]">{t('story.p1')}</RiseLines>
          <RiseLines className="type-body max-w-[36rem]">{t('privacy.why')}</RiseLines>
        </Demo>

        <Demo
          name="RiseLines + GrowLine (khẩu hiệu)"
          timing="vạch dài ra 1 s; ba dòng ở 0,5 / 0,8 / 1,1 s"
        >
          <div className="text-center">
            <GrowLine className="bg-ink mx-auto h-[50px] w-px" />
            <RiseLines
              delay={0.5}
              stagger={0.3}
              className="mt-5 text-[12px] leading-[24px] tracking-[0.8px]"
            >
              <span className="block">{t('story.band1')}</span>
              <span className="block">{t('story.band2')}</span>
              <span className="block">{t('story.band3')}</span>
            </RiseLines>
          </div>
        </Demo>

        <Demo
          name="CoverReveal"
          timing="lớp che rút từ dưới lên 0,5 s sau 0,2 s, ảnh hiện dần 0,5 s"
          tone="bg-white"
        >
          <CoverReveal className="image-slot aspect-video w-full max-w-[750px]">
            <span>
              {t('common.imagePlaceholder', { name: 'story.webp', width: 1600, height: 900 })}
            </span>
          </CoverReveal>
        </Demo>

        <Demo
          name="TitleZoom + Reveal"
          timing="tiêu đề chờ ở 70%, rồi lớn dần trong 1,5 s; nút trồi lên sau 0,4 s"
          tone="bg-white"
        >
          <div className="text-center">
            <TitleZoom className="type-display text-[3.4rem] md:text-[6.25rem]">
              {t('reward.title')}
            </TitleZoom>
            <Reveal delay={0.4} className="mt-12">
              <button type="button" data-beat className="pill pill-xl">
                {t('reward.states.signedOut')}
                <ArrowRight />
              </button>
            </Reveal>
            <p className="mt-4 text-[13px]">
              Nút này có data-beat: nó &quot;đập&quot; nhẹ theo nhịp khi hiệu ứng bật.
            </p>
          </div>
        </Demo>

        <Demo name="OutlineWord" timing="từng chữ cái hiện dần 0,5 s, cách nhau 0,12 s">
          <OutlineWord className="outline-word type-display -mx-[6.7vw] text-center text-[21.4vw] leading-[0.74] whitespace-nowrap uppercase">
            {t('common.brand')}
          </OutlineWord>
        </Demo>

        <Demo
          name="Reveal (from right) + RiseLines"
          timing="thẻ trượt vào từ 30 px bên phải, 1 s; ba dòng cách nhau 0,3 s"
          tone="bg-azure"
        >
          <RiseLines
            stagger={0.3}
            className="grid gap-2 text-[16px] leading-[2.1] tracking-[0.8px]"
          >
            <span className="block">{t('characters.line1')}</span>
            <span className="block">{t('characters.line2')}</span>
            <span className="block">{t('characters.line3')}</span>
          </RiseLines>
          <Reveal from="right" duration={1} className="image-slot aspect-[3/4] w-[min(18rem,60vw)]">
            <span>
              {t('common.imagePlaceholder', { name: 'card.webp', width: 600, height: 800 })}
            </span>
          </Reveal>
        </Demo>

        <Demo
          name="SplitLabel + Reveal + GrowLine (footer)"
          timing="chữ trượt lên 1 s; danh sách trồi lên 1 s; vạch kẻ dài ra 1 s"
          tone="bg-white"
        >
          <SplitLabel className="type-label text-[16px] font-bold tracking-[0.12em]">
            {t('footer.specHeading')}
          </SplitLabel>
          <Reveal duration={1} className="text-[14px] leading-[21px]">
            <p>
              {t('footer.spec.titleLabel')} — {t('footer.spec.titleValue')}
            </p>
            <p>
              {t('footer.spec.genreLabel')} — {t('footer.spec.genreValue')}
            </p>
          </Reveal>
          <GrowLine axis="x" className="bg-rule h-px w-full" />
        </Demo>

        <Demo
          name="Nhịp (BeatClock) và vạch SCROLL"
          timing="bấm nút nốt nhạc ở góc trên bên trái: tiếng gõ nhịp phát, nốt xoay, các nút đập theo phách; vạch nhỏ giọt mỗi 3 nhịp"
          tone="hero-fallback"
        >
          <div className="grid justify-items-center gap-3 text-white">
            <span className="type-label text-[10px]">{t('hero.scroll')}</span>
            <span className="scroll-cue" />
          </div>
        </Demo>
      </div>
    </main>
  );
}
