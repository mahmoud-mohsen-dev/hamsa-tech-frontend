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

export const revalidate = 120; // invalidate every hour

export default async function IndexPage({
  params: { locale }
}: PropsType) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const heroResponse = await fetch(
    `${process.env.API_BASE_URL}/api/pages?filters[slug][$eq]=/&locale=${locale ?? 'en'}&populate[heroSection][populate]=*`
  );
  if (!heroResponse.ok) {
    console.error(
      'Error fetching hero section data. Please try again later.'
    );
  }
  const heroData: StrapiResponseForHomePage =
    await heroResponse.json();

  // const { data: heroData, error: heroError } =
  //   await getHomePageData(locale);
  console.log('hero section data');
  console.log(JSON.stringify(heroData));

  return (
    <>
      {(heroData.error || heroData.data === null) && (
        <p className='font-semiboldbold container mt-40 text-center text-xl text-black-light'>
          Error fetching hero section data. Please try again later.
        </p>
      )}
      {heroData.data[0].attributes.heroSection && (
        <HeroSection data={heroData.data[0].attributes.heroSection} />
      )}
    </>
  );
}
