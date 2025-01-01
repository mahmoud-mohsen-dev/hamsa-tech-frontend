'use client';
import { useLocale, useTranslations } from 'next-intl';
import { IoIosSend } from 'react-icons/io';
import { LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useMyContext } from '@/context/Store';
import { handleCreateGuestWithSubscribeToNewsAndOffersUser } from '@/components/blog/blog-page/SingupToNewsLetterForm';
import { Spin } from 'antd';

function SubscribeInput() {
  const t = useTranslations('HomePage.footer');
  const b = useTranslations(
    'BlogPage.child.content.signupToNewsLetter.clientComponent'
  );
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const { setErrorMessage, setSuccessMessage } = useMyContext();
  const [email, setEmail] = useState<string>('');

  const handleClear = () => {
    setEmail('');
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(e);
    handleCreateGuestWithSubscribeToNewsAndOffersUser({
      errorMessageHandler: () => {
        setErrorMessage(b('errorMessage'));
      },
      successMessageHandler: () => {
        setSuccessMessage(b('successMessage'));
      },
      email: email ? email : null,
      handleClear,
      setIsLoading
    });
  };

  return (
    <form
      className='relative w-full max-w-80 text-white'
      onSubmit={handleSubmit}
    >
      <input
        placeholder={t('newsletterInputPlaceholder')}
        className={`w-full rounded-md bg-[rgba(255,255,255,.1)] px-4 py-3 ring ring-transparent ring-offset-blue-gray-medium focus:outline-none focus:ring-blue-300 focus:ring-offset-2`}
        type='email'
        id='subscribed-email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      ></input>
      <button
        className={`absolute top-1/2 w-10 -translate-y-1/2 ${locale === 'ar' ? 'left-0' : 'right-0'}`}
        type='submit'
      >
        {isLoading ?
          <Spin
            indicator={<LoadingOutlined spin />}
            size='default'
            style={{
              color: 'white',
              paddingRight: locale == 'ar' ? '0px' : '3rem',
              paddingLeft: locale === 'ar' ? '3rem' : '0px'
            }}
          />
        : <IoIosSend size={28} />}
      </button>
    </form>
  );
}

export default SubscribeInput;
