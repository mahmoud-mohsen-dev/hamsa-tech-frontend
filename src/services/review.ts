import { getIdFromToken } from '@/utils/cookieUtils';
import {
  fetchGraphqlClientAuthenticated,
} from './graphqlCrud';
import { fetchGraphqlServerWebAuthenticated } from './graphqlCrudServerOnly';
import revalidateProductLayoutPage from '@/app/action';
import {
  DeleteReviewType,
  GetUserReviewsType,
  GetUserReviewType,
  RemoveReviewFromUserType,
  updateReviewType
} from '@/types/reviewsResponses';

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
                publishedAt: "${new Date().toISOString()}"
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
  productIds: { arId: string | null; enId: string | null }
) => {
  try {
    setLoadingMessage(true);
    const { data, error } = await fetchGraphqlClientAuthenticated(
      createReviewQuery(reviewFormdata)
    );

    console.log(data);
    console.log(error);

    if (!data?.createReview?.data?.id || error) {
      console.error('Failed to create a review:', error);
      setErrorMessage('Failed to create a review');
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

    console.log(updatedReviewData);
    console.log(updatedReviewError);
    if (
      !updatedReviewData?.updateReview?.data?.id ||
      updatedReviewError
    ) {
      console.error('Failed to update a review:', updatedReviewError);
      setErrorMessage('Failed to create a review');
      return null;
    }

    revalidateProductLayoutPage({ products: productIds });

    setSuccessMessage('Review was successfully created');
    // return data.createReview.data.id;
    return updatedReviewData.updateReview.data.id as string;
  } catch (e) {
    console.error('Failed to create a review:', e);
    setErrorMessage('Failed to create a review');
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

const getUserReviewIdQuery = ({
  userId,
  reviewId
}: {
  userId: string | null;
  reviewId: string | null;
}) => {
  return `query UsersPermissionsUser {
    usersPermissionsUser(id: ${userId ? `"${userId}"` : null}) {
        data {
            attributes {
                reviews(filters: { id: { eq: ${reviewId ? `"${reviewId}"` : null} } }) {
                    data {
                        id
                    }
                }
            }
        }
    }
  }`;
};

const updateReviewQuery = ({
  reviewId,
  rating,
  headline,
  comment
}: ReviewFormdataType & { reviewId: string | null }) => {
  return `mutation UpdateReview {
    updateReview(
        id: ${reviewId ? `"${reviewId}"` : null}
        data: { rating: ${rating}, headline: "${headline ?? ''}", comment: "${comment ?? ''}" }
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
  errorNotFoundMessage,
  successMessage
}: {
  setSuccessMessage: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setLoadingMessage: React.Dispatch<React.SetStateAction<boolean>>;
  reviewFormdata: ReviewFormdataType;
  reviewId: string | null;
  errorMessage: string;
  errorNotFoundMessage: string;
  successMessage: string;
}) => {
  try {
    setLoadingMessage(true);

    const userId = getIdFromToken();
    const { data: userReviewData, error: userReviewError } =
      (await fetchGraphqlClientAuthenticated(
        getUserReviewIdQuery({ reviewId, userId })
      )) as GetUserReviewType;

    if (
      !Array.isArray(
        userReviewData?.usersPermissionsUser?.data?.attributes
          ?.reviews?.data
      ) ||
      !userReviewData?.usersPermissionsUser?.data?.attributes?.reviews
        ?.data[0]?.id ||
      userReviewError
    ) {
      console.error('Failed to get user review:', userReviewError);
      setErrorMessage(errorNotFoundMessage);
      return null;
    }

    const { data: updatedReviewData, error: updatedReviewError } =
      (await fetchGraphqlServerWebAuthenticated(
        updateReviewQuery({ ...reviewFormdata, reviewId })
      )) as updateReviewType;

    if (
      !updatedReviewData?.updateReview?.data?.id ||
      updatedReviewError
    ) {
      console.error(errorMessage, updatedReviewError);
      setErrorMessage(errorMessage);
      return null;
    }

    setSuccessMessage(successMessage);
    return updatedReviewData.updateReview.data.id;
  } catch (e) {
    console.error(errorMessage, e);
    setErrorMessage(errorMessage);
    return null;
  } finally {
    setLoadingMessage(false);
  }
};
