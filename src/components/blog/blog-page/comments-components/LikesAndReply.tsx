'use client';

import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';
import PostAComment from './PostOrEditAComment';
import { Popover, Skeleton, Spin } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { Link } from '@/navigation';
import {
  BlogCommentType,
  BlogDataType
} from '@/types/getBlogPageResponse';
import { updateLike } from '@/services/handleBlogComments';
import { useLocale, useTranslations } from 'next-intl';
import { useBlog } from '@/context/BlogContext';
import { revalidateBlogLayoutPage } from '@/app/actions';
import { useMyContext } from '@/context/Store';
import { LoadingOutlined } from '@ant-design/icons';
import { useIsMount } from '@/hooks/useIsMount';

const LikesButton = ({
  handleLikes = () => {},
  usersLikedId,
  isLiked = false,
  likeButtonIsLoading = false
}: {
  handleLikes?: () => void;
  usersLikedId?: string[] | null;
  isLiked?: boolean;
  likeButtonIsLoading?: boolean;
}) => {
  const [hover, setHover] = useState(false);
  const locale = useLocale();
  const t = useTranslations('BlogPage.child.content.likesAndReply');

  return (
    <button
      type='button'
      className={`flex items-center text-sm font-medium ${isLiked ? 'text-green-dark' : 'text-gray-500'} hover:text-blue-sky-dark hover:underline`}
      onClick={handleLikes}
      onMouseMove={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      {likeButtonIsLoading ?
        <Spin
          indicator={<LoadingOutlined spin />}
          size='small'
          style={{
            color:
              hover ? '#1773b0 '
              : isLiked ? '#65b531 '
              : '#6b7280 ',
            marginRight: locale == 'ar' ? '0px' : '0.375rem',
            marginLeft: locale === 'ar' ? '0.375rem' : '0px'
          }}
        />
      : <svg
          className={`${locale === 'ar' ? 'ml-1.5' : 'mr-1.5'} h-3 w-3`}
          aria-hidden='true'
          xmlns='http://www.w3.org/2000/svg'
          fill='currentColor'
          viewBox='0 0 20 18'
        >
          <path d='M17.947 2.053a5.209 5.209 0 0 0-3.793-1.53A6.414 6.414 0 0 0 10 2.311 6.482 6.482 0 0 0 5.824.5a5.2 5.2 0 0 0-3.8 1.521c-1.915 1.916-2.315 5.392.625 8.333l7 7a.5.5 0 0 0 .708 0l7-7a6.6 6.6 0 0 0 2.123-4.508 5.179 5.179 0 0 0-1.533-3.793Z'></path>
        </svg>
      }
      {usersLikedId && usersLikedId.length > 1 ?
        t('likes', { count: usersLikedId.length })
      : t('like')}
    </button>
  );
};

const ReplyButton = ({
  handleReply
}: {
  handleReply: () => void;
}) => {
  const locale = useLocale();
  const t = useTranslations('BlogPage.child.content.likesAndReply');

  return (
    <button
      type='button'
      className='flex items-center text-sm font-medium text-gray-500 hover:underline'
      onClick={handleReply}
    >
      <svg
        className={`${locale === 'ar' ? 'ml-1.5' : 'mr-1.5'} h-3 w-3`}
        aria-hidden='true'
        xmlns='http://www.w3.org/2000/svg'
        fill='currentColor'
        viewBox='0 0 20 18'
      >
        <path d='M18 0H2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2v4a1 1 0 0 0 1.707.707L10.414 13H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5 4h2a1 1 0 1 1 0 2h-2a1 1 0 1 1 0-2ZM5 4h5a1 1 0 1 1 0 2H5a1 1 0 0 1 0-2Zm2 5H5a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Zm9 0h-6a1 1 0 0 1 0-2h6a1 1 0 1 1 0 2Z' />
      </svg>
      {t('reply')}
    </button>
  );
};

function LikesAndReply({
  commentData,
  blogData,
  replyToCommentId
}: {
  commentData: BlogCommentType;
  blogData: BlogDataType;
  replyToCommentId: string | null;
}) {
  const t = useTranslations('BlogPage.child.content.likesAndReply');
  const [toggleReply, setToggleReply] = useState(false);
  const { blogIds } = useBlog();
  const { userId } = useUser();
  const { setErrorMessage } = useMyContext();
  const [likeButtonIsLoading, setLikeButtonIsLoading] =
    useState(false);
  const [componentIsLoading, setComponentIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const { didMount } = useIsMount();

  const isSignedIn = userId ? true : false;

  const likesData = commentData?.attributes?.likes?.data ?? null;
  let usersLikedId =
    likesData &&
    likesData.length > 0 &&
    likesData.map((like) => like?.id ?? null).filter((like) => like);

  if (!usersLikedId || usersLikedId.length === 0) {
    usersLikedId = null;
  }

  const handleLikes = () => {
    const callUpdateLike = async () => {
      try {
        if (!isSignedIn) {
          throw new Error('User not signed in');
        }
        setLikeButtonIsLoading(true);
        const result = await updateLike({
          commentId: commentData?.id,
          userId
        });

        // console.log('result: ' + result);
        if (result) {
          revalidateBlogLayoutPage({ blogIds });
          setIsLiked((prevState) => !prevState);
          return;
        }

        // If like fails, display error message
        throw new Error('Failed to update like');
      } catch (e: any) {
        console.error('Failed to update like:', e?.message || e);
        setErrorMessage(t('failedToLike'));
      } finally {
        setTimeout(() => {
          setLikeButtonIsLoading(false);
        }, 1100);
      }
    };

    callUpdateLike();
  };

  const handleReply = async () => {
    setToggleReply(true);
  };

  const handleCloseToggleReply = () => {
    setToggleReply(false);
  };

  const content = (
    <Link
      href='/signin'
      className='flex items-center gap-3 text-base text-red-shade-350'
    >
      <CloseCircleOutlined />
      <p>{t('signInPrompt')}</p>
    </Link>
  );

  useEffect(() => {
    if (userId) {
      setIsLiked(() => {
        return (
          commentData?.attributes?.likes?.data
            ?.map((like) => (like?.id ? `${like?.id}` : null))
            .filter((like) => like)
            .includes(`${userId}`) ?? false
        );
      });
    }
    // setComponentIsLoading(false);
  }, [userId]);

  useEffect(() => {
    if (didMount) {
      setComponentIsLoading(false);
    }
  });

  return (
    <>
      {/* {contextHolder} */}
      {componentIsLoading ?
        <div className='mt-4 flex h-[20px] items-center gap-5'>
          <Skeleton.Node
            active={true}
            style={{ width: 60, height: 20, borderRadius: 4 }}
            className='!h-[20px]'
          />
          <Skeleton.Node
            active={true}
            style={{ width: 60, height: 20, borderRadius: 4 }}
            className='!h-[20px]'
          />
        </div>
      : <div className='mt-4 flex items-center gap-4'>
          {isSignedIn ?
            <LikesButton
              handleLikes={handleLikes}
              usersLikedId={usersLikedId}
              isLiked={isLiked}
              likeButtonIsLoading={likeButtonIsLoading}
            />
          : <Popover content={content} trigger='click'>
              <LikesButton isLiked={false} />
            </Popover>
          }

          {isSignedIn ?
            <ReplyButton handleReply={handleReply} />
          : <Popover content={content} trigger='click'>
              <ReplyButton handleReply={handleReply} />
            </Popover>
          }
        </div>
      }

      {isSignedIn && toggleReply && blogData?.id && (
        <div className='mt-6 border-t border-gray-200 pt-6'>
          <PostAComment
            blogIds={blogIds}
            displayCancelButton={true}
            onCancel={() => handleCloseToggleReply()}
            isAReply={true}
            replyToCommentId={replyToCommentId}
          />
        </div>
      )}
    </>
  );
}

export default LikesAndReply;
