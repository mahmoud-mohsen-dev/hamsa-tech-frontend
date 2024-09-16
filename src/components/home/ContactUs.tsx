import { Link } from '@/navigation';
import { FaWhatsapp } from 'react-icons/fa6';

function ContactUs() {
  return (
    <div
      data-aos='fade-right'
      data-aos-delay='150'
      data-aos-duration='300'
      data-aos-easing='linear'
      data-aos-once='true'
      className='bg-black-accent py-[30px]'
    >
      <section className='container'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <h3 className='text-lg font-medium text-white'>
            Let’s work together to build something great.
          </h3>
          <Link
            href={'/'}
            className='flex items-center gap-3 rounded bg-red-shade-300 px-7 py-4 text-sm uppercase text-white transition-all duration-300 hover:bg-yellow-medium hover:text-white focus:outline-none'
          >
            <span className='font-semibold'>Contact US</span>
            <FaWhatsapp size={24} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;
