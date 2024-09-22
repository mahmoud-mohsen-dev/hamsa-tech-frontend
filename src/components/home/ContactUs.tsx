import { Link } from '@/navigation';
import { ContactUsSectionType } from '@/types/getHomePageTypes';
import { useLocale } from 'next-intl';
import { FaWhatsapp } from 'react-icons/fa6';

interface PropsType {
  data: ContactUsSectionType;
}

function ContactUs({ data }: PropsType) {
  const locale = useLocale();

  return (
    <div className='max-w-[1900px]'>
      <div
        data-aos={locale === 'ar' ? 'fade-left' : 'fade-right'}
        data-aos-delay='150'
        data-aos-duration='300'
        data-aos-easing='linear'
        data-aos-once='true'
        className='bg-black-accent py-[30px]'
      >
        <section className='container'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <h3 className='text-lg font-medium text-white'>
              {data?.heading ?? ''}
            </h3>
            <Link
              href={data?.button_url ?? '/'}
              className='flex items-center gap-3 rounded bg-red-shade-300 px-7 py-4 text-sm uppercase text-white transition-all duration-300 hover:bg-yellow-medium hover:text-white focus:outline-none'
            >
              <span className='font-semibold'>
                {data?.button_text}
              </span>
              <FaWhatsapp size={24} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContactUs;
