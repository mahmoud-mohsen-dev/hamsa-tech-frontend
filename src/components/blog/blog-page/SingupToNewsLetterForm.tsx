'use client';

import { useMyContext } from '@/context/Store';
import { Link } from '@/navigation';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import { CreateGuestUserResponseType } from '@/types/guestUserReponses';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

const createGuestUserQuery = (
  agreedToSignUpForNewsletter: boolean = false,
  email: string | null = null
) => {
  return `mutation CreateGuestUser {
    createGuestUser(
        data: {
        email_or_phone: ${email ? `"${email}"` : null}
            subscribed_to_news_and_offers: ${agreedToSignUpForNewsletter}
            publishedAt: "${new Date().toISOString()}"
        }
    ) {
        data {
            id
        }
    }
  }`;
};

export const handleCreateGuestWithSubscribeToNewsAndOffersUser =
  async ({
    errorMessageHandler,
    successMessageHandler,
    email = null,
    handleClear,
    setIsLoading
  }: {
    errorMessageHandler: () => void;
    successMessageHandler: () => void;
    email: string | null;
    handleClear: () => void;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  }) => {
    try {
      setIsLoading(true);
      const { data: guestUserData, error: guestUserError } =
        (await fetchGraphqlClient(
          createGuestUserQuery(true, email)
        )) as CreateGuestUserResponseType;

      if (
        guestUserError ||
        !guestUserData?.createGuestUser?.data?.id
      ) {
        console.error('Failed to create guest user');
        errorMessageHandler();
        return;
      }

      console.log(guestUserData?.createGuestUser?.data?.id);
      successMessageHandler();
    } catch (e) {
      console.error('Failed to create guest user', e);
      errorMessageHandler();
    } finally {
      handleClear();
      setIsLoading(false);
    }
  };

function SingupToNewsLetterForm() {
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const { setErrorMessage, setSuccessMessage } = useMyContext();
  const [email, setEmail] = useState<string>('');
  const t = useTranslations(
    'BlogPage.child.content.signupToNewsLetter.clientComponent'
  );

  const handleClear = () => {
    setEmail('');
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleCreateGuestWithSubscribeToNewsAndOffersUser({
      errorMessageHandler: () => {
        setErrorMessage(t('errorMessage'));
      },
      successMessageHandler: () => {
        setSuccessMessage(t('successMessage'));
      },
      email: email ? email : null,
      handleClear,
      setIsLoading
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`mx-auto mb-3 max-w-screen-sm ${locale === 'ar' ? 'flex-row-reverse' : ''} items-center space-y-4 sm:flex sm:space-y-0`}
        // dir='ltr'
      >
        <div className='relative w-full'>
          <label
            htmlFor='email'
            className='mb-2 hidden text-sm font-medium text-gray-900'
          >
            {t('emailLabel')}
          </label>
          <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
            <svg
              className='h-4 w-4 text-gray-500'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 20 16'
            >
              <path d='m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z' />
              <path d='M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z' />
            </svg>
          </div>
          <input
            className='block w-full rounded-bl-lg rounded-tl-lg border-b border-l border-t border-gray-300 bg-white p-3 pl-9 text-sm text-gray-900 sm:rounded-none sm:rounded-l-lg'
            placeholder={t('emailPlaceholder')}
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <button
            type='submit'
            className='w-[125px] cursor-pointer rounded-lg border border-blue-light-dark bg-blue-light-dark px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-normal focus:bg-blue-light-dark sm:rounded-none sm:rounded-r-lg'
          >
            {isLoading ?
              t('submitButton.loading')
            : t('submitButton.default')}
          </button>
        </div>
      </div>
      <div
        className={`mx-auto max-w-screen-sm ${locale === 'ar' ? 'text-right' : 'text-left'} text-sm text-gray-500`}
      >
        {t('weCareText')}{' '}
        <Link
          href='/privacy-policy'
          className='text-primary-600 font-medium hover:underline'
        >
          {t('privacyPolicyText')}
        </Link>
        .
      </div>
    </form>
  );
}

export default SingupToNewsLetterForm;
