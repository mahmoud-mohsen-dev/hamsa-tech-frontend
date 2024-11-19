'use client';
import { Form, Input, Rate } from 'antd';
import Btn from '../UI/Btn';
import TextArea from 'antd/es/input/TextArea';
import { useForm } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useUser } from '@/context/UserContext';
import { Link } from '@/navigation';

function CreateReview() {
  const [form] = useForm();
  const t = useTranslations('ProductPage.reviewsTabSection');
  const { userId } = useUser();

  return (
    <div id='Reviews-Create-A-Comment'>
      {userId ?
        <>
          <h3 className='mb-5 font-openSans text-base font-bold capitalize text-black-medium'>
            {t('createReviewText')}
          </h3>
          <Form
            layout='vertical'
            form={form}
            initialValues={{
              overalAllRating: 0
            }}
            onFinish={(values) => {
              console.log(values);
              const getFormValues = async () => {
                const data = await form.getFieldsValue();
                console.log(data);
              };
              getFormValues();
              const res = form.getFieldsValue();
              console.log(res);
            }}
            style={{ scrollMarginTop: 130 }}
          >
            <Form.Item
              label={t('overallRatingText')}
              name='overAllRating'
              style={{ marginBottom: 16 }}
              rules={[
                {
                  required: true,
                  message: t('overallRatingRequiredMessage')
                }
              ]}
            >
              <Rate allowHalf />
            </Form.Item>
            <Form.Item
              label={t('addHeadlineText')}
              name='headline'
              style={{ marginBottom: 16 }}
              rules={[
                {
                  required: true,
                  message: t('headlineRequiredMessage')
                }
              ]}
            >
              <Input
                placeholder={t('addHeadlinePlaceholderText')}
                style={{ paddingInline: 16, paddingBlock: 12 }}
              />
            </Form.Item>
            <Form.Item
              label={t('addWrittenReviewText')}
              name='comment'
              style={{ marginBottom: 16 }}
              rules={[
                {
                  required: true,
                  message: t('commentRequiredMessage')
                }
              ]}
            >
              <TextArea
                rows={4}
                placeholder={t('addWrittenReviewPlaceholderText')}
                style={{ paddingInline: 16, paddingBlock: 12 }}
              />
            </Form.Item>
            <Btn
              className='ml-auto mt-5 w-fit rounded-md bg-green-dark px-8 text-white'
              type='submit'
            >
              {t('submitButtonText')}
            </Btn>
          </Form>
        </>
      : <div className='flex flex-wrap items-center gap-2.5 font-openSans text-sm font-bold text-black-medium'>
          <h3>Sign in to write a review.</h3>
          <Link href='/signin' className='hover:underline'>
            Sign in
          </Link>
        </div>
      }
    </div>
  );
}

export default CreateReview;
