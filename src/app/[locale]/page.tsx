// import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
// import PageLayout from '@/components-old/PageLayout';

// import AboutUs from '@/components/home/AboutUs';
// import Articles from '@/components/home/Articles';
// import CategoriesSection from '@/components/home/CategoriesSection';
// import ContactUs from '@/components/home/ContactUs';
// import FeaturedSection from '@/components/home/FeaturedSection';
import HeroSection from '@/components/home/HeroSection';
// import Partners from '@/components/home/Partners';

interface PropsType {
  params: { locale: string };
}

export default function IndexPage({ params: { locale } }: PropsType) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  // const t = useTranslations('IndexPage');

  return (
    <>
      <HeroSection />
    </>
  );
}
