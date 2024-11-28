'use client';

import { reviewType } from '@/types/getProduct';
import { Popconfirm, Rate } from 'antd';
import dayjs from 'dayjs';
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
import { deleteReview } from '@/services/review';
import { useMyContext } from '@/context/Store';
import revalidateProductLayoutPage from '@/app/action';

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
  const userId = getIdFromToken();
  const isAuthor =
    `${review?.attributes?.users_permissions_user?.data?.id}` ===
    `${userId}`;
  const {
    setErrorMessage,
    setSuccessMessage,
    setLoadingMessage,
    loadingMessage
  } = useMyContext();

  const isLikedByUser = true;

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
    }
    await revalidateProductLayoutPage({ products: productIds });
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
                <h4
                  className={`text-sm text-gray-normal ${locale === 'ar' ? 'text-end' : 'text-start'}`}
                  dir='ltr'
                >
                  {dayjs(review?.attributes.updatedAt ?? '').format(
                    'DD MMMM YYYY ( hh:mm:ss A )'
                  )}
                </h4>
                <div className='mt-2 flex flex-col gap-4 2xl:flex-row 2xl:items-center'>
                  {/* <div dir='ltr' className={'w-fit'}> */}
                  <Rate
                    disabled
                    defaultValue={review?.attributes?.rating ?? 0}
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
                      className={`${isLikedByUser ? 'text-green-medium' : 'text-gray-normal'} text-sm !shadow-none hover:text-blue-sky-dark`}
                      defaultPadding={false}
                    >
                      <AiOutlineLike size={16} />
                      <span>Helpful</span>
                      <span>(4)</span>
                    </Btn>
                    <Btn
                      className='py-1.5 text-sm text-gray-normal !shadow-none hover:text-red-600'
                      defaultPadding={false}
                    >
                      <GrFlag size={14} />
                      <span>Report Abuse</span>
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
              <span>Edit</span>
            </Btn>
            <Popconfirm
              title={t('deleteConfirm.title')}
              description={t('deleteConfirm.description')}
              okButtonProps={{ loading: loadingMessage }}
              onConfirm={confirmDelete}
              okText={t('deleteConfirm.okText')}
              cancelText={t('deleteConfirm.cancelText')}
            >
              <button className='flex items-center justify-center rounded text-sm leading-6 text-gray-normal transition-colors duration-300 hover:text-red-600 focus:outline-none active:outline-none disabled:cursor-not-allowed'>
                <HiOutlineTrash size={20} />
                <span>Delete</span>
              </button>
            </Popconfirm>
          </div>
        )}
      </div>
    </>
  );
}

export default Review;
