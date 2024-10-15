// import { getIdFromToken } from '@/utils/cookieUtils';
import { fetchGraphqlClientAuthenticated } from './graphqlCrud';
import { GetOrdersAuthenticatedResponse } from '@/types/orderResponseTypes';

const getOrdersQuery = ({
  page,
  userId
}: {
  page: number;
  userId: string;
}) => {
  return `{
    orders(pagination: { page: ${page}, pageSize: 10 }, filters: { user: {id: {eq: "${userId}"}} }) {
        data {
            id
            attributes {
                delivery_status
                payment_status
                total_order_cost
                payment_method
                createdAt
                user {
                    data {
                        id
                    }
                }
            }
        }
        meta {
            pagination {
                total
                page
                pageSize
                pageCount
            }
        }
    }
  }`;
};

export const getOrdersAuthenticated = async (
  page: number,
  userId: string
) => {
  try {
    // let userId = '';
    // await setTimeout(() => {
    //   userId = getIdFromToken() ?? '';
    // }, 0);
    // const userId = (await Promise.resolve(getIdFromToken())) ?? '';

    const { data, error } = (await fetchGraphqlClientAuthenticated(
      getOrdersQuery({ page, userId })
    )) as GetOrdersAuthenticatedResponse;

    if (!error && data?.orders?.data && data.orders.data.length > 0) {
      return data.orders;
    }

    console.error('Failed to fetch orders', error);
    return null;
  } catch (error) {
    console.error('Failed to fetch orders', error);
    return null;
  }
};
