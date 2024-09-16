import {
  NavbarLinkDataResponse,
  ResponseGetNavbarLinksService,
  ResponseStrapiError
} from '@/types/getNavItems';
import axiosInstance from './axio';

export const getNavbarItems = async (locale: string) => {
  try {
    // const response = await fetch(
    //   `${process.env.BASE_URL}/api/pages?locale=${locale ?? 'en'}&populate=*`
    // );
    const response: ResponseGetNavbarLinksService =
      await axiosInstance.get(
        `/api/pages?locale=${locale ?? 'en'}&populate=*`
      );
    return { data: response.data, error: null };
  } catch (e) {
    const error = e as ResponseStrapiError;
    console.error('Error fetching data:', e);
    return { data: null, error: error.message };
  }
};
