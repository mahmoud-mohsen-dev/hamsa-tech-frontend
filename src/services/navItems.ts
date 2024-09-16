import axiosInstance from './axio';

export const getNavbarItems = async (locale: string) => {
  try {
    // const response = await fetch(
    //   `${process.env.BASE_URL}/api/pages?locale=${locale ?? 'en'}&populate=*`
    // );
    const response = await axiosInstance.get(
      `/api/pages?locale=${locale ?? 'en'}&populate=*`
    );
    console.log(response.data);
    return { data: response.data, error: null };
  } catch (e) {
    console.error('Error fetching data:', e);
    return { data: null, error: e };
  }
};
