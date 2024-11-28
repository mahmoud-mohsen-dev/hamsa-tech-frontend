import { getIdFromToken } from '@/utils/cookieUtils';
import {
  fetchGraphqlClientAuthenticated,
  fetchGraphqlServerAuthenticated
} from './graphqlCrud';
import { fetchGraphqlServerWebAuthenticated } from './graphqlCrudServerOnly';
import revalidateProductLayoutPage from '@/app/action';

interface createReviewData {
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
}: createReviewData) => {
  return `mutation CreateReview {
        createReview(
            data: {
                rating: ${rating}
                headline: "${headline}"
                comment: "${comment}"
                likes: 0
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
  reviewFormdata: createReviewData,
  productIds: { arId: string | null; enId: string | null }
) => {
  try {
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
