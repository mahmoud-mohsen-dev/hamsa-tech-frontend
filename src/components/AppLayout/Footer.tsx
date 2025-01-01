// import { Button, Input, Space } from 'antd';
import { FaPhoneVolume } from 'react-icons/fa6';
import { IoMdMail } from 'react-icons/io';
import { MdDoubleArrow } from 'react-icons/md';
import SubscribeInput from '../UI/embla/SubscribeInput';
import { Link } from '@/navigation';
import { FooterSectionType } from '@/types/getIndexLayout';
import { useLocale, useTranslations } from 'next-intl';
import { getSocialMediaIcon } from '@/utils/getSocialMediaIcon';
import Image from 'next/image';
import Anchor from '../UI/Anchor';
import { FaRegHeart } from 'react-icons/fa';
import { v4 } from 'uuid';
import React from 'react';

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
      className='mx-auto w-full max-w-[1900px] bg-blue-gray-medium shadow'
    >
      <section className='container grid grid-cols-1 gap-8 py-10 shadow md:grid-cols-2 xl:grid-cols-footer xl:gap-5'>
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
            <h2 className='text-2xl font-bold text-white'>
              {t('companyName')}
            </h2>
          </div>
          <h4 className='mb-5 max-w-[320px] text-pretty text-lg font-normal text-gray-400 xl:mb-7'>
            {data?.description}
          </h4>
          <div className='= flex items-center gap-4 text-white'>
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
          <h2 className='mb-5 text-2xl font-bold text-white xl:mb-7'>
            {t('quickLinksTitle')}
          </h2>
          <ul className='flex flex-col gap-1.5'>
            {data?.quick_links.map((link) => {
              return (
                <li key={link.id}>
                  <Link
                    href={link?.slug ?? '/'}
                    className='quick-links flex items-center gap-2 text-base font-normal capitalize text-gray-400 hover:text-gray-300'
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
          <h2 className='mb-5 text-2xl font-bold text-white xl:mb-7'>
            {t('newsletterTitle')}
          </h2>
          <h4 className='mb-5 text-gray-400'>
            {t('newsLetterDescription')}
          </h4>
          <SubscribeInput />
        </div>
        <div>
          <h2 className='mb-5 text-2xl font-bold text-white xl:mb-7'>
            {t('contactTitle')}
          </h2>
          <div>
            <div className='flex items-center gap-5'>
              <FaPhoneVolume className='text-blue-300' size={40} />
              <div>
                <h4 className='text-xl font-medium text-gray-300'>
                  {t('contactPhoneTitle')}
                </h4>
                <h4 dir='ltr' className='text-lg text-gray-400'>
                  {data?.contact_us_phone ?? ''}
                </h4>
              </div>
            </div>
            <div className='mt-5 flex items-center gap-5'>
              <IoMdMail className='text-blue-300' size={40} />
              <div>
                <h4 className='text-xl font-medium text-gray-300'>
                  {t('contactMailTitle')}
                </h4>
                <h4 className='text-lg text-gray-400'>
                  {data?.contact_us_email ?? ''}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <hr className='border-gray-700' /> */}
      <section className='bg-[#252d46]'>
        {/* <section className='bg-blue-gray-medium'> */}
        <div className='container w-full py-6'>
          <div className='sm:flex sm:items-center sm:justify-between'>
            <ul className='mb-6 flex flex-wrap items-center gap-3 text-sm font-medium text-gray-400 sm:mb-0'>
              {data?.terms &&
                data?.terms.length > 0 &&
                data.terms.map((term, index, arr) => {
                  return (
                    <React.Fragment key={term.id}>
                      <li>
                        <Link
                          href={term.slug ?? '/'}
                          className='hover:text-gray-300'
                        >
                          {term.name}
                        </Link>
                      </li>
                      {index !== arr.length - 1 && (
                        <li>
                          <span>|</span>
                        </li>
                      )}
                    </React.Fragment>
                  );
                })}
              {/* <li>
                <Link
                  href='/privacy-policy'
                  className='hover:text-gray-300'
                >
                  {t('privacyPolicyText')}
                </Link>
              </li>
              <li>
                <span>|</span>
              </li>
              <li>
                <Link
                  href='/terms-of-service'
                  className='hover:text-gray-300'
                >
                  {t('termsOfServiceText')}
                </Link>
              </li>
              <li>
                <span>|</span>
              </li>
              <li>
                <Link
                  href='/shipping-policy'
                  className='hover:text-gray-300'
                >
                  {t('shippingPolicyText')}
                </Link>
              </li>
              <li>
                <span>|</span>
              </li>
              <li>
                <Link
                  href='/return-and-refund-policy'
                  className='hover:text-gray-300'
                >
                  {t('returnAndRefundPolicyText')}
                </Link>
              </li>
              <li>
                <span>|</span>
              </li>
              <li>
                <Link
                  href='/waranty-terms'
                  className='hover:text-gray-300'
                >
                  {t('warrantyTermsText')}
                </Link>
              </li> */}
            </ul>

            <div className='flex flex-wrap items-center gap-5'>
              <Image
                src='/payment-methods/mastercard.svg'
                alt='mastercard logo'
                width={50}
                height={30}
              />
              <Image
                src='/payment-methods/visa.svg'
                alt='visa logo'
                width={50}
                height={30}
              />
              {/* <Image
            src='/payment-methods/valu.svg'
            alt='valu logo'
            width={38}
            height={24}
          /> */}
              <Image
                src='/payment-methods/meeza.svg'
                alt='meeza logo'
                width={50}
                height={30}
              />
            </div>
          </div>
        </div>
      </section>

      {/* <hr className='border-gray-700' /> */}
      <section className='bg-[#21283e] py-6'>
        <div className='container'>
          <div className='flex w-full items-center justify-center gap-2 text-sm text-gray-400'>
            {t('madeWithText')} <FaRegHeart />
            {t('byText')}
            <Link
              href='https://mahmoud-mohsen.vercel.app'
              target='_blank'
              rel='noopener noreferrer'
              className='text-gray-300 hover:text-white'
            >
              {t('developerName')}
            </Link>
            | {t('allRightsReservedText')} ©{' '}
            {new Date().getFullYear().toString()}
            <a href='/' className='text-gray-300 hover:text-white'>
              {t('siteName')}
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
