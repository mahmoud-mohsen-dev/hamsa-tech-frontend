'use client';
import { ConfigProvider, Form, Input, Rate } from 'antd';
import Btn from '../UI/Btn';
import TextArea from 'antd/es/input/TextArea';
import { useForm } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useUser } from '@/context/UserContext';
import { Link } from '@/navigation';
import useHandleMessagePopup from '@/hooks/useHandleMessagePopup';
import { useMyContext } from '@/context/Store';
import { createReview, updateReview } from '@/services/review';
import { reviewType } from '@/types/getProduct';
import { revalidateProductLayoutPage } from '@/app/actions';

function CreateOrEditReview({
  productIds,
  editReview = false,
  reviewOnEditData,
  handleCancel
}: {
  productIds: { arId: string | null; enId: string | null };
  editReview?: boolean;
  reviewOnEditData?: reviewType;
  handleCancel?: () => void;
}) {
  const [form] = useForm<{
    overallRating: number;
    headline: string;
    comment: string;
  }>();
  const t = useTranslations('ProductPage.reviewsTabSection');
  const { userId } = useUser();
  // const { contextHolder } = useHandleMessagePopup({
  //   scrollTop: false
  // });
  const { setErrorMessage, setSuccessMessage, setLoadingMessage } =
    useMyContext();

  const onFinish = async (values: {
    comment: string;
    headline: string;
    overallRating: number;
  }) => {
    if (editReview) {
      const id: string | null = await updateReview({
        setSuccessMessage,
        setErrorMessage,
        setLoadingMessage,
        reviewFormdata: {
          rating: values.overallRating,
          headline: values.headline,
          comment: values.comment
        },
        reviewId: reviewOnEditData?.id ?? null,
        errorMessage: t(
          'responseMessages.errorFailedToReportMessage'
        ),
        userNotFoundMessage: t(
          'responseMessages.userNotFoundMessage'
        ),
        successMessage: t('responseMessages.successUpdateMessage')
      });

      if (!id) {
        console.error('updated review id was not found', id);
      }

      form.resetFields();

      if (handleCancel) {
        handleCancel();
      }

      await revalidateProductLayoutPage({ products: productIds });
      return;
    }

    const response: string | null = await createReview(
      setSuccessMessage,
      setErrorMessage,
      setLoadingMessage,
      {
        rating: values.overallRating,
        headline: values.headline,
        comment: values.comment
      },
      productIds,
      t('responseMessages.successCreateMessage'),
      t('responseMessages.errorCreateMessage')
    );

    if (typeof response === 'string') {
      form.resetFields();
      await revalidateProductLayoutPage({ products: productIds });
      // const scrollBy = JSON.parse(
      //   sessionStorage.getItem('scroll') ?? '0'
      // );
      // if (scrollBy) {
      //   window.scrollTo(0, scrollBy);
      // }
      // sessionStorage.removeItem('scroll');
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    setLoadingMessage(false);
    setErrorMessage(
      errorInfo?.errorFields[0]?.errors[0] ??
        t('formValidationErrors.failedToApplyChanges')
    );
    console.error('failed to create a review:', errorInfo);
  };

  return (
    <div
      id={editReview ? '' : 'create-A-review'}
      className={editReview ? 'pb-3' : ''}
    >
      {userId ?
        <>
          {!editReview && (
            <h3 className='mb-5 font-openSans text-base font-bold capitalize text-black-medium'>
              {t('createReviewText')}
            </h3>
          )}
          {/* {contextHolder} */}
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
              layout='vertical'
              form={form}
              initialValues={
                reviewOnEditData ?
                  {
                    overallRating:
                      reviewOnEditData?.attributes?.rating ?? 0,
                    headline:
                      reviewOnEditData?.attributes?.headline ?? '',
                    comment:
                      reviewOnEditData?.attributes?.comment ?? ''
                  }
                : {
                    overallRating: undefined
                  }
              }
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              style={{ scrollMarginTop: 130 }}
            >
              <Form.Item
                label={t('overallRatingText')}
                name='overallRating'
                style={{ marginBottom: 16 }}
                rules={[
                  {
                    required: true,
                    message: t('overallRatingRequiredMessage')
                  },
                  {
                    validator: (_, value) => {
                      if (value >= 1) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(t('overallRatingMinMessage'))
                      );
                    }
                  }
                ]}
              >
                <Rate />
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

              <div className='mt-5 flex items-center justify-end gap-5'>
                {editReview && (
                  <Btn
                    className='rounded-md border border-gray-light font-inter text-sm text-black-light !shadow-none hover:border-gray-medium hover:text-black-accent'
                    onClick={() =>
                      handleCancel ? handleCancel() : (
                        console.log(
                          'handleCancel function was not found'
                        )
                      )
                    }
                  >
                    Cancel
                  </Btn>
                )}
                <Btn
                  className='w-fit rounded-md bg-green-dark px-8 text-white hover:bg-green-medium active:bg-green-dark'
                  type='submit'
                >
                  {t('submitButtonText')}
                </Btn>
              </div>
            </Form>
          </ConfigProvider>
        </>
      : <div className='flex flex-wrap items-center gap-2.5 font-openSans text-sm font-bold text-black-medium'>
          <h3>{t('singinIsRequired')}</h3>
          <Link href='/signin' className='hover:underline'>
            {t('signinText')}
          </Link>
        </div>
      }
    </div>
  );
}

export default CreateOrEditReview;
