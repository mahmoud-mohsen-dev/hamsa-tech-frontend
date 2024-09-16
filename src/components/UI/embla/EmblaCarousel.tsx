'use client';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  EmblaCarouselType,
  EmblaEventType,
  EmblaOptionsType
} from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselDotArrowButtons';
import { DotButton, useDotButton } from './EmblaCarouselDotButton';
import Autoplay from 'embla-carousel-autoplay';
import { Link } from '@/navigation';
// import { v4 } from 'uuid';

const TWEEN_FACTOR_BASE = 0.2;

type PropType = {
  slides: { title: string; details: string; imgSrc: string }[];
  options?: EmblaOptionsType;
  href?: string;
};

const EmblaCarousel: React.FC<PropType> = ({
  slides,
  options,
  href = '/'
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    Autoplay()
  ]);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);
  const container = useRef<HTMLDivElement | null>(null);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  const setTweenNodes = useCallback(
    (emblaApi: EmblaCarouselType): void => {
      tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
        return slideNode.querySelector(
          '.embla__parallax__layer'
        ) as HTMLElement;
      });
    },
    []
  );

  const setTweenFactor = useCallback(
    (emblaApi: EmblaCarouselType) => {
      tweenFactor.current =
        TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
    },
    []
  );

  const tweenParallax = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === 'scroll';

      emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex))
            return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const translate =
            diffToTarget * (-1 * tweenFactor.current) * 100;
          const tweenNode = tweenNodes.current[slideIndex];
          tweenNode.style.transform = `translateX(${translate}%)`;
        });
      });
    },
    []
  );

  // useEffect(() => {
  //   console.log(container.current?.clientWidth);
  // }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax)
      .on('slideFocus', tweenParallax);
  }, [emblaApi, tweenParallax]);

  return (
    <div className='embla container'>
      <div className='embla__viewport' ref={emblaRef}>
        <div className='embla__container' ref={container}>
          {slides.map((item, index) => (
            <div className='embla__slide overflow-hidden' key={index}>
              <Link href={href}>
                <div className='embla__parallax'>
                  <div className='embla__parallax__layer'>
                    {/* <Link href='/'> */}
                    <div className='embla_parralax_img_wrapper relative'>
                      {/* <div className='service-details absolute bottom-[-155px] h-[210px] w-full bg-gradient-to-t from-[#00000078] from-30% via-[#00000054] via-70% to-transparent to-100% text-white transition-all duration-300 ease-in'>
                        <div className='absolute right-[70px] top-0 max-w-[250px] py-5'> */}
                      <div className='service-details absolute bottom-[-195px] h-[260px] w-full bg-gradient-to-t from-[#00000078] from-30% via-[#00000054] via-70% to-transparent to-100% transition-all duration-300 ease-in'></div>
                      <img
                        className='embla__slide__img embla__parallax__img'
                        // src={`https://picsum.photos/600/350?v=${index}`}
                        src={`${item.imgSrc}`}
                        alt='Your alt text'
                      />
                    </div>
                    {/* </Link> */}
                  </div>
                </div>

                <div className='service-details absolute bottom-[-195px] right-[60px] max-w-[260px] py-5 text-white transition-all duration-300 ease-in'>
                  <h3 className='text-shadow-sm mb-3 text-[18px] font-bold leading-[28px]'>
                    {item.title}
                  </h3>

                  <p className='text-shadow-sm mb-3 break-words'>
                    {item.details}
                  </p>

                  <p className='text-shadow-sm'>Read More ⟶</p>
                </div>
                {/* <div className='relative text-white'></div> */}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className='embla__controls'>
        <div className='embla__buttons'>
          <PrevButton
            onClick={onPrevButtonClick}
            disabled={prevBtnDisabled}
          />
          <NextButton
            onClick={onNextButtonClick}
            disabled={nextBtnDisabled}
          />
        </div>

        <div className='embla__dots'>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`embla__dot ${index === selectedIndex ? 'embla__dot--selected' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
