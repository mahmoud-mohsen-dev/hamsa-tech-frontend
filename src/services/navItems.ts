import {
  ResponseGetNavbarLinksService,
  ResponseStrapiError
} from '@/types/getNavItems';
import axiosInstance from './axio';
import { fetchWithCache } from './cache';

export const getNavbarItems = async (locale: string) => {
  try {
    const response: ResponseGetNavbarLinksService = await fetch(
      `${process.env.API_BASE_URL}/api/pages?locale=${locale ?? 'en'}&populate[0]=name&populate[1]=slug&populate[navbar]=*`
    ).then((response) => response.json());

    console.log('=-='.repeat(5));
    console.log('response from navItem service');
    console.log(JSON.stringify(response));
    console.log('=-='.repeat(5));
    return { data: response.data, error: null };
  } catch (e) {
    const error = e as ResponseStrapiError;
    console.error('Error fetching data:', e);
    return {
      data: null,
      error: error?.message ?? 'Error fetching data'
    };
  }
};
