'use client';

import {
  BlogCommentType,
  BlogDataType
} from '@/types/getBlogPageResponse';
import LikesAndReply from './LikesAndReply';
import { useEffect, useState } from 'react';
import { Skeleton } from 'antd';
import { useIsMount } from '@/hooks/useIsMount';
import PostAComment from './PostOrEditAComment';
import { useBlog } from '@/context/BlogContext';
import { useUser } from '@/context/UserContext';

function CommentAndReplyAndOnEdit({
  commentData,
  blogData,
  parentCommentId,
  comment
}: {
  commentData: BlogCommentType;
  blogData: BlogDataType;
  parentCommentId: string | null;
  comment: string;
}) {
  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const { didMount } = useIsMount();
  const { blogIds, commentIdOnEditMode, setCommentIdOnEditMode } =
    useBlog();
  const { userId } = useUser();
  const isSignedIn = userId ? true : false;

  const isOnEditMode =
    commentData?.id &&
    commentIdOnEditMode &&
    commentIdOnEditMode === commentData.id;

  useEffect(() => {
    if (didMount) {
      setIsComponentLoading(false);
    }
    return () => setIsComponentLoading(true);
  }, []);

  const handleCloseEdit = () => {
    setCommentIdOnEditMode(null);
  };

  console.log(comment);

  return (
    <>
      {isComponentLoading ?
        <div className='mt-4 flex flex-col items-center gap-5'>
          {/* <Skeleton.Node
            active={true}
            style={{ width: '100%', height: 20, borderRadius: 4 }}
            className='!h-[20px]'
          /> */}
          <Skeleton.Button
            active={true}
            size={'small'}
            shape={'square'}
            block={true}
            style={{ width: '50%' }}
          />
          <Skeleton.Button
            active={true}
            size={'small'}
            shape={'square'}
            block={true}
          />
        </div>
      : !isOnEditMode &&
        comment.trim() && (
          <div className='mt-4'>
            {comment
              .trim()
              .split('\n')
              .map((line, index) => (
                <p key={index}>{line}</p>
              ))}
          </div>
        )
      }
      {isSignedIn && isOnEditMode && blogData?.id && (
        <div className='mt-6 border-t border-gray-200 pt-6'>
          <PostAComment
            blogIds={blogIds}
            displayCancelButton={true}
            onCancel={() => handleCloseEdit()}
            isAReply={true}
            replyToCommentId={parentCommentId}
            isEditable={true}
            storedCommentText={comment}
            commentId={commentData?.id ?? null}
          />
        </div>
      )}

      {!isOnEditMode && (
        <LikesAndReply
          commentData={commentData}
          blogData={blogData}
          replyToCommentId={parentCommentId ? parentCommentId : null}
        />
      )}
    </>
  );
}

export default CommentAndReplyAndOnEdit;
