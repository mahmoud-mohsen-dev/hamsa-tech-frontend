import { getLocale } from 'next-intl/server';
import Image from 'next/image';
import DropdownCommentButton from './DropdownCommentButton';
import {
  BlogCommentType,
  BlogDataType
} from '@/types/getBlogPageResponse';
import { v4 } from 'uuid';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import CommentAndReplyAndOnEdit from './CommentAndReplyAndOnEdit';
import Time from './Time';

const Comment = async ({
  blogData,
  commentData,
  addBorderTop = false,
  addBorderBottom = false,
  isAReply = false,
  parentCommentId = null,
  repliesIds = null
}: {
  blogData: BlogDataType;
  commentData: BlogCommentType;
  addBorderTop?: boolean;
  addBorderBottom?: boolean;
  isAReply?: boolean;
  parentCommentId?: string | null;
  repliesIds?: string[] | null;
}) => {
  const locale = await getLocale();
  const author = commentData?.attributes?.user?.data?.attributes;
  const isHidden = commentData?.attributes?.hidden ?? false;

  const shouldAddBorderBottom = (
    reply: BlogCommentType,
    blogData: BlogDataType,
    index: number,
    arr: BlogCommentType[]
  ): boolean => {
    const blogComments = blogData?.attributes?.blog_comments?.data;
    const lastBlogComment = blogComments?.at(-1);
    const lastReplyInLastComment =
      lastBlogComment?.attributes?.replies?.data?.at(-1);

    return (
      index === arr.length - 1 &&
      lastBlogComment?.id === commentData?.id &&
      lastReplyInLastComment?.id === reply?.id
    );
  };

  return (
    !isHidden && (
      <>
        <article
          className={`bg-transparent px-7 text-base ${
            isAReply ?
              locale === 'ar' ?
                'mr-8 py-6 pr-7 lg:mr-12'
              : 'ml-8 py-6 pl-7 lg:ml-12'
            : locale === 'ar' ? 'mr-0 py-6'
            : 'ml-0 py-6'
          } ${addBorderBottom ? 'border-b' : ''} ${addBorderTop ? 'border-t' : ''} border-x border-dashed border-gray-200`}
        >
          <footer className='mb-2 flex items-start justify-between md:items-center'>
            <div className='flex flex-wrap items-center gap-y-3'>
              <p
                className={`${locale === 'ar' ? 'ml-3' : 'mr-3'} inline-flex items-center text-xs font-semibold text-gray-900 lg:text-sm`}
              >
                {author?.avatar_photo?.data?.attributes?.url ?
                  <Image
                    className={`${locale === 'ar' ? 'ml-3' : 'mr-3'} h-[40px] w-[40px] rounded-full object-cover lg:h-[50px] lg:w-[50px]`}
                    src={
                      author?.avatar_photo?.data?.attributes?.url ?
                        author?.avatar_photo?.data?.attributes?.url
                      : '/empty-avatar-photo.png'
                    }
                    alt={
                      (
                        author?.avatar_photo?.data?.attributes
                          ?.alternativeText
                      ) ?
                        author?.avatar_photo?.data?.attributes
                          ?.alternativeText
                      : ''
                    }
                    width={40}
                    height={40}
                  />
                : <Image
                    className={`${locale === 'ar' ? 'ml-3' : 'mr-3'} h-[40px] w-[40px] rounded-full object-cover lg:h-[50px] lg:w-[50px]`}
                    src={`/empty-avatar-photo.png`}
                    alt={'No avatar photo available'}
                    width={40}
                    height={40}
                  />
                }
                {author?.first_name || author?.last_name ?
                  `${author.first_name} ${author.last_name}`
                : 'Anonymous'}
              </p>
              <p className='text-xs text-gray-600 lg:text-sm'>
                <Time
                  createdAtInput={
                    commentData?.attributes?.createdAt ?? null
                  }
                  publishedAtInput={
                    commentData?.attributes?.publishedAt ?? null
                  }
                />
              </p>
            </div>
            <DropdownCommentButton
              commentUserId={
                commentData?.attributes?.user?.data?.id ?? null
              }
              commentId={commentData?.id ?? v4()}
              repliesIds={repliesIds}
            />
          </footer>
          <CommentAndReplyAndOnEdit
            comment={commentData?.attributes?.comment ?? ''}
            blogData={blogData}
            commentData={commentData}
            parentCommentId={parentCommentId}
          />
        </article>

        {commentData?.attributes?.replies?.data &&
          commentData?.attributes?.replies?.data.length > 0 &&
          commentData?.attributes?.replies?.data.map(
            (reply, index, arr) => (
              <Comment
                commentData={reply}
                blogData={blogData}
                addBorderTop={(function () {
                  if (index === 0) {
                    return false;
                  }

                  return true;
                })()}
                addBorderBottom={shouldAddBorderBottom(
                  reply,
                  blogData,
                  index,
                  arr
                )}
                key={reply?.id ?? v4()}
                isAReply={true}
                parentCommentId={parentCommentId}
              />
            )
          )}
      </>
    )
  );
};

export default Comment;
