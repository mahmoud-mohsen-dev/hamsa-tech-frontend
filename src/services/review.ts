import { getIdFromToken } from '@/utils/cookieUtils';
import { fetchGraphqlClientAuthenticated } from './graphqlCrud';
import { fetchGraphqlServerWebAuthenticated } from './graphqlCrudServerOnly';
import {
  DeleteReviewType,
  GetUserReviewsType,
  RemoveReviewFromUserType,
  updateReviewType
} from '@/types/reviewsResponses';
import { reviewType } from '@/types/getProduct';

interface ReviewFormdataType {
  rating: number;
  headline: string;
  comment: string;
}

interface updateReviewRelationType {
  reviewId: string;
  products: string[] | null;
  userId: string | null;
}

const createReviewQuery = ({
  rating,
  headline,
  comment
}: ReviewFormdataType) => {
  return `mutation CreateReview {
        createReview(
            data: {
                rating: ${rating}
                headline: "${headline}"
                comment: "${comment}"
                publishedAt: "${new Date(new Date().getTime() + 2000).toISOString()}"
            }
        ) {
            data {
                id
            }
        }
    }`;
};

const updateReviewRelationLinksQuery = ({
  reviewId,
  products,
  userId
}: updateReviewRelationType) => {
  return `mutation UpdateReview {
        updateReview(id: "${reviewId}", data: { products: ${products ? `[${products.join(', ')}]` : null}, users_permissions_user: ${userId ? userId : null} }) {
            data {
                id
            }
        }
    }`;
};

export const createReview = async (
  setSuccessMessage: React.Dispatch<
    React.SetStateAction<string | null>
  >,
  setErrorMessage: React.Dispatch<
    React.SetStateAction<string | null>
  >,
  setLoadingMessage: React.Dispatch<React.SetStateAction<boolean>>,
  reviewFormdata: ReviewFormdataType,
  productIds: { arId: string | null; enId: string | null },
  successMessage: string,
  errorMessage: string
) => {
  try {
    setLoadingMessage(true);
    const { data, error } = await fetchGraphqlClientAuthenticated(
      createReviewQuery(reviewFormdata)
    );

    if (!data?.createReview?.data?.id || error) {
      console.error(errorMessage, error);
      setErrorMessage(errorMessage);
      return null;
    }

    const products =
      productIds ?
        ([productIds?.arId ?? null, productIds?.enId ?? null].filter(
          (productId) => typeof productId === 'string'
        ) ?? null)
      : null;

    const userId = getIdFromToken();
    const { data: updatedReviewData, error: updatedReviewError } =
      await fetchGraphqlServerWebAuthenticated(
        updateReviewRelationLinksQuery({
          reviewId: data?.createReview?.data?.id,
          products,
          userId
        })
      );

    if (
      !updatedReviewData?.updateReview?.data?.id ||
      updatedReviewError
    ) {
      console.error('Failed to update a review:', updatedReviewError);
      setErrorMessage(errorMessage);
      return null;
    }

    setSuccessMessage(successMessage);
    return updatedReviewData.updateReview.data.id as string;
  } catch (e) {
    console.error(errorMessage, e);
    setErrorMessage(errorMessage);
    return null;
  } finally {
    setLoadingMessage(false);
  }
};

const getUserReviewsQuery = ({
  userId
}: {
  userId: string | null;
}) => {
  return `query UsersPermissionsUser {
      usersPermissionsUser(id: ${userId ? `"${userId}"` : null}) {
          data {
              attributes {
                  reviews {
                      data {
                          id
                      }
                  }
              }
          }
      }
  }`;
};

const removeReviewFromUserQuery = ({
  userId,
  reviews
}: {
  userId: string | null;
  reviews: string[] | null;
}) => {
  return `mutation UpdateUser {
    updateUser(id: ${userId ? `"${userId}"` : null}, input: { reviews: ${reviews ? `[${reviews.join(', ')}]` : null}}) {
        data {
            id
        }
    }
  }`;
};

const deleteReviewQuery = ({
  reviewId
}: {
  reviewId: string | null;
}) => {
  return `mutation DeleteReview {
    deleteReview(id: ${reviewId ? `"${reviewId}"` : null}) {
        data {
            id
        }
    }
  }`;
};

export async function deleteReview({
  reviewId,
  setSuccessMessage,
  setErrorMessage,
  setLoadingMessage,
  errorMessage,
  successMessage
}: {
  reviewId: string | null;
  setSuccessMessage: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setLoadingMessage: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
  successMessage: string;
}) {
  try {
    if (!reviewId) throw new Error('Review Id is required');
    const userId = getIdFromToken();

    if (!userId) throw new Error('User Id is required');
    setLoadingMessage(true);

    const { data: userReviewIdsData, error: userReviewIdsDataError } =
      (await fetchGraphqlClientAuthenticated(
        getUserReviewsQuery({ userId })
      )) as GetUserReviewsType;

    if (
      !userReviewIdsData?.usersPermissionsUser?.data?.attributes
        ?.reviews?.data ||
      userReviewIdsData?.usersPermissionsUser?.data?.attributes
        ?.reviews?.data.length === 0 ||
      userReviewIdsDataError
    ) {
      console.error(
        'Failed to get user reviews:',
        userReviewIdsDataError
      );
      setErrorMessage(errorMessage);
      return null;
    }

    const userReviewIds =
      userReviewIdsData.usersPermissionsUser.data.attributes.reviews.data
        .map((review) => review.id)
        .filter((itemReviewId) => reviewId !== itemReviewId);

    const { data: successReturnUserIdData, error: userIdError } =
      (await fetchGraphqlClientAuthenticated(
        removeReviewFromUserQuery({
          userId,
          reviews: userReviewIds.length > 0 ? userReviewIds : null
        })
      )) as RemoveReviewFromUserType;

    if (
      !successReturnUserIdData?.updateUser?.data?.id ||
      userIdError
    ) {
      console.error(
        'Failed to remove review from user:',
        userIdError
      );
      setErrorMessage(errorMessage);
      return null;
    }

    const { data: deletedReviewData, error: deletedReviewError } =
      (await fetchGraphqlServerWebAuthenticated(
        deleteReviewQuery({
          reviewId
        })
      )) as DeleteReviewType;

    if (
      !deletedReviewData?.deleteReview?.data?.id ||
      deletedReviewError
    ) {
      console.error('Failed to delete review:', userIdError);
      setErrorMessage(errorMessage);
      return null;
    }

    setSuccessMessage(successMessage);
    return deletedReviewData.deleteReview.data.id;
  } catch (error) {
    console.error('Failed to delete review:', error);
    setErrorMessage(errorMessage);
    return null;
  } finally {
    setLoadingMessage(false);
  }
}

const updateReviewQuery = ({
  reviewId,
  rating,
  headline,
  comment,
  likes,
  reportAbuses,
  updateLikes,
  updateReportAbuse
}: Partial<ReviewFormdataType> & {
  reviewId: string | null;
  likes?:
    | {
        id: string;
      }[]
    | null;
  reportAbuses?:
    | {
        user: {
          data: {
            id: string;
          };
        };
        issue_type: 'off-topic' | 'inappropriate' | 'fake' | 'other';
      }[]
    | null;
  updateLikes?: boolean;
  updateReportAbuse?: boolean;
}) => {
  let dataInput = '';
  const dataStr =
    rating && headline && comment ?
      `rating: ${rating}, headline: "${headline}", comment: "${comment}", publishedAt: "${new Date().toISOString()}"`
    : null;

  if (dataStr) {
    dataInput += dataStr;
  }

  const likesStr =
    likes && likes.length > 0 ?
      `likes: [${likes
        .map((like) => like?.id ?? null)
        .filter((likeExist) => likeExist)
        .join(', ')}]`
    : null;

  if (updateLikes) {
    if (likesStr) {
      dataInput += likesStr;
    } else {
      dataInput += `likes: null`;
    }
  }

  const reportAbuseStr =
    reportAbuses && reportAbuses.length > 0 ?
      `[${reportAbuses
        .map((report) =>
          report?.user?.data?.id && report?.issue_type ?
            `{
              user: "${report.user.data.id}",
              issue_type: ${report.issue_type}
            }`
          : null
        )
        .filter((reportExist) => reportExist)
        .join(', ')}]`
    : null;

  if (updateReportAbuse) {
    if (reportAbuseStr) {
      dataInput += `report_abuse: ${reportAbuseStr}`;
    } else {
      dataInput += `report_abuse: []`;
    }
  }

  return `mutation UpdateReview {
    updateReview(
        id: ${reviewId ? `"${reviewId}"` : null}
        data: { ${dataInput} }
    ) {
        data {
            id
        }
    }
  }`;
};

export const updateReview = async ({
  setSuccessMessage,
  setErrorMessage,
  setLoadingMessage,
  reviewFormdata,
  reviewId,
  errorMessage,
  userNotFoundMessage,
  successMessage,
  likes,
  reportAbuses,
  updateLikes = false,
  updateReportAbuse = false
}: {
  setSuccessMessage?: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setErrorMessage?: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setLoadingMessage?: React.Dispatch<React.SetStateAction<boolean>>;
  reviewFormdata?: ReviewFormdataType;
  reviewId: string | null;
  errorMessage?: string;
  userNotFoundMessage?: string;
  successMessage?: string;
  likes?:
    | {
        id: string;
      }[]
    | null;
  reportAbuses?:
    | {
        user: {
          data: {
            id: string;
          };
        };
        issue_type: 'off-topic' | 'inappropriate' | 'fake' | 'other';
      }[]
    | null;
  updateLikes?: boolean;
  updateReportAbuse?: boolean;
}) => {
  try {
    if (setLoadingMessage) setLoadingMessage(true);

    const userId = getIdFromToken();
    if (!userId) throw new Error(userNotFoundMessage);

    const { data: updatedReviewData, error: updatedReviewError } =
      (await fetchGraphqlServerWebAuthenticated(
        updateReviewQuery({
          ...reviewFormdata,
          reviewId,
          likes,
          updateLikes,
          reportAbuses,
          updateReportAbuse
        })
      )) as updateReviewType;

    if (
      !updatedReviewData?.updateReview?.data?.id ||
      updatedReviewError
    ) {
      console.error(errorMessage, updatedReviewError);
      if (setErrorMessage && errorMessage)
        setErrorMessage(errorMessage);
      return null;
    }

    if (setSuccessMessage && successMessage)
      setSuccessMessage(successMessage);
    return updatedReviewData.updateReview.data.id;
  } catch (e: any) {
    console.error(errorMessage, e);
    if (setErrorMessage && errorMessage)
      setErrorMessage(e?.message || e || errorMessage);
    return null;
  } finally {
    if (setLoadingMessage) setLoadingMessage(false);
  }
};
