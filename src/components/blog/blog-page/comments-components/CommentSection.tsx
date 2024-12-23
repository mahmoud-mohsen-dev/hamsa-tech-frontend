import { v4 } from 'uuid';
import Comment from './Comment';
import { BlogDataType } from '@/types/getBlogPageResponse';
import CreateACommentOrPromptToSignin from './CreateACommentOrPromptToSignin';
import { useTranslations } from 'next-intl';
import { Divider } from 'antd';
import { getTranslations } from 'next-intl/server';

export interface CommentDataType {
  id: string;
  profile: {
    name: string | null;
    image: { src: string | null; alt: string | null };
  };
  commentText: string;
  likes: number[] | string[] | null;
  publishedAt: string | null;
  updatedAt: string | null;
  replies?: CommentDataType[] | null;
}
async function CommentSection({
  blogData,
  blogIds
}: {
  blogIds: { arId: string | null; enId: string | null };
  blogData: BlogDataType;
}) {
  const t = await getTranslations('BlogPage.child.content');
  const p = await getTranslations('ProductPage.reviewsTabSection');
  const commentsData =
    blogData?.attributes?.blog_comments?.data ?? null;

  const totalSubComments =
    commentsData && commentsData.length > 0 ?
      commentsData.reduce((acc, cur) => {
        if (cur?.attributes?.replies?.data) {
          return (acc += cur.attributes.replies.data.length);
        }
        return (acc += 0);
      }, 0)
    : 0;

  const totalReplies =
    commentsData && commentsData.length > 0 ?
      commentsData.length + totalSubComments
    : 0;
  // console.log(commentsData);

  return (
    <section className='my-5'>
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-lg font-bold text-gray-900 lg:text-2xl'>
          {t('discussion')} ({totalReplies})
        </h2>
      </div>

      <div className='mb-8'>
        <CreateACommentOrPromptToSignin blogIds={blogIds} />
      </div>

      {/* Comments */}
      <div className='rounded-xl bg-white'>
        {commentsData && commentsData.length > 0 ?
          commentsData.map((comment, index, arr) => (
            <Comment
              key={v4()}
              commentData={comment}
              blogData={blogData}
              addBorderTop={true}
              addBorderBottom={(function () {
                if (index === arr.length - 1) {
                  return true;
                }

                if (comment?.attributes?.replies?.data) {
                  return (
                    comment?.attributes?.replies?.data.length > 0
                  );
                }

                return false;
              })()}
              parentCommentId={comment?.id ?? null}
              repliesIds={
                comment?.attributes?.replies?.data
                  ?.map((reply) => reply?.id ?? null)
                  .filter((id) => id !== null) ?? null
              }
            />
          ))
        : <>
            <div className='block w-full px-6'>
              <Divider
                style={{ marginTop: '16px', marginBottom: '16px' }}
              />
            </div>
            <p className='mt-3 px-6'>{p('noReviewsText')}</p>
          </>
        }
      </div>
    </section>
  );
}

export default CommentSection;
