'use client';
import { revalidateBlogLayoutPage } from '@/app/actions';
import { useMyContext } from '@/context/Store';
import {
  createBlogComment,
  editBlogComment
} from '@/services/handleBlogComments';
import { useState } from 'react';
import { useTranslations } from 'use-intl';

const PostOrEditAComment = ({
  blogIds,
  displayCancelButton = false,
  onCancel,
  replyToCommentId = null,
  isAReply = false,
  isEditable = false,
  storedCommentText = null,
  commentId = null
}: {
  blogIds: { enId: string | null; arId: string | null } | null;
  displayCancelButton?: boolean;
  onCancel?: () => void;
  replyToCommentId?: string | null;
  isAReply?: boolean;
  isEditable?: boolean;
  storedCommentText?: string | null;
  commentId?: string | null;
}) => {
  const { setErrorMessage, setSuccessMessage, setLoadingMessage } =
    useMyContext();
  const [commentText, setCommentText] = useState(() => {
    return isEditable && storedCommentText ? storedCommentText : '';
  });
  const t = useTranslations('BlogPage.child.content');

  const handleCreateComment = async () => {
    try {
      if (!blogIds) {
        console.error('Blog IDs was not provided');
        setErrorMessage(t('responses.errorMessages.createComment'));
        return;
      }
      setLoadingMessage(true);

      const createdCommentId = await createBlogComment({
        blogIds,
        commentText,
        isAReply,
        replyToCommentId
      });
      if (!createdCommentId) {
        setErrorMessage(t('responses.errorMessages.createComment'));
        return;
      }

      setSuccessMessage(t('responses.successMessages.createComment'));

      setCommentText('');

      revalidateBlogLayoutPage({
        blogIds
      });

      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      console.error('Failed to create comment:', err);
      setErrorMessage(t('responses.errorMessages.createComment'));
    } finally {
      setLoadingMessage(false);
    }
  };

  const handleEditComment = async () => {
    try {
      if (!blogIds) {
        console.error('Blog IDs was not provided');
        setErrorMessage(t('responses.errorMessages.editComment'));
        return;
      }
      setLoadingMessage(true);

      const updatedCommentId = await editBlogComment({
        commentId,
        commentText
      });
      if (!updatedCommentId) {
        setErrorMessage(t('responses.errorMessages.editComment'));
        return;
      }

      setSuccessMessage(t('responses.successMessages.editComment'));

      setCommentText('');

      revalidateBlogLayoutPage({
        blogIds
      });

      if (onCancel) {
        onCancel();
      }
    } catch (err) {
      console.error('Failed to edit comment:', err);
      t('responses.errorMessages.editComment');
    } finally {
      setLoadingMessage(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (isEditable) {
      handleEditComment();
    } else {
      handleCreateComment();
    }
  };

  return (
    <>
      {/* {contextHolder} */}
      <form onSubmit={handleSubmit}>
        <div className='mb-4 rounded-lg rounded-t-lg border border-gray-200 bg-white px-4 py-2'>
          <label htmlFor='comment' className='sr-only'>
            {t('forms.labels.yourComment')}
          </label>
          <textarea
            id='comment'
            rows={6}
            className='w-full border-0 bg-transparent px-0 text-sm text-gray-900 focus:outline-none focus:ring-0'
            placeholder={t('forms.placeholders.comment')}
            required
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
            }}
          />
        </div>
        <div className='flex items-center gap-4'>
          <button
            type='submit'
            className='inline-flex items-center rounded-lg border border-transparent bg-black-dark px-4 py-2.5 text-center text-xs font-medium text-white hover:bg-black-medium focus:border-black-dark focus:bg-white focus:text-black-dark'
          >
            {isEditable ?
              t('forms.placeholders.save')
            : t('forms.placeholders.postComment')}
          </button>
          {displayCancelButton && (
            <button
              type='button'
              className='inline-flex items-center rounded-lg border border-black-medium bg-white px-4 py-2.5 text-center text-xs font-medium text-black-medium hover:border-red-shade-250 hover:text-red-shade-250 focus:border-red-shade-300 focus:bg-red-shade-300 focus:text-white'
              onClick={onCancel}
            >
              {t('forms.placeholders.cancel')}
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default PostOrEditAComment;
