// import { Button, Input, Space } from 'antd';
import {
  FaFacebookF,
  FaInstagram,
  FaPhoneVolume,
  FaTiktok,
  FaYoutube
} from 'react-icons/fa6';
import { IoMdMail } from 'react-icons/io';
import { MdDoubleArrow } from 'react-icons/md';
import SubcribeInput from '../UI/embla/SubcribeInput';
import { Link } from '@/navigation';

function Footer() {
  return (
    <footer
      data-aos='fade-down'
      data-aos-delay='0'
      data-aos-duration='300'
      data-aos-easing='linear'
      data-aos-once='true'
      className='w-full bg-blue-gray-medium py-16'
    >
      <div className='container grid grid-cols-1 gap-8 text-white md:grid-cols-2 xl:grid-cols-footer xl:gap-5'>
        <div>
          <div className='mb-5 flex items-center gap-5 xl:mb-8'>
            <img
              src='/hamsa-logo-white.svg'
              alt='hamsa logo'
              className='h-full max-w-10'
            />
            <h2 className='text-2xl font-bold'>Hamsa Tech</h2>
          </div>
          <h4 className='mb-5 max-w-[360px] text-base font-light opacity-80 xl:mb-8'>
            Security and privacy are two sides of the same coin. You
            can’t have privacy without security and vice versa.
          </h4>
          <div className='mb-5 flex items-center gap-4 xl:mb-8'>
            <Link
              href='/'
              className='flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-white bg-opacity-10 text-sm transition-colors duration-300 hover:bg-blue-300 hover:text-black-light'
            >
              <FaFacebookF />
            </Link>
            <Link
              href='/'
              className='hover:bg-blue-primary flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-white bg-opacity-10 text-sm transition-colors duration-300 hover:bg-blue-300 hover:text-black-light'
            >
              <FaTiktok />
            </Link>
            <Link
              href='/'
              className='hover:bg-blue-primary flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-white bg-opacity-10 text-sm transition-colors duration-300 hover:bg-blue-300 hover:text-black-light'
            >
              <FaYoutube />
            </Link>
            <Link
              href='/'
              className='hover:bg-blue-primary flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-white bg-opacity-10 text-sm transition-colors duration-300 hover:bg-blue-300 hover:text-black-light'
            >
              <FaInstagram />
            </Link>
          </div>
        </div>
        <div className=''>
          <h2 className='mb-5 text-2xl font-bold xl:mb-8'>
            Quick Links
          </h2>
          <ul className='flex flex-col gap-1.5'>
            <li>
              <Link
                href='/'
                className='quick-links flex items-center gap-2 text-base font-light capitalize'
              >
                <MdDoubleArrow className='icon text-blue-300' />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                href='/products'
                className='quick-links flex items-center gap-2 text-base font-light capitalize'
              >
                <MdDoubleArrow className='icon text-blue-300' />
                <span>Products</span>
              </Link>
            </li>
            <li>
              <Link
                href='/products'
                className='quick-links flex items-center gap-2 text-base font-light capitalize'
              >
                <MdDoubleArrow className='icon text-blue-300' />
                <span>Branches</span>
              </Link>
            </li>
            <li>
              <Link
                href='/blog'
                className='quick-links flex items-center gap-2 text-base font-light capitalize'
              >
                <MdDoubleArrow className='icon text-blue-300' />
                <span>Blog</span>
              </Link>
            </li>
            <li>
              <Link
                href='/about'
                className='quick-links flex items-center gap-2 text-base font-light capitalize'
              >
                <MdDoubleArrow className='icon text-blue-300' />
                <span>About US</span>
              </Link>
            </li>
            <li>
              <Link
                href='/support'
                className='quick-links flex items-center gap-2 text-base font-light capitalize'
              >
                <MdDoubleArrow className='icon text-blue-300' />
                <span>Support</span>
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className='mb-5 text-2xl font-bold xl:mb-8'>
            Newsletter
          </h2>
          <h4 className='mb-5'>
            Don’t miss to subscribe to our new feeds.
          </h4>
          <SubcribeInput />
        </div>
        <div className=''>
          <h2 className='mb-5 text-2xl font-bold xl:mb-8'>Contact</h2>
          <div>
            <div className='flex items-center gap-5'>
              <FaPhoneVolume className='text-blue-300' size={40} />
              <div>
                <h4 className='text-xl font-semibold'>Contact Us</h4>
                <h4>(+20) 01023456789</h4>
              </div>
            </div>
            <div className='mt-5 flex items-center gap-5'>
              <IoMdMail className='text-blue-300' size={40} />
              <div>
                <h4 className='text-xl font-semibold'>Mail Us</h4>
                <h4>info@yourdomain.com</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
