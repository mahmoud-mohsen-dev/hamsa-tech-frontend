import { Link } from '@/navigation';

function AboutUs() {
  return (
    <section className='grid max-w-[1536px] grid-cols-1 bg-blue-sky-ultralight xl:grid-cols-2'>
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
          <h2 className='font-openSans text-2xl font-bold md:text-4xl md:leading-[calc(2.25rem*1.35)]'>
            From Small Brackets
            <br />
            to Advanced Access Control
            <br />
            and Security Solutions!
          </h2>
          <p className='mb-2'>
            Helping families live intelligently means we’re always
            working to bring our customers the latest technology. As
            one of the premier providers of smart home technology, we
            are recognized throughout the industry for our products,
            innovation & customer satisfaction.
          </p>

          <Link
            href={'/'}
            className='btn relative flex max-w-fit items-center justify-between gap-4 rounded bg-red-shade-350 px-9 py-6 text-[15px] leading-none text-white transition-all duration-300 ease-linear hover:bg-blue-gray-medium hover:text-white'
          >
            <span className='text-base font-bold'>Discover More</span>
            <i className='icomoon icon-arrow-right text-sm'></i>
          </Link>
        </div>
      </div>
      <div
        // data-aos='fade-left'
        // data-aos-delay='150'
        // data-aos-duration='400'
        data-aos='fade-down'
        data-aos-easing='linear'
        data-aos-duration='800'
        data-aos-delay='300'
        // data-aos-easing='ease-out'
        data-aos-once='true'
        className='flex items-center justify-end'
      >
        <div>
          <img
            src='/hikvision-dom-camera-original-3.png'
            alt='camera dom hikvision'
            className='mt-4 h-full max-h-[700px] md:mt-0'
          />
        </div>
      </div>
    </section>
  );
}

export default AboutUs;
