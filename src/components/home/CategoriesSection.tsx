import EmblaCarousel from '@/components/UI/embla/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel';
import HeadingSection from '../UI/HeadingSection';
import { CategoriesSectionType } from '@/types/getHomePageTypes';
import { useLocale } from 'next-intl';

interface PropsType {
  data: CategoriesSectionType;
}

function CategoriesSection({ data }: PropsType) {
  const locale = useLocale();
  const OPTIONS: EmblaOptionsType = {
    dragFree: true,
    loop: false,
    direction: locale === 'ar' ? 'rtl' : 'ltr',
    slidesToScroll: 'auto',
    duration: 20
  };
  const SLIDES = data.category.map((category) => {
    return {
      title: category.title,
      details: category.description,
      imgSrc: category.image.data.attributes.url,
      alt: category.image.data.attributes.alternativeText ?? '',
      slug: category?.slug ?? '/'
    };
  });

  return (
    <section className='mx-auto max-w-[1900px] bg-white py-20'>
      <div className='categories'>
        <div
          data-aos='fade-down'
          data-aos-delay='50'
          data-aos-duration='400'
          data-aos-easing='ease-out'
          data-aos-once='true'
        >
          <HeadingSection subHeading={data?.description ?? ''}>
            <p>{data?.heading_in_black ?? ''}</p>
            <p className='text-red-shade-350'>
              {data?.heading_in_red ?? ''}
            </p>
          </HeadingSection>
        </div>
        <div
          data-aos='fade-up'
          data-aos-delay='150'
          data-aos-duration='400'
          data-aos-easing='ease-out'
          data-aos-once='true'
        >
          <EmblaCarousel slides={SLIDES} options={OPTIONS} href='/' />
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
