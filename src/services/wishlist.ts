import {
  createWishlistLocalizationResponseType,
  GetWishlistDataType,
  WishlistResponseType,
  WishlistsDataType
} from '@/types/wishlistReponseTypes';
import {
  doesCookieByNameExist,
  getCookie,
  getIdFromToken,
  setCookie
} from '@/utils/cookieUtils';
import { fetchGraphqlClient } from './graphqlCrud';
import {
  getCreateWishlistLocalizationQuery,
  getCreateWishlistQuery,
  getWishlistDataQuery
} from './headerQueries';
import { handleGuestUserAuthentication } from './user';

const saveAndCreateWishlistIdsInCookie = async (arId: string) => {
  try {
    const {
      data: wishlistLocalizationData,
      error: wishlistLocalizationError
    } = (await fetchGraphqlClient(
      getCreateWishlistLocalizationQuery(arId)
    )) as createWishlistLocalizationResponseType;

    const localeFirstId =
      wishlistLocalizationData?.createWishlistLocalization?.data
        ?.id ?? null;
    const localeNameFirst =
      wishlistLocalizationData?.createWishlistLocalization?.data
        ?.attributes?.locale ?? null;

    // Check if localizations data is not null
    const localizations =
      wishlistLocalizationData?.createWishlistLocalization?.data
        ?.attributes?.localizations?.data;

    let localeSecondId: string | null = null;
    let localeNameSecond: string | null = null;

    if (localizations && localizations.length > 0) {
      localeSecondId = localizations[0]?.id ?? null;
      localeNameSecond = localizations[0]?.attributes?.locale ?? null;
    }

    if (
      wishlistLocalizationError ||
      !localeFirstId ||
      !localeNameFirst ||
      !localeSecondId ||
      !localeNameSecond
    ) {
      console.error(
        'Failed to create wishlist translations',
        wishlistLocalizationError
      );
      return;
    }
    const wishlist = {
      [localeNameFirst]: localeFirstId,
      [localeNameSecond]: localeSecondId
    };
    setCookie('wishlistIds', JSON.stringify(wishlist));
  } catch (err) {
    console.error('Failed to create wishlist translations', err);
  }
};

export const createWishlistInTheBackend = async (
  guestUserId: string | null,
  userId: string | null
) => {
  try {
    const { data: wishlistData, error: wishlistError } =
      (await fetchGraphqlClient(
        getCreateWishlistQuery(guestUserId, userId)
      )) as WishlistResponseType;

    if (wishlistError || !wishlistData?.createWishlist?.data?.id) {
      console.error('Failed to create wishlist');
      return;
    }

    // if (wishlistData?.createWishlist?.data?.id) {
    //   setCookie(
    //     'wishlistId',
    //     wishlistData?.createWishlist?.data?.id
    //   );
    // }
    saveAndCreateWishlistIdsInCookie(
      wishlistData?.createWishlist?.data?.id
    );
  } catch (e) {
    console.error('Failed to create wishlist', e);
  }
};

export const getWishlistsData = async (
  locale: string,
  setIsWishlistLoading: React.Dispatch<React.SetStateAction<boolean>>
  //   setWishlistsData: React.Dispatch<
  //     React.SetStateAction<WishlistsDataType>
  //   >
) => {
  try {
    setIsWishlistLoading(true);
    const wishlistIds = getCookie('wishlistIds');

    let wishlistIdsValue: { en: string; ar: string } | null = null;
    if (wishlistIds) {
      wishlistIdsValue = JSON.parse(wishlistIds);
    }

    let passedArgId: string = '';
    if (wishlistIdsValue) {
      passedArgId =
        locale === 'ar' ? wishlistIdsValue.ar : wishlistIdsValue.en;
    }

    // const wishlitsId = locale === 'ar' ? JSON.parse(wishlistIds)
    const { data: wishlistsData, error: wishlistsError } =
      (await fetchGraphqlClient(
        getWishlistDataQuery(passedArgId)
      )) as GetWishlistDataType;

    if (
      wishlistsError ||
      !wishlistsData?.wishlist?.data?.attributes?.products?.data
    ) {
      console.error(
        'Error fetching wishlists data: ',
        wishlistsError
      );
      return null;
    }

    return wishlistsData.wishlist.data.attributes.products.data;
  } catch (err) {
    console.error('Error fetching wishlist data: ', err);
    return null;
  } finally {
    setIsWishlistLoading(false);
  }
};

export const fetchWishlistData = async ({
  locale,
  setIsWishlistLoading,
  setWishlistsData
}: {
  locale: string;
  setIsWishlistLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setWishlistsData: React.Dispatch<
    React.SetStateAction<WishlistsDataType>
  >;
}) => {
  try {
    const userId = getIdFromToken();

    const guestUserIdAuthenticated =
      await handleGuestUserAuthentication();

    const wishlistIdExists = doesCookieByNameExist('wishlistIds');
    if (!wishlistIdExists) {
      // const guestUserId = getCookie('guestUserId');

      await createWishlistInTheBackend(
        guestUserIdAuthenticated,
        userId
      );
    } else {
      const wishlistEnData = await getWishlistsData(
        'en',
        setIsWishlistLoading
        // setWishlistsData
      );
      const wishlistArData = await getWishlistsData(
        'ar',
        setIsWishlistLoading
        // setWishlistsData
      );

      if (!wishlistArData || !wishlistEnData) {
        await createWishlistInTheBackend(
          guestUserIdAuthenticated,
          userId
        );
        const data = await getWishlistsData(
          locale,
          setIsWishlistLoading
          //   setWishlistsData
        );
        if (data) {
          setWishlistsData(data);
        } else {
          setWishlistsData([]);
        }
      }

      const localeWishlistData = await getWishlistsData(
        locale,
        setIsWishlistLoading
        // setWishlistsData
      );
      if (localeWishlistData) {
        setWishlistsData(localeWishlistData);
      } else {
        setWishlistsData([]);
      }
    }
  } catch (error) {}
};
