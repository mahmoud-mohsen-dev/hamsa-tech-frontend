import { Link } from '@/navigation';
import { Checkbox, Form, Input } from 'antd';
import { useTranslations } from 'next-intl';

function Contact() {
  const t = useTranslations('CheckoutPage.content');

  return (
    <>
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-semibold'>{t('contactTitle')}</h2>
        <Link
          href={'/login'}
          className='text-base font-normal text-blue-sky-normal underline hover:underline'
        >
          {t('loginTitle')}
        </Link>
      </div>
      <Form.Item
        name='emailOrPhone'
        rules={[
          {
            required: true,
            message: t(
              'formValidationErrorMessages.inputEmailOrPhone'
            )
          }
        ]}
        style={{ marginTop: '16px', marginBottom: '16px' }}
      >
        <Input
          type='text'
          placeholder={t('emailOrPhoneTitlePlaceholder')}
        />
      </Form.Item>
      <Form.Item
        name='sendNewsLetter'
        valuePropName='checked'
        style={{ marginTop: '5px', marginBottom: 0 }}
      >
        <Checkbox>{t('confirmToSendNewsletter')}</Checkbox>
      </Form.Item>
    </>
  );
}

export default Contact;