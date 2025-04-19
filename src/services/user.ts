import { CreateGuestUserResponseType } from '@/types/guestUserReponses';
import { fetchGraphqlClient } from './graphqlCrud';
import {
  checkGuestUserIdExistQuery,
  createGuestUserQuery
} from './headerQueries';
import {
  getCookie,
  removeCookie,
  setCookie
} from '@/utils/cookieUtils';

export const handleCreateGuestUser = async () => {
  try {
    const { data: guestUserData, error: guestUserError } =
      (await fetchGraphqlClient(
        createGuestUserQuery()
      )) as CreateGuestUserResponseType;

    if (guestUserError || !guestUserData?.createGuestUser?.data?.id) {
      console.error('Failed to create guest user');
    }

    if (guestUserData?.createGuestUser?.data?.id) {
      setCookie('guestUserId', guestUserData.createGuestUser.data.id);
      return guestUserData.createGuestUser.data.id;
    } else {
      console.error('Failed to get guest user ID from API');
      removeCookie('guestUserId');
      return null;
    }
  } catch (e) {
    console.error('Failed to create guest user', e);
    removeCookie('guestUserId');
    return null;
  }
};

export const handleGuestUserAuthentication = async () => {
  const guestUserId = getCookie('guestUserId');
  if (!guestUserId) {
    const guestUserIdResult = await handleCreateGuestUser();
    return guestUserIdResult;
  } else {
    try {
      const { data, error } = await fetchGraphqlClient(
        checkGuestUserIdExistQuery(guestUserId)
      );
      if (error || !data?.guestUser?.data?.id) {
        console.error("Guest user don't exist", error);
        const guestUserIdResult = await handleCreateGuestUser();
        return guestUserIdResult;
      }

      return guestUserId;
    } catch (error) {
      console.error('server error when calling guset user', error);
      return null;
    }
  }
};
