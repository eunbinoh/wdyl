'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export default function WdylPromoSection() {
  const slides = useMemo(
    () => [
      {
        src: '/promo_img/pro_create.png',
        tag: 'TICKET',
        title: '내친구 표현하는 티켓 만들기',
        desc: '애칭, 특징을 살려서 친구잘알 티켓을 만들어요',
      },
      {
        src: '/promo_img/pro_theme1.png',
        tag: 'CONCEPT',
        title: '내 취향대로 컨셉 선택',
        desc: '5가지 컬러, 다른 분위기로 선택할 수 있어요',
      },
      {
        src: '/promo_img/pro_theme3.png',
        tag: 'TRENDY',
        title: '일상부터 취향저격 컨셉까지',
        desc: '정중 / 럭키비키 / 독특 / AI / 게임러버',
      },
      {
        src: '/promo_img/pro_ticket1.png',
        tag: 'SURVEY',
        title: '심리테스트 같은 취향 설문지',
        desc: '티켓 링크를 받은 친구가 응답을 시작해요',
      },
      {
        src: '/promo_img/pro_ticket2.png',
        tag: 'STEP 1',
        title: '카테고리 선택',
        desc: '친구의 관심사를 10가지 선택지로 줄여줘요',
      },
      {
        src: '/promo_img/pro_ticket3.png',
        tag: 'STEP 2',
        title: '취향 토너먼트',
        desc: '1:1 라운드들을 통해 최종 후보 3개를 선정해요',
      },
      {
        src: '/promo_img/pro_ticket6.png',
        tag: 'PICK',
        title: '세부 항목 랭킹화',
        desc: '1가지 픽 아래 TOP3 순위를 알 수 있어요',
      },
      {
        src: '/promo_img/pro_ticket7.png',
        tag: 'INSIGHT',
        title: '취향 분석 완료',
        desc: '추천템, 순위 결과에 특징을 반영해서 보여줘요',
      },
      {
        src: '/promo_img/pro_mypage2.png',
        tag: 'RECOMMEND',
        title: '결과 확인 & 구매링크 추천',
        desc: '취향 순위를 확인하고, 추천 링크를 통해 구매할 수 있어요',
      },
    ],
    []
  );
  const widthFitImageSources = useMemo(() => new Set(['/promo_img/pro_create.png']), []);
  const [current, setCurrent] = useState(0);
  const [landscapeImageSources, setLandscapeImageSources] = useState<Record<string, boolean>>({});
  const dragStartX = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const moveSlide = useCallback((direction: number) => {
    setCurrent((prev) => (prev + direction + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      moveSlide(1);
    }, current === slides.length - 1 ? 8000 : 3000);

    return () => clearTimeout(timer);
  }, [current, moveSlide, slides.length]);

  const finishDrag = useCallback(() => {
    if (dragStartX.current === null) {
      return;
    }

    const dragThreshold = 60;

    if (dragOffset > dragThreshold) {
      moveSlide(-1);
    }

    if (dragOffset < -dragThreshold) {
      moveSlide(1);
    }

    dragStartX.current = null;
    setDragOffset(0);
    setIsDragging(false);
  }, [dragOffset, moveSlide]);

  return (
    <section className="mx-auto w-full max-w-[460px] px-5 py-10">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-bold tracking-[0.25em] text-[#f4ad24]">
          HOW TO USE
        </p>
        <p className="mt-4 text-base font-medium text-[#7b8496]">
        🟡 티켓 생성 → 🟢 설문링크 응답 → 🔵 선물 추천
        </p>
      </div>

      <div
        className={`relative touch-pan-y select-none overflow-hidden rounded-[32px] border border-[#f1e8d8] bg-[#fffaf0] shadow-[0_18px_50px_rgba(180,130,45,0.16)] ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onPointerDown={(event) => {
          if ((event.target as HTMLElement).closest('button')) {
            return;
          }

          dragStartX.current = event.clientX;
          setDragOffset(0);
          setIsDragging(true);
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (dragStartX.current === null) {
            return;
          }

          setDragOffset(event.clientX - dragStartX.current);
        }}
        onPointerUp={(event) => {
          finishDrag();
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={finishDrag}
      >
        <div
          className={`flex ${
            isDragging ? '' : 'transition-transform duration-500 ease-out'
          }`}
          style={{ transform: `translateX(calc(-${current * 100}% + ${dragOffset}px))` }}
        >
          {slides.map((slide) => (
            <article
              key={`${slide.tag}-${slide.src}`}
              className="grid min-w-full items-center gap-2 p-6"
            >
              <div>
                <span className="inline-flex rounded-full bg-[#fff2d6] px-3 py-1 text-sm font-black text-[#f4a800]">
                  {slide.tag}
                </span>
                <h3 className="mt-4 ml-2 text-xl font-black leading-tight text-[#222]">
                  {slide.title}
                </h3>
                <p className="mt-2 ml-2 text-[14px] font-semibold leading-relaxed text-[#6f7890]">
                  {slide.desc}
                </p>
              </div>

              <div className="flex justify-center">
                <div
                  className={`h-[440px] w-full max-w-[280px] overflow-hidden rounded-[28px] border border-[#eee3d4] bg-white shadow-[0_14px_35px_rgba(0,0,0,0.14)] ${
                    widthFitImageSources.has(slide.src) || landscapeImageSources[slide.src]
                      ? 'flex items-center py-6'
                      : ''
                  }`}
                >
                  <img
                    src={slide.src}
                    alt={slide.title}
                    className={`w-full ${
                      widthFitImageSources.has(slide.src) || landscapeImageSources[slide.src]
                        ? 'h-auto object-contain object-center'
                        : 'h-full object-cover object-top'
                    }`}
                    onLoad={(event) => {
                      const isLandscape =
                        event.currentTarget.naturalWidth >
                        event.currentTarget.naturalHeight;

                      setLandscapeImageSources((prev) => {
                        if (prev[slide.src] === isLandscape) {
                          return prev;
                        }

                        return { ...prev, [slide.src]: isLandscape };
                      });
                    }}
                    draggable={false}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 px-6 pb-6">
          <button
            type="button"
            onClick={() => moveSlide(-1)}
            aria-label="이전"
            className="flex h-11 w-11 items-center justify-center rounded-full text-2xl font-black text-[#f4a800]"
          >
            ‹
          </button>

          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`${index + 1}번째 홍보 이미지 보기`}
                className={`h-2.5 rounded-full transition-all ${
                  current === index ? 'w-7 bg-[#f4ad24]' : 'w-2.5 bg-[#eadfcf]'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => moveSlide(1)}
            aria-label="다음"
            className="flex h-11 w-11 items-center justify-center rounded-full text-2xl font-black text-[#f4a800]"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
