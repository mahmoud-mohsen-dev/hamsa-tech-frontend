import { Link } from '@/navigation';
import { AboutUsSectionType } from '@/types/getHomePageTypes';
import { useLocale } from 'next-intl';
import {
  HiOutlineArrowNarrowLeft,
  HiOutlineArrowNarrowRight
} from 'react-icons/hi';
import { RiArrowRightUpLine } from 'react-icons/ri';
import { TbSquareRoundedArrowRightFilled } from 'react-icons/tb';

interface PropsType {
  data: AboutUsSectionType;
}

function AboutUs({ data }: PropsType) {
  const locale = useLocale();
  return (
    <section className='mx-auto grid max-w-[1900px] grid-cols-1 bg-blue-sky-ultralight xl:grid-cols-2'>
      <div
        data-aos='fade-down'
        data-aos-easing='linear'
        data-aos-duration='800'
        data-aos-delay='150'
        // data-aos-easing='ease-out'
        data-aos-once='true'
        className='h-full'
      >
        <div className='flex h-full flex-col items-start justify-center gap-7 p-4 text-black-medium md:p-20'>
          <h2 className='max-w-[450px] text-pretty font-openSans text-2xl font-bold md:text-4xl md:leading-[calc(2.25rem*1.35)]'>
            {data?.title ?? ''}
          </h2>
          <p className='mb-2 text-pretty text-xl'>
            {data?.description ?? ''}
          </p>

          <Link
            href={'/'}
            className='btn relative flex max-w-fit items-center justify-between gap-4 rounded bg-red-shade-350 px-9 py-6 text-[15px] leading-none text-white transition-all duration-300 ease-linear hover:bg-blue-gray-medium hover:text-white'
          >
            <span className='text-base font-bold'>
              {data?.button_text ?? ''}
            </span>
            {locale === 'ar' ?
              <HiOutlineArrowNarrowLeft size={28} />
            : <HiOutlineArrowNarrowRight size={28} />}
            {/* <i className='icomoon icon-arrow-right text-sm'></i> */}
          </Link>
        </div>
      </div>
      <div
        data-aos='fade-down'
        data-aos-easing='linear'
        data-aos-duration='800'
        data-aos-delay='300'
        data-aos-once='true'
        className='flex items-center justify-end'
      >
        <div>
          <img
            src={data?.image?.data?.attributes?.url ?? ''}
            alt={data?.image?.data?.attributes?.alternativeText ?? ''}
            className='mt-4 h-full max-h-[700px] md:mt-0'
          />
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
