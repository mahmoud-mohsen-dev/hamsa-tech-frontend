import { ResponseStrapiError } from '@/types/getNavItems';
import axiosInstance from './axio';
import { StrapiResponseForHomePage } from '@/types/getHomePageTypes';
import { fetchWithCache } from './cache';

export const getHomePageData = async (locale: string) => {
  try {
    // const response: AxiosResponseForHomePage =
    //   await axiosInstance.get(
    //     `/api/pages?filters[slug][$eq]=/&locale=${locale ?? 'en'}&populate[heroSection][populate]=*`
    //   );

    // const response: StrapiResponseForHomePage = await fetchWithCache(
    //   `/api/pages?filters[slug][$eq]=/&locale=${locale ?? 'en'}&populate[heroSection][populate]=*`
    // );
    const response = await fetch(
      `${process.env.API_BASE_URL}/api/pages?filters[slug][$eq]=/&locale=${locale ?? 'en'}&populate[heroSection][populate]=*`
    );
    const data: StrapiResponseForHomePage = await response.json();

    if (!response.ok) {
      throw new Error(
        'Error fetching hero section data. Please try again later.'
      );
    }

    console.log('=-='.repeat(5));
    console.log('response from home page service');
    console.log(data ?? null);
    console.log('=-='.repeat(5));
    return { data: data.data[0] ?? null, error: null };
  } catch (e) {
    // const error = e as ResponseStrapiError;
    console.error('Error fetching data:', e);
    return {
      data: null,
      error:
        'Error fetching hero section data. Please try again later.'
    };
  }
};
