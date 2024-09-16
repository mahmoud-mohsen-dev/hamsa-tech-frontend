'use client';
import React from 'react';
import { EmblaOptionsType } from 'embla-carousel';
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from '././EmblaCarouselDotArrowButtons';
import useEmblaCarousel from 'embla-carousel-react';

type PropType = {
  slides: React.ReactNode[];
  options?: EmblaOptionsType;
};

const EmblaSlideToScroll: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  return (
    <section className='embla-slide-to-scroll container'>
      <div className='flex items-center justify-between gap-2 px-10'>
        <PrevButton
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
        />
        <div className='embla__viewport w-full' ref={emblaRef}>
          <div className='embla__container'>
            {slides.map((slide, index) => (
              <div className='embla__slide' key={index}>
                <div className='embla__slide__number'>{slide}</div>
              </div>
            ))}
          </div>
        </div>
        <NextButton
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
        />
      </div>
    </section>
  );
};

export default EmblaSlideToScroll;
