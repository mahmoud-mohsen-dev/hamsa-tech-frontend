'use client';
import { useRouter } from '@/navigation';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import { message, ConfigProvider, Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';

const forgetPasswordQuery = (email: string) => {
  return `mutation {
    forgotPassword(email: "${email}") {
      success
      message
    }
  }`;
};

function ForgetPasswordForm() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const t = useTranslations('ForgetPasswordPage.content');

  const onFinish = ({ email }: { email: string }) => {
    const sendResetCode = async () => {
      try {
        // messageApi.open({
        //   type: 'loading',
        //   content: t('formValidationErrorMessages.loading'),
        //   duration: 0
        // });

        const { data, error } = await fetchGraphqlClient(
          forgetPasswordQuery(email)
        );

        if (error || !data?.forgotPassword?.success) {
          messageApi.error(
            t('formValidationErrorMessages.emailNotFound')
          );
          return;
        }

        messageApi.success(
          t('formValidationErrorMessages.resetPasswordSuccessMessage')
        );
        setTimeout(() => {
          router.push('/reset-password');
        }, 1000);
      } catch (err) {
        console.error('Error during form submission:', err);
        messageApi.error(
          t('formValidationErrorMessages.errorDuringFormSubmission')
        );
      } finally {
        setTimeout(messageApi.destroy, 900);
      }
    };

    sendResetCode();
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity) => {
    messageApi.error(
      errorInfo?.errorFields[0]?.errors[0] ??
        t('formValidationErrorMessages.errorDuringFormSubmission')
    );
  };

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
              message: t('formValidationErrorMessages.emailRequired')
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
