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
// import Partners from '@/components/home/Partners';

interface PropsType {
  params: { locale: string };
}

export default async function IndexPage({
  params: { locale }
}: PropsType) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  // const t = useTranslations('IndexPage');
  const { data: heroData, error: heroError } =
    await getHomePageData(locale);
  // console.log('=8'.repeat(20));
  // console.error('home page data');
  // console.error(locale);
  // console.error(error);
  // console.error(homePageData?.attributes.heroSection);
  // console.log('='.repeat(20));

  if (heroError || heroData === null) {
    return <p className='mt-24'>Error fetching hero section data</p>;
    // return <NotFoundPage />;
  }

  return (
    <>
      {heroData?.attributes.heroSection && (
        <HeroSection data={heroData?.attributes.heroSection} />
      )}
    </>
  );
}
