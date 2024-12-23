import { getIdFromToken } from '@/utils/cookieUtils';
import { fetchGraphqlClientAuthenticated } from './graphqlCrud';
import { fetchGraphqlServerWebAuthenticated } from './graphqlCrudServerOnly';

const getUserBlogCommentsQuery = () => {
  const userId = getIdFromToken();
  return `query UsersPermissionsUser {
    usersPermissionsUser(id: ${userId}) {
            data {
                id
                attributes {
                    blog_comments(pagination: { pageSize: 10000 }) {
                        data {
                            id
                        }
                    }
                }
            }
        }
    }`;
};

export const getUserBlogComments = async () => {
  try {
    const { data, error } = await fetchGraphqlClientAuthenticated(
      getUserBlogCommentsQuery()
    );

    const blogs: { id: string }[] | null =
      (
        Array.isArray(
          data?.usersPermissionsUser?.data?.attributes?.blog_comments
            ?.data
        ) &&
        data?.usersPermissionsUser?.data?.attributes?.blog_comments
          ?.data.length > 0
      ) ?
        data.usersPermissionsUser.data.attributes.blog_comments.data
      : null;
    // console.log(data);
    // console.log(blogs);

    if (error || !data?.usersPermissionsUser?.data?.id) {
      console.error('Failed to fetch user blog comments', error);
      return null;
    }

    return blogs;
  } catch (err: any) {
    console.error(err?.message ?? err);
    throw new Error(err?.message ?? err);
  }
};

const updateUserBlogCommentsQuery = ({
  userBlogCommentIds
}: {
  userBlogCommentIds: null | { id: string }[];
}) => {
  // console.log(blogComments);

  const userId = getIdFromToken();

  if (!userId) {
    throw new Error(`Invalid user ID: ${userId}`);
  }

  return `mutation UpdateUser {
    updateUser(id: "${userId}", input: { blog_comments: ${
      userBlogCommentIds && userBlogCommentIds.length > 0 ?
        `[${userBlogCommentIds
          .map((comment) => comment?.id ?? null)
          .filter((comment) => typeof comment === 'string' && comment)
          .join(', ')}]`
      : null
    } }) {
        data {
            id
        }
    }
  }`;
};

export const updateUserBlogComments = async ({
  userBlogCommentIds
}: {
  userBlogCommentIds: null | { id: string }[];
}) => {
  try {
    // console.log('newCommentId', newCommentId);
    // console.log('userBlogCommentIds', userBlogCommentIds);
    // console.log(
    //   userBlogCommentIds && userBlogCommentIds.length > 0 ?
    //     [...userBlogCommentIds, { id: newCommentId }]
    //   : [{ id: newCommentId }]
    // );

    const { data, error } = await fetchGraphqlClientAuthenticated(
      updateUserBlogCommentsQuery({
        userBlogCommentIds
      })
    );

    if (error || !data?.updateUser?.data.id) {
      console.error('Failed to update user blog comments', error);
      return null;
    }

    return data.updateUser.data.id;
  } catch (err: any) {
    console.error(err?.message ?? err);
    return null;
  }
};

const createBlogCommentQuery = ({
  blogIds,
  commentText,
  replyToCommentId
}: {
  blogIds: { enId: string | null; arId: string | null } | null;
  commentText: string;
  replyToCommentId: string | null;
}) => {
  const createdAtTime = new Date().toISOString();
  return `mutation CreateBlogComment {
        createBlogComment(data: { comment: "${commentText}", blogs: ${blogIds?.arId && blogIds?.enId ? `["${blogIds?.enId}", "${blogIds?.arId}"]` : null}, publishedAt: "${createdAtTime}", likes: null, replied_to: ${replyToCommentId ? `"${replyToCommentId}"` : null} }) {
            data {
                id
            }
        }
    }`;
};

export const createBlogComment = async ({
  blogIds,
  commentText,
  replyToCommentId = null,
  isAReply = false
}: {
  blogIds: { enId: string | null; arId: string | null } | null;
  commentText: string;
  replyToCommentId?: string | null;
  isAReply?: boolean;
}) => {
  try {
    const { data, error } = await fetchGraphqlServerWebAuthenticated(
      createBlogCommentQuery({
        blogIds,
        commentText,
        replyToCommentId: isAReply ? replyToCommentId : null
      })
    );

    if (error || !data?.createBlogComment?.data?.id) {
      console.error('Failed to create blog comment', error);
      return null;
    }

    const newCommentId = data.createBlogComment.data.id as string;
    const userBlogCommentIds = await getUserBlogComments();

    const newUserBlogCommentIds =
      userBlogCommentIds && userBlogCommentIds.length > 0 ?
        [...userBlogCommentIds, { id: newCommentId }]
      : [{ id: newCommentId }];

    const userId = await updateUserBlogComments({
      userBlogCommentIds: newUserBlogCommentIds
    });

    if (!userId) {
      console.error(
        'Failed to update user blog comments after creating a new comment'
      );
      return null;
    }

    return data.createBlogComment.data.id;
  } catch (err: any) {
    console.error(err?.message ?? err);
    return null;
  }
};

const getBlogCommentQuery = ({
  commentId
}: {
  commentId: string;
}) => {
  return `query BlogComment {
    blogComment(id: "${commentId}") {
        data {
            attributes {
                likes(pagination: { pageSize: 10000 }) {
                    data {
                        id
                    }
                }
                replies(pagination: { pageSize: 10000 }) {
                    data {
                        id
                        attributes {
                            comment
                            user {
                                data {
                                    id
                                }
                            }
                            likes(pagination: { pageSize: 10000 }) {
                                data {
                                    id
                                }
                            }
                        }
                    }
                }
                report_abuses(pagination: { pageSize: 1000 }) {
                    id
                    issue_type
                    user {
                        data {
                            id
                        }
                    }
                }
            }
        }
    }
  }`;
};

export const getBlogComment = async ({
  commentId,
  userId
}: {
  commentId: string | null;
  userId: string | null;
}) => {
  try {
    if (!userId) {
      console.error(
        'The operation is not authorized, you must log in.'
      );
      return null;
    }
    if (!commentId) {
      console.error('Comment ID is required');
      return null;
    }

    const { data: fetchedCommentData, error: fetchedCommentError } =
      await fetchGraphqlServerWebAuthenticated(
        getBlogCommentQuery({ commentId })
      );

    const fetchedComment =
      fetchedCommentData?.blogComment?.data?.attributes ?? null;
    if (fetchedCommentError || !fetchedComment) {
      console.error(
        'Error occured while fetching comment data',
        fetchedCommentError
      );
      return null;
    }

    return fetchedComment;
  } catch (err: any) {
    console.error(err?.message ?? err);
    return null;
  }
};

const updateLikeQuery = ({
  commentId,
  likes
}: {
  commentId: string | null;
  likes: string[] | null;
}) => {
  const likesStr =
    likes && likes.length > 0 ?
      `[${likes.filter((like) => like).join(', ')}]`
    : null;

  return `mutation UpdateBlogComment {
    updateBlogComment(id: ${commentId ? `"${commentId}"` : null}, data: { likes: ${likesStr}}) {
        data {
            id
        }
    }
  }`;
};

export const updateLike = async ({
  commentId,
  userId
}: {
  commentId: string | null;
  userId: string | null;
}) => {
  try {
    const fetchedComment = await getBlogComment({
      commentId,
      userId
    });

    if (!fetchedComment) {
      console.error('Failed to fetch comment data');
      return null;
    }

    const fetchedLikesIds =
      (
        fetchedComment?.likes?.data &&
        fetchedComment?.likes?.data.length > 0
      ) ?
        fetchedComment?.likes?.data
          ?.map((like: { id: string | number }) =>
            like?.id ? `${like?.id}` : null
          )
          .filter((like: string) => like)
      : null;

    // console.log('fetchedComment', fetchedComment);
    // console.log('fetchedLikesIds', fetchedLikesIds);

    let newLikedIds = null;
    if (!fetchedLikesIds) {
      newLikedIds = [`${userId}`];
    } else {
      const filteredArr = fetchedLikesIds.filter(
        (id: string) => `${id}` !== `${userId}`
      );
      const newIds = filteredArr.length > 0 ? filteredArr : null;

      newLikedIds =
        fetchedLikesIds.includes(`${userId}`) ? newIds : (
          [...fetchedLikesIds, `${userId}`]
        );
    }

    // console.log('newLikedIds', newLikedIds);

    const { data, error } = await fetchGraphqlServerWebAuthenticated(
      updateLikeQuery({ commentId, likes: newLikedIds })
    );

    if (error || !data?.updateBlogComment?.data?.id) {
      console.error('Failed to update comment likes', error);
      return null;
    }

    return data.updateBlogComment.data.id as string;
  } catch (err: any) {
    console.error(err?.message ?? err);
    return null;
  }
};

const deleteBlogCommentQuery = (commentId: string) => {
  return `mutation DeleteBlogComment {
    deleteBlogComment(id: "${commentId}") {
        data {
            id
        }
    }
  }`;
};

export const deleteBlogComment = async ({
  commentId,
  repliesIds
}: {
  commentId: string | null;
  repliesIds: string[] | null;
}) => {
  try {
    if (!commentId) {
      console.error('Comment ID is required');
      return null;
    }

    const userBlogCommentIds = await getUserBlogComments();

    const newUserBlogCommentIds =
      userBlogCommentIds && userBlogCommentIds.length > 0 ?
        userBlogCommentIds.filter(
          (comment) => comment?.id && comment.id !== commentId
        )
      : null;

    const userId = await updateUserBlogComments({
      userBlogCommentIds: newUserBlogCommentIds
    });

    if (!userId) {
      console.error(
        'Failed to remove user blog comment id from user collection'
      );
      return null;
    }

    // const { data, error } = await fetchGraphqlServerWebAuthenticated(
    //   deleteBlogCommentQuery(commentId)
    // );

    // console.log(data.deleteBlogComment.data.id);
    // if (error) {
    //   console.error('Failed to delete blog comment', error);

    //   return null;
    // }

    // repliesIds &&
    //   repliesIds.length > 0 &&
    //   repliesIds?.forEach(async () => {
    //     const { data: childCommentData, error: childCommentError } =
    //       await fetchGraphqlServerWebAuthenticated(
    //         deleteBlogCommentQuery(commentId)
    //       );

    //     console.log(childCommentData?.deleteBlogComment?.data?.id);
    //     if (
    //       childCommentError ||
    //       !childCommentData?.deleteBlogComment?.data?.id
    //     ) {
    //       console.error('Failed to delete child comments', error);

    //       return null;
    //     }
    //   });

    // Delete replies if present
    if (repliesIds && repliesIds.length > 0) {
      for (const replyId of repliesIds) {
        const { data: childCommentData, error: childCommentError } =
          await fetchGraphqlServerWebAuthenticated(
            deleteBlogCommentQuery(replyId)
          );

        if (
          childCommentError ||
          !childCommentData?.deleteBlogComment?.data?.id
        ) {
          console.error(
            `Failed to delete child comment with ID ${replyId}`,
            childCommentError
          );
          return null;
        }

        console.log(
          `Deleted child comment ID: ${childCommentData.deleteBlogComment.data.id}`
        );
      }
    }

    // Delete the parent comment
    const { data, error } = await fetchGraphqlServerWebAuthenticated(
      deleteBlogCommentQuery(commentId)
    );

    if (error || !data?.deleteBlogComment?.data?.id) {
      console.error('Failed to delete blog comment', error);
      return null;
    }

    console.log(
      `Deleted parent comment ID: ${data.deleteBlogComment.data.id}`
    );
    return data.deleteBlogComment.data.id;
  } catch (err: any) {
    console.error(err?.message ?? err);
    return null;
  }
};

const getUserBlogCommentQuery = ({
  commentId,
  userId
}: {
  commentId: string | null;
  userId: string | null;
}) => {
  return `query UsersPermissionsUser {
    usersPermissionsUser(id: ${userId ? `"${userId}"` : null}) {
        data {
            attributes {
                blog_comments(filters: { id: { eq: ${commentId ? `"${commentId}"` : null} } }, pagination: { pageSize: 1 }) {
                    data {
                        id
                    }
                }
            }
        }
    }
  }`;
};

export const isCommentIdBlongToUser = async ({
  commentId
}: {
  commentId: string | null;
}) => {
  try {
    const userId = getIdFromToken();
    if (!userId) {
      console.error('User ID was not provided');
      return false;
    }

    const { data, error } = await fetchGraphqlClientAuthenticated(
      getUserBlogCommentQuery({ commentId, userId })
    );

    console.log(data);

    const userMatchedComments: { id: string | null }[] | null =
      data?.usersPermissionsUser?.data?.attributes?.blog_comments
        ?.data ?? null;
    console.log('userMatchedComments', userMatchedComments);

    if (error || !userMatchedComments) {
      console.error('Failed to fetch user blog comment', error);
      return false;
    }

    const commentFoundId: string | null =
      (
        Array.isArray(userMatchedComments) &&
        userMatchedComments.length > 0
      ) ?
        userMatchedComments[0].id || null
      : null;
    console.log('commentFoundId', commentFoundId);

    return (
        commentFoundId &&
          commentId &&
          `${commentFoundId}` === `${commentId}`
      ) ?
        true
      : false;
  } catch (err: any) {
    console.error(err?.message ?? err);
    // throw new Error(err?.message ?? err);
    return false;
  }
};

const editBlogCommentQuery = ({
  commentId,
  commentText
}: {
  commentId: string | null;
  commentText: string | null;
}) => {
  const publishedAt = new Date().toISOString();

  return `mutation UpdateBlogComment {
    updateBlogComment(id: ${commentId ? `"${commentId}"` : null}, data: { comment: "${commentText ?? ''}", publishedAt: "${publishedAt}" }) {
        data {
            id
        }
    }
  }`;
};

export const editBlogComment = async ({
  commentId,
  commentText
}: {
  commentId: string | null;
  commentText: string | null;
}) => {
  try {
    if (!commentId) {
      throw new Error('Please provide a comment ID');
    }
    const isCommentBlongToUser = await isCommentIdBlongToUser({
      commentId
    });

    if (!isCommentBlongToUser) {
      console.error('You are not authorized to edit this comment');
      return null;
    }

    const { data, error } = await fetchGraphqlServerWebAuthenticated(
      editBlogCommentQuery({
        commentId,
        commentText
      })
    );
    const responseCommentId: string | null =
      data?.updateBlogComment?.data?.id ?? null;

    if (error || !responseCommentId) {
      console.error('Failed to edit blog comment', error);
      return null;
    }

    return responseCommentId;
  } catch (err: any) {
    console.error(err?.message ?? err);
    return null;
  }
};

type ReportAbusesType = {
  id?: string | null;
  issue_type: 'off-topic' | 'inappropriate' | 'fake' | 'other' | null;
  user: { data: { id: string | null } | null };
};

const editReportsBlogCommentQuery = ({
  commentId,
  updatedReportAbuses
}: {
  commentId: string | null;
  updatedReportAbuses:
    | {
        id?: string | null;
        user: { data: { id: string | null } };
        issue_type: 'off-topic' | 'inappropriate' | 'fake' | 'other';
      }[]
    | [];
}) => {
  const updatedReportAbusesStr =
    (
      Array.isArray(updatedReportAbuses) &&
      updatedReportAbuses.length > 0
    ) ?
      `[${updatedReportAbuses
        .map((updatedReport) => {
          const reportId =
            updatedReport?.id ? `id: ${updatedReport.id}, ` : ``;
          return `{ ${reportId} user: ${updatedReport?.user?.data?.id ? `"${updatedReport.user.data.id}"` : null}, issue_type: ${updatedReport.issue_type} }`;
        })
        .join(', ')}]`
    : null;

  // console.log(
  //   'updatedReportAbuses',
  //   JSON.stringify(updatedReportAbuses)
  // );
  console.log('updatedReportAbusesStr', updatedReportAbusesStr);
  // [
  //                 { issue_type: inappropriate, user: "34" }
  //                 { issue_type: inappropriate, user: "29" }
  //             ]
  return `mutation UpdateBlogComment {
    updateBlogComment(id: ${commentId ? `"${commentId}"` : null}, data: {
            report_abuses: ${updatedReportAbusesStr}
        }) {
        data {
            id
        }
    }
  }`;
};

export const editReportsBlogComment = async ({
  commentId,
  issueType
}: {
  commentId: string | null;
  issueType: 'off-topic' | 'inappropriate' | 'fake' | 'other';
}) => {
  try {
    const userId = getIdFromToken();
    const fetchedComment = await getBlogComment({
      commentId,
      userId
    });

    if (!fetchedComment) {
      console.error('Failed to fetch comment data');
      return null;
    }

    const fetchedReportAbuses: null | ReportAbusesType =
      fetchedComment?.report_abuses ?? null;

    console.log('fetchedReportAbuses', fetchedReportAbuses);

    let updatedReportAbuses:
      | []
      | {
          id?: string | null;
          user: { data: { id: string | null } };
          issue_type:
            | 'off-topic'
            | 'inappropriate'
            | 'fake'
            | 'other';
        }[] = [];
    if (
      Array.isArray(fetchedReportAbuses) &&
      fetchedReportAbuses.length > 0
    ) {
      updatedReportAbuses = [
        ...fetchedReportAbuses,
        {
          user: { data: { id: userId } },
          issue_type: issueType
        }
      ];
    } else {
      updatedReportAbuses = [
        {
          user: { data: { id: userId } },
          issue_type: issueType
        }
      ];
    }

    console.log('updatedReportAbuses', updatedReportAbuses);

    const { data, error } = await fetchGraphqlServerWebAuthenticated(
      editReportsBlogCommentQuery({ commentId, updatedReportAbuses })
    );

    const updatedCommentId =
      data?.updateBlogComment?.data?.id ?? null;

    if (error || !updatedCommentId) {
      console.error('Failed to edit reports for blog comment', error);
      return null;
    }

    return updatedCommentId;
  } catch (err: any) {
    console.error(err?.message ?? err);
    return null;
  }
};
