'use client';
import { useMyContext } from '@/context/Store';
import useHandleMessagePopup from '@/hooks/useHandleMessagePopup';
import { useRouter } from '@/navigation';
import { sendResetCode } from '@/services/handleForgetPassword';
import { getCookie, removeCookie } from '@/utils/cookieUtils';
import { ConfigProvider, Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { useEffect } from 'react';

function ForgetPasswordForm() {
  const router = useRouter();
  const { contextHolder } = useHandleMessagePopup();
  const { setErrorMessage, setSuccessMessage, setLoadingMessage } =
    useMyContext();
  const t = useTranslations('ForgetPasswordPage.content');

  const onFinish = ({ email }: { email: string }) => {
    sendResetCode({
      setLoadingMessage,
      setErrorMessage,
      setSuccessMessage,
      email,
      invalidEmailAddressText: t(
        'formValidationMessages.invalidEmailAddress'
      ),
      codeSentSuccessfullyMessageText: t(
        'formValidationMessages.codeSentSuccessfullyMessage'
      ),
      errorDuringFormSubmissionText: t(
        'formValidationMessages.errorDuringFormSubmission'
      ),
      routerPushToOtpPage: () => {
        router.push('/otp-verification');
      }
    });
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    setErrorMessage(
      errorInfo?.errorFields[0]?.errors[0] ??
        t('formValidationMessages.errorDuringFormSubmission')
    );
  };

  useEffect(() => {
    const emailResetPassword = getCookie('emailResetPassword');
    console.log(emailResetPassword);
    if (!emailResetPassword) {
      removeCookie('emailResetPassword');
      // Replace the current page (otp-verification) with the previous one
      // This will prevent going forward to the otp-verification page
      router.replace('/forget-password'); // Use the path of the page you want to redirect to
    }

    // Ensure the user cannot navigate forward to `/otp-verification`
    window.history.pushState(null, '', '/forget-password'); // Clear forward navigation stack
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
          Input: {
            activeShadow: '0 0 0 3px rgba(5, 145, 255, 0.1)',
            paddingBlock: 10,
            paddingInline: 15
          }
        }
      }}
    >
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout='vertical'
        colon={false}
        requiredMark={false}
      >
        {contextHolder}
        <Form.Item
          name='email'
          label={t('emailLabel')}
          rules={[
            { type: 'email' },
            {
              required: true,
              message: t('formValidationMessages.emailRequired')
            }
          ]}
        >
          <Input placeholder={t('emailPlaceholder')} />
        </Form.Item>

        <button
          type='submit'
          className='mt-1 w-full rounded-lg bg-blue-sky-accent px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-sky-medium focus:outline-none focus:ring-4 focus:ring-blue-sky-medium'
        >
          {t('resetPasswordButton')}
        </button>
      </Form>
    </ConfigProvider>
  );
}

export default ForgetPasswordForm;
