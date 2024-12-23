'use client';

import { Form, Input, Button, ConfigProvider } from 'antd';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/navigation';
import type { GetProps } from 'antd';
import { useMyContext } from '@/context/Store';
// import useHandleMessagePopup from '@/hooks/useHandleMessagePopup';
import { postRestAPI } from '@/services/graphqlCrud';
import { useEffect, useRef, useState } from 'react';
import { getCookie, removeCookie } from '@/utils/cookieUtils';
import { sendResetCode } from '@/services/handleForgetPassword';

type OTPProps = GetProps<typeof Input.OTP>;

export default function OtpVerificationPage() {
  const { setErrorMessage, setSuccessMessage, setLoadingMessage } =
    useMyContext();
  // const { contextHolder } = useHandleMessagePopup();
  const t = useTranslations('OtpVerificationPage.content');
  const f = useTranslations('ForgetPasswordPage.content');
  const router = useRouter();
  const [timer, setTimer] = useState(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store the interval
  const disableResend = timer >= 1;

  const handleSubmit = async (values: { OTP: string }) => {
    // console.log(values);
    // console.log(values.OTP);
    try {
      const emailResetPassword = getCookie('emailResetPassword');
      if (!emailResetPassword || !values?.OTP) {
        throw new Error('No email pr code was found');
      }
      const { data, error } = await postRestAPI({
        pathname: 'auth/validate-otp',
        body: { email: emailResetPassword, otp: values.OTP }
      });

      if (error || !data?.ok) {
        console.error(error);
        setErrorMessage(t('invalidOtp'));
        return;
      }

      // console.log(data);

      setSuccessMessage(t('verificationSuccess'));
      removeCookie('emailResetPassword');
      setTimeout(() => {
        router.replace(`/change-password?code=${values.OTP}`);
      }, 500);
    } catch (e) {
      console.error(e);
      setErrorMessage(t('errorOccured'));
      router.replace('/forget-password');
    }
  };

  // console.log('Outside useEffect timer interval timer', timer);

  // Function to start the timer
  const startTimer = () => {
    // Clear any existing interval
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Start a new interval
    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalRef.current as NodeJS.Timeout); // Stop the interval
          intervalRef.current = null; // Clean up the ref
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  // Function to reset the timer (can be called externally)
  const resetTimer = (newTime: number) => {
    setTimer(newTime);
    startTimer(); // Restart the timer

    const emailResetPassword = getCookie('emailResetPassword');
    if (!emailResetPassword) {
      console.error('emailResetPassword was not found');
      setErrorMessage(t('errorOccured'));
      removeCookie('emailResetPassword');
      // Replace the current page (otp-verification) with the previous one
      // This will prevent going forward to the otp-verification page
      router.replace('/forget-password'); // Use the path of the page you want to redirect to
      return;
    }

    sendResetCode({
      setLoadingMessage,
      setErrorMessage,
      setSuccessMessage,
      email: emailResetPassword,
      invalidEmailAddressText: f(
        'formValidationMessages.invalidEmailAddress'
      ),
      codeSentSuccessfullyMessageText: f(
        'formValidationMessages.codeSentSuccessfullyMessage'
      ),
      errorDuringFormSubmissionText: f(
        'formValidationMessages.errorDuringFormSubmission'
      ),
      invalidEmailAddressRegisteredByGoogleOrFacebookText: f(
        'formValidationMessages.invalidEmailAddressRegisteredByGoogleOrFacebook'
      ),
      routerPushToOtpPage: () => {
        router.push('/otp-verification');
      }
    });
  };

  const resendHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    resetTimer(60); // Reset the timer to 60 seconds again
  };

  // Start the timer on mount
  useEffect(() => {
    startTimer(); // Start the timer when the component mounts

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        // console.log('Timer cleaned up on unmount.');
      }
    };
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    const emailResetPassword = getCookie('emailResetPassword');
    if (!emailResetPassword) {
      removeCookie('emailResetPassword');
      // Replace the current page (otp-verification) with the previous one
      // This will prevent going forward to the otp-verification page
      router.replace('/forget-password'); // Use the path of the page you want to redirect to
    }
  }, [router]);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'var(--font-inter)',
          colorPrimary: '#1677ff',
          borderRadius: 8,
          lineWidth: 1
        },
        components: {
          Button: {
            controlHeight: 50,
            fontSize: 18
          }
        }
      }}
    >
      {/* {contextHolder} */}
      <section className='mx-auto flex flex-col items-center justify-center font-inter md:min-h-[calc(100vh-160px)]'>
        <div className='w-full rounded-lg border border-solid border-gray-light border-opacity-60 bg-white shadow sm:max-w-md md:mt-0 xl:p-0'>
          <div className='space-y-4 p-6 sm:p-8 md:space-y-5'>
            {/* <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg'> */}
            <h1 className='mb-2 text-center text-2xl font-bold'>
              {t('headerTitle')}
            </h1>
            <p className='mb-6 text-center text-base text-slate-500'>
              {t('instruction')}{' '}
              <button
                className='inline text-base text-blue-light hover:text-blue-light-dark disabled:cursor-not-allowed disabled:text-red-500 disabled:hover:text-red-600'
                disabled={disableResend}
                onClick={resendHandler}
              >
                {t('resendText')}
              </button>
              {t('instructionBetweenText')}
              <Link
                className='text-blue-light hover:text-blue-light-dark'
                href='/forget-password'
                replace={true}
              >
                {t('differentEmailText')}
              </Link>
            </p>

            <Form onFinish={handleSubmit} className='space-y-4'>
              <Form.Item
                name='OTP'
                rules={[
                  { required: true, message: t('otpRequired') }
                ]}
              >
                <Input.OTP
                  // {...sharedProps}
                  autoFocus={true}
                  size='large'
                  length={6}
                  style={{ width: '100%' }}
                  dir='ltr'
                />
              </Form.Item>
              <Button
                type='primary'
                htmlType='submit'
                className='w-full'
              >
                {t('verifyButton')}
              </Button>
            </Form>

            <p className='mt-4 flex items-center justify-center gap-2'>
              <span className='text-lg text-slate-500'>
                {t('didNotRecieveCodeText')}
              </span>
              <button
                className='inline text-base text-blue-light hover:text-blue-light-dark disabled:cursor-not-allowed disabled:text-red-500 disabled:hover:text-red-600'
                disabled={disableResend}
                onClick={resendHandler}
              >
                {t('resendLink')} ({timer}s)
              </button>
            </p>
          </div>
        </div>
      </section>
    </ConfigProvider>
  );
}
