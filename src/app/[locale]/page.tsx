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

export const revalidate = 3600; // invalidate every hour

export default async function IndexPage({
  params: { locale }
}: PropsType) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const { data: heroData, error: heroError } =
    await getHomePageData(locale);

  if (heroError || heroData === null) {
    return (
      <p className='font-semiboldbold container mt-40 text-center text-xl text-black-light'>
        {heroError ??
          'Error fetching hero section data. Please try again later.'}
      </p>
    );
  }

  return (
    <>
      {heroData.attributes.heroSection && (
        <HeroSection data={heroData.attributes.heroSection} />
      )}
    </>
  );
}
