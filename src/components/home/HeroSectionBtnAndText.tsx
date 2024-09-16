import Btn from '../UI/Btn';

function HeroSectionBtnAndText({
  heading,
  subHeading,
  btnText,
  isAnimationIsOn
}: {
  heading: string;
  subHeading: string;
  btnText: string;
  isAnimationIsOn: boolean;
}) {
  return (
    <div className='absolute left-[65px] top-1/2 z-10 flex -translate-y-[50px] flex-col items-start gap-1 font-openSans md:-translate-y-1/2 md:gap-4 lg:left-[130px] lg:-translate-y-1/2'>
      {isAnimationIsOn && (
        <h1
          // className='text-8xl font-semibold leading-[3.5rem] shadow-black text-shadow-sm'
          className='text-[clamp(1.5rem,6.25vw,6rem)] font-semibold leading-none shadow-gray-light text-shadow-sm'
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
          className='text-[clamp(1.5rem,6.25vw,6rem)] font-semibold leading-none text-blue-dark shadow-gray-light text-shadow-sm'
          data-aos='fade-right'
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
            className='relative mt-2 bg-red-shade-350 px-4 py-[.5rem] text-base font-semibold capitalize text-white hover:bg-yellow-medium md:mt-[24px] md:px-10 md:py-4 md:text-xl'
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
