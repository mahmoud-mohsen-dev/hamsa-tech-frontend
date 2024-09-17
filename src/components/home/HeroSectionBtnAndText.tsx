import { getLangDir } from 'rtl-detect';
import Btn from '../UI/Btn';
import { useLocale } from 'next-intl';

function HeroSectionBtnAndText({
  heading,
  subHeading,
  btnText,
  isAnimationIsOn,
  href = '/',
  dir = 'left'
}: {
  heading: string;
  subHeading: string;
  btnText: string;
  isAnimationIsOn: boolean;
  href: string;
  dir: 'left' | 'right';
}) {
  return (
    <div
      className={`absolute ${dir === 'left' ? 'left-[65px] lg:left-[130px]' : 'right-[65px] lg:right-[130px]'} top-1/2 z-10 flex -translate-y-[50px] flex-col ${dir === 'left' ? 'items-start' : 'items-end'} gap-1 font-openSans md:-translate-y-1/2 md:gap-4 lg:-translate-y-1/2`}
      // dir={dir === 'left' ? 'lfr' : 'rtl'}
    >
      {isAnimationIsOn && (
        <h1
          // className='text-8xl font-semibold leading-[3.5rem] shadow-black text-shadow-sm'
          className='text-shadow-sm text-[clamp(1.5rem,6.25vw,6rem)] font-semibold leading-none shadow-gray-light'
          // className='text-3xl font-semibold shadow-gray-light text-shadow-sm xs:text-3xl md:text-5xl 2xl:text-8xl'
          data-aos='fade-up'
          // data-aos-offset='0'
          data-aos-delay='200'
          data-aos-duration='1000'
          // // data-aos-easing='ease-in-out'
          // // data-aos-mirror='true'
          // data-aos-once='false'
          // data-aos-anchor-placement='top-center'
        >
          {heading}
        </h1>
      )}
      {isAnimationIsOn && (
        <h3
          className='text-shadow-sm text-[clamp(1.5rem,6.25vw,6rem)] font-semibold leading-none text-blue-dark shadow-gray-light'
          data-aos={dir === 'left' ? 'fade-right' : 'fade-left'}
          // data-aos-offset='0'
          data-aos-delay='500'
          data-aos-duration='500'
        >
          {subHeading}
        </h3>
      )}
      {isAnimationIsOn && (
        <div
          data-aos='fade-up'
          // data-aos-offset='0'
          data-aos-delay='1000'
          data-aos-duration='500'
        >
          <Btn
            href={href}
            className='relative mt-2 bg-red-shade-350 px-4 py-[.5rem] text-base font-semibold capitalize text-white hover:bg-yellow-medium hover:text-black-light md:mt-[24px] md:px-10 md:py-4 md:text-xl'
            // dataAos='fade-down'
            // dataAosDelay='10000'
            // dataAosDuration='500'
          >
            {btnText}
          </Btn>
        </div>
      )}
    </div>
  );
}

export default HeroSectionBtnAndText;
