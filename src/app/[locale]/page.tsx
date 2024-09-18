// import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
// import PageLayout from '@/components-old/PageLayout';

// import AboutUs from '@/components/home/AboutUs';
// import Articles from '@/components/home/Articles';
// import CategoriesSection from '@/components/home/CategoriesSection';
// import ContactUs from '@/components/home/ContactUs';
// import FeaturedSection from '@/components/home/FeaturedSection';
import HeroSection from '@/components/home/HeroSection';
import { getHomePageData } from '@/services/homePage';
import { StrapiResponseForHomePage } from '@/types/getHomePageTypes';

interface PropsType {
  params: { locale: string };
}

export const revalidate = 60; // Revalidate the cache every 60 seconds

export default async function IndexPage({
  params: { locale }
}: PropsType) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  try {
    const response: StrapiResponseForHomePage = await fetch(
      `${process.env.API_BASE_URL}/api/pages?filters[slug][$eq]=/&locale=${locale ?? 'en'}&populate[heroSection][populate]=*`
    ).then((response) => response.json());

    const { data: heroData, error: heroError } = response;

    if (heroError || heroData === null) {
      throw new Error('Error fetching hero section data');
    }

    return (
      <>
        {heroData[0].attributes.heroSection && (
          <HeroSection data={heroData[0].attributes.heroSection} />
        )}
      </>
    );
  } catch (error) {
    // Log error for debugging
    console.error('Error:', error);

    // Return a friendly message or component for users
    return (
      <p className='font-semiboldbold container mt-40 text-center text-xl text-black-light'>
        Error fetching hero section data. Please try again later.
      </p>
    );
  }
}
