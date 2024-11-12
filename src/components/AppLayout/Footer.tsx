// import { Button, Input, Space } from 'antd';
import { FaPhoneVolume } from 'react-icons/fa6';
import { IoMdMail } from 'react-icons/io';
import { MdDoubleArrow } from 'react-icons/md';
import SubcribeInput from '../UI/embla/SubcribeInput';
import { Link } from '@/navigation';
import { FooterSectionType } from '@/types/getIndexLayout';
import { useLocale, useTranslations } from 'next-intl';
import { getSocialMediaIcon } from '@/utils/getSocialMediaIcon';
import Image from 'next/image';
import Anchor from '../UI/Anchor';

interface PropsType {
  data: FooterSectionType;
}

function Footer({ data }: PropsType) {
  const locale = useLocale();
  const t = useTranslations('HomePage.footer');

  return (
    <footer
      // data-aos='fade-down'
      // data-aos-delay='0'
      // data-aos-duration='300'
      // data-aos-easing='linear'
      // data-aos-once='true'
      className='mx-auto w-full max-w-[1900px] bg-blue-gray-medium py-8'
    >
      <div className='container grid grid-cols-1 gap-8 text-white md:grid-cols-2 xl:grid-cols-footer xl:gap-5'>
        <div>
          <div className='mb-5 flex items-center gap-5 xl:mb-7'>
            <Image
              src='/hamsa-logo-white.svg'
              alt='hamsa logo'
              height={40}
              width={40}
              quality={100}
              className='h-full max-w-10'
            />
            <h2 className='text-2xl font-bold'>{t('companyName')}</h2>
          </div>
          <h4 className='mb-5 max-w-[320px] text-pretty text-lg font-light opacity-80 xl:mb-7'>
            {data?.description}
          </h4>
          <div className='= flex items-center gap-4'>
            {data?.social_links.map((link) => {
              return (
                <Anchor
                  key={link.id}
                  href={link?.url ?? '/'}
                  target='_blank'
                  applyDefaultClasses={false}
                  className='flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-white bg-opacity-10 text-sm transition-colors duration-300 hover:bg-blue-300 hover:text-black-light'
                >
                  {getSocialMediaIcon(link.icon)}
                </Anchor>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className='mb-5 text-2xl font-bold xl:mb-7'>
            {t('quickLinksTitle')}
          </h2>
          <ul className='flex flex-col gap-1.5'>
            {data?.quick_links.map((link) => {
              return (
                <li key={link.id}>
                  <Link
                    href={link?.slug ?? '/'}
                    className='quick-links flex items-center gap-2 text-base font-light capitalize opacity-80 hover:opacity-100'
                  >
                    {locale === 'ar' ?
                      <MdDoubleArrow className='icon flip text-blue-300' />
                    : <MdDoubleArrow className='icon text-blue-300' />
                    }
                    <span>{link?.name ?? ''}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h2 className='mb-5 text-2xl font-bold xl:mb-7'>
            {t('newsletterTitle')}
          </h2>
          <h4 className='mb-5 opacity-80'>
            {t('newsLetterDescription')}
          </h4>
          <SubcribeInput />
        </div>
        <div>
          <h2 className='mb-5 text-2xl font-bold xl:mb-7'>
            {t('contactTitle')}
          </h2>
          <div>
            <div className='flex items-center gap-5'>
              <FaPhoneVolume className='text-blue-300' size={40} />
              <div>
                <h4 className='text-xl font-medium opacity-90'>
                  {t('contactPhoneTitle')}
                </h4>
                <h4 dir='ltr' className='text-lg opacity-80'>
                  {data?.contact_us_phone ?? ''}
                </h4>
              </div>
            </div>
            <div className='mt-5 flex items-center gap-5'>
              <IoMdMail className='text-blue-300' size={40} />
              <div>
                <h4 className='text-xl font-medium opacity-90'>
                  {t('contactMailTitle')}
                </h4>
                <h4 className='text-lg opacity-80'>
                  {data?.contact_us_email ?? ''}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
