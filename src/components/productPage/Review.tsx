'use client';

import { reviewType } from '@/types/getProduct';
import {
  ConfigProvider,
  Form,
  Modal,
  Popconfirm,
  Radio,
  Rate,
  Spin
} from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Btn from '../UI/Btn';
import { AiOutlineLike } from 'react-icons/ai';
import { GrFlag } from 'react-icons/gr';
import { getIdFromToken } from '@/utils/cookieUtils';
import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { HiOutlineTrash } from 'react-icons/hi';
import type { PopconfirmProps } from 'antd';
import CreateOrEditReview from './CreateOrEditReview';
import { deleteReview, updateReview } from '@/services/review';
import { useMyContext } from '@/context/Store';
import { revalidateProductLayoutPage } from '@/app/actions';
import { LoadingOutlined } from '@ant-design/icons';
import { useForm } from 'antd/es/form/Form';
import { useUser } from '@/context/UserContext';
import Time from '../blog/blog-page/comments-components/Time';

function Review({
  review,
  productIds
}: {
  review: reviewType;
  productIds: {
    arId: string | null;
    enId: string | null;
  };
}) {
  const [edit, setEdit] = useState(false);
  const locale = useLocale();
  const t = useTranslations('ProductPage.reviewsTabSection');
  const {
    setErrorMessage,
    setSuccessMessage,
    setLoadingMessage,
    loadingMessage
  } = useMyContext();
  const { userId } = useUser();

  const isAuthor =
    `${review?.attributes?.users_permissions_user?.data?.id}` ===
    `${userId}`;
  const [likeButtonIsHovered, setLikeButtonIsHovered] =
    useState(false);
  const [reportButtonIsHovered, setReportButtonIsHovered] =
    useState(false);
  const [likeButtonIsLoading, setLikeButtonIsLoading] =
    useState(false);
  const [reportAbuseButtonIsLoading, setReportAbuseButtonIsLoading] =
    useState(false);
  const [form] = useForm();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  // const [isLikedByUser, setIsLikedByUser] = useState(
  //   (function () {
  //     return (
  //         review?.attributes?.likes?.data?.find((like) =>
  //           like?.id && userId ? `${like?.id}` === `${userId}` : false
  //         )?.id
  //       ) ?
  //         true
  //       : false;
  //   })()
  // );

  const isLikedByUser =
    (
      review?.attributes?.likes?.data?.find((like) =>
        like?.id && userId ? `${like?.id}` === `${userId}` : false
      )?.id
    ) ?
      true
    : false;
  const isReportedByUser =
    (
      review?.attributes?.report_abuse?.find((report) =>
        report?.user?.data?.id && userId ?
          `${report.user.data.id}` === `${userId}`
        : false
      )?.user?.data?.id
    ) ?
      true
    : false;
  // console.log('==========');
  // console.log(review.id);
  // console.log(isLikedByUser);
  // console.log('==========');

  // console.log(review?.attributes?.likes?.data);
  // console.log(userId);

  const handleEdit = () => {
    setEdit(true);
  };

  const handleCancel = () => {
    setEdit(false);
  };

  const confirmDelete: PopconfirmProps['onConfirm'] = async () => {
    const id = await deleteReview({
      reviewId: review?.id,
      errorMessage: t('responseMessages.successDeleteMessage'),
      successMessage: t('responseMessages.successDeleteMessage'),
      setSuccessMessage,
      setErrorMessage,
      setLoadingMessage
    });

    if (!id) {
      console.error('deleted review id was not found', id);
      return;
    }
    await revalidateProductLayoutPage({ products: productIds });
  };

  const handleLike = async () => {
    setLikeButtonIsLoading(true);
    let likes: null | { id: string }[] = null;
    // console.log(review?.attributes?.likes?.data);
    // console.log(isLikedByUser);

    if (userId) {
      if (
        review?.attributes?.likes?.data &&
        review?.attributes?.likes?.data.length > 0
      ) {
        if (isLikedByUser) {
          likes = review?.attributes?.likes?.data?.filter(
            (like) => `${like.id}` !== `${userId}`
          );
        } else {
          likes = [
            ...review?.attributes?.likes?.data,
            { id: userId }
          ];
        }
      } else {
        likes = [{ id: userId }];
      }
    }
    // console.log(likes);

    // Add or remove like
    const id: string | null = await updateReview({
      reviewId: review?.id ?? null,
      likes,
      updateLikes: true
    });

    if (!id) {
      console.error('updated review id was not found', id);
    }

    await revalidateProductLayoutPage({ products: productIds });

    setTimeout(() => {
      setLikeButtonIsLoading(false);
    }, 1100);
  };

  const onFinishFailed = (errorInfo: any) => {
    setLoadingMessage(false);
    setErrorMessage(
      errorInfo?.errorFields[0]?.errors[0] ??
        t('formValidationErrors.failedToApplyChanges')
    );
    console.error('failed to create a review:', errorInfo);
  };

  const handleModalOk = async () => {
    // setIsModalOpen(false);

    try {
      const values: {
        'radio-group':
          | undefined
          | 'off-topic'
          | 'inappropriate'
          | 'fake'
          | 'other';
      } = await form.validateFields();
      // console.log('Validation successful:', values);

      setReportAbuseButtonIsLoading(true);

      let reportAbuses:
        | {
            user: {
              data: {
                id: string;
              };
            };
            issue_type:
              | 'off-topic'
              | 'inappropriate'
              | 'fake'
              | 'other';
          }[]
        | null = null;
      // console.log(review?.attributes?.report_abuse);
      // console.log(isReportedByUser);

      if (userId) {
        if (
          review?.attributes?.report_abuse &&
          review?.attributes?.report_abuse.length > 0
        ) {
          if (isReportedByUser) {
            reportAbuses = review?.attributes?.report_abuse.filter(
              (report) =>
                report?.user?.data?.id ?
                  `${report.user.data.id}` !== `${userId}`
                : false
            );
          } else {
            reportAbuses = [
              ...review?.attributes?.report_abuse,
              {
                user: { data: { id: userId } },
                issue_type: values['radio-group'] ?? 'other'
              }
            ];
          }
        } else {
          reportAbuses = [
            {
              user: { data: { id: userId } },
              issue_type: values['radio-group'] ?? 'other'
            }
          ];
        }
      }
      // console.log(reportAbuses);

      const id: string | null = await updateReview({
        reviewId: review?.id ?? null,
        reportAbuses,
        updateReportAbuse: true,
        setSuccessMessage,
        setErrorMessage,
        errorMessage: t(
          'responseMessages.errorFailedToReportMessage'
        ),
        userNotFoundMessage: t(
          'responseMessages.userNotFoundMessage'
        ),
        successMessage: t('responseMessages.successReportMessage')
      });

      if (!id) {
        console.error('updated review id was not found', id);
      }

      form.resetFields();
      await revalidateProductLayoutPage({ products: productIds });
      setIsModalOpen(false);
    } catch (error) {
      console.error('error while submitting a report abuse:', error);
      onFinishFailed(error);
    } finally {
      setTimeout(() => {
        setReportAbuseButtonIsLoading(false);
      }, 1100);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const handleCancelReport = async () => {
    try {
      let reportAbuses:
        | {
            user: {
              data: {
                id: string;
              };
            };
            issue_type:
              | 'off-topic'
              | 'inappropriate'
              | 'fake'
              | 'other';
          }[]
        | null = null;

      if (
        userId &&
        isReportedByUser &&
        review?.attributes?.report_abuse &&
        review?.attributes?.report_abuse.length > 0
      ) {
        reportAbuses = review?.attributes?.report_abuse.filter(
          (report) =>
            report?.user?.data?.id ?
              `${report.user.data.id}` !== `${userId}`
            : false
        );
      }
      // console.log(reportAbuses);

      setReportAbuseButtonIsLoading(true);
      const id: string | null = await updateReview({
        reviewId: review?.id ?? null,
        reportAbuses,
        updateReportAbuse: true,
        setSuccessMessage,
        setErrorMessage,
        errorMessage: t('responseMessages.errorCancelReportMessage'),
        userNotFoundMessage: t(
          'responseMessages.userNotFoundMessage'
        ),
        successMessage: t(
          'responseMessages.successCancelReportMessage'
        )
      });

      if (!id) {
        console.error('updated review id was not found', id);
      }

      await revalidateProductLayoutPage({ products: productIds });
    } catch (error) {
      console.error('error while cancelling a report abuse:', error);
    } finally {
      setTimeout(() => {
        setReportAbuseButtonIsLoading(false);
      }, 1100);
    }
  };

  return (
    <>
      <div className='flex w-full justify-between gap-8'>
        <div className='flex grow items-start justify-start gap-4'>
          <Image
            src={
              review?.attributes?.users_permissions_user?.data
                ?.attributes?.avatar_photo?.data?.attributes?.url ??
              '/empty-avatar-photo.png'
            }
            alt={
              review?.attributes?.users_permissions_user?.data
                ?.attributes?.avatar_photo?.data?.attributes
                ?.alternativeText ??
              `${
                review?.attributes?.users_permissions_user?.data
                  ?.attributes?.first_name ?? ''
              } ${
                review?.attributes?.users_permissions_user?.data
                  ?.attributes?.last_name ?? ''
              } avatar profile picture`
            }
            width={60}
            height={60}
            quality={100}
            className='min-h-[60px] min-w-[60px] rounded-full object-cover'
          />
          <div className='w-full'>
            {(review?.attributes?.users_permissions_user?.data
              ?.attributes?.first_name ||
              review?.attributes?.users_permissions_user?.data
                ?.attributes?.last_name) && (
              <h3 className='mb-1 text-lg font-semibold capitalize text-black-medium'>
                {review?.attributes?.users_permissions_user?.data
                  ?.attributes?.first_name ?? ''}{' '}
                {review?.attributes?.users_permissions_user?.data
                  ?.attributes?.last_name ?? ''}
              </h3>
            )}

            {edit ?
              <CreateOrEditReview
                productIds={productIds}
                editReview={true}
                reviewOnEditData={review}
                handleCancel={handleCancel}
              />
            : <>
                <h4 className={`text-sm text-gray-normal`}>
                  <Time
                    createdAtInput={
                      review?.attributes?.createdAt ?? null
                    }
                    publishedAtInput={
                      review?.attributes?.publishedAt ?? null
                    }
                  />
                </h4>
                <div className='mt-2 flex flex-col gap-4 2xl:flex-row 2xl:items-center'>
                  {/* <div dir='ltr' className={'w-fit'}> */}
                  <Rate
                    disabled
                    defaultValue={review?.attributes?.rating ?? 0}
                    value={review?.attributes?.rating ?? 0}
                    // allowHalf
                    style={{ fontSize: 16 }}
                  />
                  {/* </div> */}
                  <h5 className='text-base font-medium capitalize text-black-medium'>
                    {/* Need to recheck the weight at delivery point */}
                    {review?.attributes?.headline ?? ''}
                  </h5>
                </div>
                <p className='mt-1 text-base font-normal text-black-light'>
                  {review?.attributes?.comment ?? ''}
                </p>

                {userId && (
                  <div className='mt-3 flex items-center gap-5'>
                    <Btn
                      className={`${isLikedByUser ? 'text-green-medium' : 'text-gray-normal'} text-sm !shadow-none hover:text-blue-sky-dark disabled:!cursor-default`}
                      defaultPadding={false}
                      onClick={handleLike}
                      setHover={setLikeButtonIsHovered}
                      disabled={likeButtonIsLoading}
                    >
                      {likeButtonIsLoading ?
                        <Spin
                          indicator={<LoadingOutlined spin />}
                          size='small'
                          style={{
                            color:
                              likeButtonIsHovered ? '#1773b0 '
                              : isLikedByUser ? '#65b531 '
                              : '#666666 '
                          }}
                        />
                      : <AiOutlineLike size={16} />}
                      <span>
                        (
                        {(
                          review?.attributes?.likes?.data &&
                          review?.attributes?.likes?.data?.length > 0
                        ) ?
                          review?.attributes?.likes?.data.length
                        : 0}
                        ) {t('reviewHelpfulText')}
                      </span>
                    </Btn>
                    <Btn
                      className={`${isReportedByUser ? 'text-red-shade-350' : 'text-gray-normal'} py-1.5 text-sm !shadow-none hover:text-red-600 disabled:!cursor-default`}
                      defaultPadding={false}
                      onClick={
                        isReportedByUser ?
                          handleCancelReport
                        : showModal
                      }
                      setHover={setReportButtonIsHovered}
                      disabled={reportAbuseButtonIsLoading}
                    >
                      {reportAbuseButtonIsLoading ?
                        <Spin
                          indicator={<LoadingOutlined spin />}
                          size='small'
                          style={{
                            color:
                              reportButtonIsHovered ? '#d7150e '
                              : isReportedByUser ? '#dc2626 '
                              : '#666666 '
                          }}
                        />
                      : <GrFlag size={14} />}
                      {isReportedByUser ?
                        <span>{t('cancelReportAbuseText')}</span>
                      : <span>{t('reviewReportAbuseText')}</span>}
                    </Btn>
                  </div>
                )}
              </>
            }
          </div>
        </div>

        {isAuthor && !edit && (
          <div className='flex items-start gap-3'>
            <Btn
              className='text-sm leading-6 text-gray-normal !shadow-none hover:text-blue-sky-dark'
              defaultPadding={false}
              onClick={handleEdit}
            >
              <FiEdit size={16} />
              <span>{t('reviewEditButtonText')}</span>
            </Btn>
            <Popconfirm
              title={t('deleteConfirm.title')}
              description={t('deleteConfirm.description')}
              okButtonProps={{ loading: loadingMessage }}
              onConfirm={confirmDelete}
              okText={t('deleteConfirm.okText')}
              cancelText={t('deleteConfirm.cancelText')}
            >
              <button className='flex items-center justify-center gap-1.5 rounded text-sm leading-6 text-gray-normal transition-colors duration-300 hover:text-red-600 focus:outline-none active:outline-none disabled:cursor-not-allowed'>
                <HiOutlineTrash size={20} />
                <span>{t('reviewDeleteButtonText')}</span>
              </button>
            </Popconfirm>
          </div>
        )}
      </div>
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
        <Modal
          title={
            <h2 className='text-base font-bold text-blue-gray-light'>
              {t('reportReview.title')}
            </h2>
          }
          okText={t('reportReview.submitButton')}
          cancelText={t('reportReview.cancelButton')}
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          loading={reportAbuseButtonIsLoading}
          classNames={{
            content: '!min-h-fit',
            wrapper: '!top-[calc(50%-350px)]'
          }}
        >
          <h3 className='mt-3 text-sm font-semibold'>
            {t('reportReview.question')}
          </h3>
          <Form layout='vertical' form={form}>
            <Form.Item
              name='radio-group'
              style={{ marginLeft: '10px' }}
              rules={[
                {
                  required: true,
                  message: t('reportReview.formValidation')
                }
              ]}
            >
              <Radio.Group>
                <Radio
                  value='off_topic'
                  style={{ marginBlock: '10px', width: '100%' }}
                >
                  <span className='gap-.5 ml-2 flex flex-col'>
                    <span className='text-sm font-medium text-black-light'>
                      {t('reportReview.offTopic.label')}
                    </span>
                    <span className='text-gray-500'>
                      {t('reportReview.offTopic.description')}
                    </span>
                  </span>
                </Radio>

                <Radio
                  value='inappropriate'
                  style={{ marginBlock: '10px', width: '100%' }}
                >
                  <span className='gap-.5 ml-2 flex flex-col'>
                    <span className='text-sm font-medium text-black-light'>
                      {t('reportReview.inappropriate.label')}
                    </span>
                    <span className='text-gray-500'>
                      {t('reportReview.inappropriate.description')}
                    </span>
                  </span>
                </Radio>

                <Radio
                  value='fake'
                  style={{ marginBlock: '10px', width: '100%' }}
                >
                  <span className='gap-.5 ml-2 flex flex-col'>
                    <span className='text-sm font-medium text-black-light'>
                      {t('reportReview.fake.label')}
                    </span>
                    <span className='text-gray-500'>
                      {t('reportReview.fake.description')}
                    </span>
                  </span>
                </Radio>

                <Radio
                  value='other'
                  style={{ marginBlock: '10px', width: '100%' }}
                >
                  <span className='gap-.5 ml-2 flex flex-col'>
                    <span className='text-sm font-medium text-black-light'>
                      {t('reportReview.other.label')}
                    </span>
                    <span className='text-gray-500'>
                      {t('reportReview.other.description')}
                    </span>
                  </span>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Form>

          <h4 className='text-sm font-medium'>
            {t('reportReview.successMessage')}
          </h4>
        </Modal>
      </ConfigProvider>
    </>
  );
}

export default Review;
