'use client';
import { Carousel } from 'antd';
// import Image from 'next/image';
import HeroSectionBtnAndText from './HeroSectionBtnAndText';
import ConfigAos from '../../lib/ConfigAos';
// import 'aos/dist/aos.css';
import { useState } from 'react';
import { HeroSectionType } from '@/types/getHomePageTypes';
// import { useTranslations } from 'next-intl';

interface PropsType {
  data: HeroSectionType[];
}

function HeroSection({ data }: PropsType) {
  const [isAnimationIsOn, setIsAnimationIsOn] = useState(true);
  const imageContainerStyles =
    'relative max-h-screen min-h-[400px] before:absolute before:left-0 before:top-0 before:h-full before:max-h-screen before:w-full before:bg-[#00000020] before:bg-blend-normal before:content-[""]';

  const handlebeforeChange = () => {
    setIsAnimationIsOn(false);
  };
  const handleAfterChange = () => {
    setIsAnimationIsOn(true);
  };

  return (
    <ConfigAos>
      <section>
        <Carousel
          arrows
          autoplay
          pauseOnHover={false}
          beforeChange={handlebeforeChange}
          afterChange={handleAfterChange}
          className='min-h-[400px] w-full bg-white-light text-center text-white lg:mx-auto lg:max-w-[1900px]'
        >
          {data.map((element) => {
            return (
              <div className={imageContainerStyles} key={element.id}>
                <img
                  src={element?.image?.data?.attributes?.url ?? ''}
                  alt={
                    element?.image?.data?.attributes
                      ?.alternativeText ?? ''
                  }
                  className='min-h-[400px] max-w-[100vw] object-cover md:min-h-fit md:object-contain'
                />
                <HeroSectionBtnAndText
                  heading={element.headingTop ?? ''}
                  subHeading={element.headingBottom ?? ''}
                  btnText={element.buttonLink.buttonText ?? ''}
                  href={element.buttonLink.button_slug ?? '/products'}
                  isAnimationIsOn={isAnimationIsOn}
                  dir={element.direction as 'left' | 'right'}
                />
              </div>
            );
          })}
          {/* <div className={imageContainerStyles} key='2'>
            <img
              src='/hero-section/ezviz-outdoor-camera.jpg'
              alt='ezviz camera'
              className='min-h-[400px] max-w-[100vw] object-cover md:min-h-fit md:object-contain'
            />
            <HeroSectionBtnAndText
              heading='24/7 control of '
              subHeading='your security.'
              btnText='Read More'
              href='/'
              isAnimationIsOn={isAnimationIsOn}
            />
          </div>
          <div className={imageContainerStyles} key='3'>
            <img
              src='/hero-section/ezviz-indoor-camera-2.jpg'
              alt='ezviz camera'
              className='min-h-[400px] max-w-[100vw] object-cover md:min-h-fit md:object-contain'
            />
            <HeroSectionBtnAndText
              heading='Every security'
              subHeading='solutions.'
              btnText='Read More'
              href='/'
              isAnimationIsOn={isAnimationIsOn}
            />
          </div> */}
        </Carousel>
      </section>
    </ConfigAos>
  );
}

export default HeroSection;
