import {
  NavbarLinkDataResponse,
  ResponseGetNavbarLinksService,
  ResponseStrapiError
} from '@/types/getNavItems';
import axiosInstance from './axio';
import { fetchWithCache } from './cache';

export const getNavbarItems = async (locale: string) => {
  try {
    const response = await fetchWithCache(
      `/api/pages?locale=${locale ?? 'en'}&populate[0]=name&populate[1]=slug&populate[navbar]=*`
      // { revalidate: 60000 }
    );
    // const response: ResponseGetNavbarLinksService =
    //   await axiosInstance.get(
    //     `/api/pages?locale=${locale ?? 'en'}&populate[0]=name&populate[1]=slug&populate[navbar]=*`
    //   );

    console.log('=-='.repeat(5));
    console.log('response from navItem service');
    console.log(JSON.stringify(response));
    console.log('=-='.repeat(5));
    return { data: response, error: null };
  } catch (e) {
    const error = e as ResponseStrapiError;
    console.error('Error fetching data:', e);
    return { data: null, error: error.message };
  }
};
