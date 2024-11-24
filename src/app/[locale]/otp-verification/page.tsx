'use client';

import { Form, Input, Button, ConfigProvider } from 'antd';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import type { GetProps } from 'antd';

type OTPProps = GetProps<typeof Input.OTP>;

export default function OtpVerificationPage() {
  const t = useTranslations('OtpVerificationPage');
  //   const [otpValues, setOtpValues] = useState(['', '', '', '']);

  const onChange: OTPProps['onChange'] = (text) => {
    console.log('onChange:', text);
  };

  const onInput: OTPProps['onInput'] = (value) => {
    console.log('onInput:', value);
  };

  const sharedProps: OTPProps = {
    onChange,
    onInput
  };

  //   const handleInputChange = (index, value) => {
  //     if (/^\d?$/.test(value)) {
  //       const newOtpValues = [...otpValues];
  //       newOtpValues[index] = value;
  //       setOtpValues(newOtpValues);
  //     }
  //   };

  const handleSubmit = () => {
    // const otp = otpValues.join('');
    // if (otp.length === 4) {
    //   message.success(t('content.verificationSuccess'));
    //   // Submit the OTP or handle verification
    // } else {
    //   message.error(t('content.invalidOtp'));
    // }
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
          //   Input: {
          //     //   activeShadow: '0 0 0 3px rgba(5, 145, 255, 0.1)',
          //     paddingBlock: 20,
          //     // controlHeight: 30
          //     paddingInline: 20
          //   },
          Button: {
            controlHeight: 50,
            fontSize: 18
          }
        }
      }}
    >
      <section className='mx-auto flex flex-col items-center justify-center font-inter md:min-h-[calc(100vh-160px)]'>
        <div className='w-full rounded-lg border border-solid border-gray-light border-opacity-60 bg-white shadow sm:max-w-md md:mt-0 xl:p-0'>
          <div className='space-y-4 p-6 sm:p-8 md:space-y-5'>
            {/* <div className='w-full max-w-md rounded-lg bg-white p-8 shadow-lg'> */}
            <h1 className='mb-2 text-center text-2xl font-bold'>
              {t('content.headerTitle')}
            </h1>
            <p className='mb-6 text-center text-slate-500'>
              {t('content.instruction')}
            </p>

            <Form onFinish={handleSubmit} className='space-y-4'>
              {/* <div className='flex justify-center gap-2'>
              {/* {otpValues.map((value, index) => (
                <Input
                  key={index}
                  value={value}
                  maxLength={1}
                  className='h-14 w-14 border-slate-200 text-center text-2xl'
                  onChange={(e) =>
                    handleInputChange(index, e.target.value)
                  }
                  onPaste={(e) => {
                    e.preventDefault();
                    const paste = e.clipboardData
                      .getData('text')
                      .slice(0, 4);
                    setOtpValues(paste.split(''));
                  }}
                />
              ))} */}
              {/* </div> */}
              <Input.OTP
                {...sharedProps}
                size='large'
                length={4}
                style={{ width: '100%' }}
                dir='ltr'
              />
              <Button
                type='primary'
                htmlType='submit'
                className='w-full'
              >
                {t('content.verifyButton')}
              </Button>
            </Form>

            <p className='mt-4 text-center text-slate-500'>
              {t('content.resendText')}{' '}
              <Link
                className='text-red-500 hover:text-red-600'
                href='#0'
              >
                {t('content.resendLink')}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </ConfigProvider>
  );
}
