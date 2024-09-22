import { Link } from '@/navigation';
import ConfigAos from '../Theme/ConfigAos';
import ArticleCard from '../UI/articles/ArticleCard';
import SectionHeading from '../UI/SectionHeading';
import { FeaturedBlogsSectionType } from '@/types/getHomePageTypes';
import { truncateSentence } from '@/utils/helpers';
import { useLocale, useTranslations } from 'next-intl';
import {
  FaLongArrowAltLeft,
  FaLongArrowAltRight
} from 'react-icons/fa';
// import { FaLongArrowAltRight } from 'react-icons/fa';

interface PropsType {
  data: FeaturedBlogsSectionType;
}

function Articles({ data }: PropsType) {
  const t = useTranslations('HomePage.articles');
  const locale = useLocale();
  return (
    <ConfigAos>
      <section className='max-w-[1900px] bg-white py-[50px]'>
        <div className='container'>
          <div
            data-aos='fade-down'
            data-aos-delay='50'
            data-aos-duration='400'
            data-aos-easing='ease-out'
            data-aos-once='true'
          >
            <SectionHeading>
              <span>{data?.heading_in_black ?? ''}</span>
              <span className='ml-2 text-red-shade-350'>
                {data?.heading_in_red ?? ''}
              </span>
            </SectionHeading>
          </div>

          <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid-rows-1 gap-8'>
            <div
              data-aos='fade-left'
              data-aos-delay='100'
              data-aos-duration='400'
              data-aos-easing='ease-out'
              data-aos-once='true'
            >
              <ArticleCard
                imgSrc={
                  data?.blogs?.data[0]?.attributes?.image?.data
                    ?.attributes?.url ?? ''
                }
                alt={
                  data?.blogs?.data[0]?.attributes?.image?.data
                    ?.attributes?.alternativeText ?? ''
                }
                articleUrl={`/blog/${data?.blogs?.data[0]?.id}`}
                content={{
                  categories:
                    data?.blogs?.data[0]?.attributes?.tags?.data?.map(
                      (tag) => ({
                        linkUrl: tag?.attributes?.slug ?? '/',
                        linkText: tag?.attributes?.name
                      })
                    ),
                  title:
                    data?.blogs?.data[0]?.attributes?.title ?? '',
                  description: truncateSentence(
                    data?.blogs?.data[0]?.attributes
                      ?.card_description ?? '',
                    150
                  ),
                  publishDate:
                    data?.blogs?.data[0]?.attributes?.createdAt,
                  publisher:
                    data?.blogs?.data[0]?.attributes?.author?.data
                      ?.attributes?.name ?? ''
                }}
              />
            </div>
            <div
              // data-aos='fade-up'
              // data-aos-delay='600'
              data-aos='fade-left'
              data-aos-delay='250'
              data-aos-duration='400'
              data-aos-easing='ease-out'
              data-aos-once='true'
            >
              <ArticleCard
                imgSrc={
                  data?.blogs?.data[1]?.attributes?.image?.data
                    ?.attributes?.url ?? ''
                }
                alt={
                  data?.blogs?.data[1]?.attributes?.image?.data
                    ?.attributes?.alternativeText ?? ''
                }
                articleUrl={`/blog/${data?.blogs?.data[1]?.id}`}
                content={{
                  categories:
                    data?.blogs?.data[1]?.attributes?.tags?.data?.map(
                      (tag) => ({
                        linkUrl: tag?.attributes?.slug ?? '/',
                        linkText: tag?.attributes?.name
                      })
                    ),
                  title:
                    data?.blogs?.data[1]?.attributes?.title ?? '',
                  description: truncateSentence(
                    data?.blogs?.data[1]?.attributes
                      ?.card_description ?? '',
                    150
                  ),
                  publishDate:
                    data?.blogs?.data[1]?.attributes?.createdAt,
                  publisher:
                    data?.blogs?.data[1]?.attributes?.author?.data
                      ?.attributes?.name ?? ''
                }}
              />
            </div>
            <div
              data-aos='fade-left'
              data-aos-delay='400'
              data-aos-duration='400'
              data-aos-easing='ease-out'
              data-aos-once='true'
            >
              <ArticleCard
                imgSrc={
                  data?.blogs?.data[2]?.attributes?.image?.data
                    ?.attributes?.url ?? ''
                }
                alt={
                  data?.blogs?.data[2]?.attributes?.image?.data
                    ?.attributes?.alternativeText ?? ''
                }
                articleUrl={`/blog/${data?.blogs?.data[2]?.id}`}
                content={{
                  categories:
                    data?.blogs?.data[2]?.attributes?.tags?.data?.map(
                      (tag) => ({
                        linkUrl: tag?.attributes?.slug ?? '/',
                        linkText: tag?.attributes?.name
                      })
                    ),
                  title:
                    data?.blogs?.data[2]?.attributes?.title ?? '',
                  description: truncateSentence(
                    data?.blogs?.data[2]?.attributes
                      ?.card_description ?? '',
                    150
                  ),
                  publishDate:
                    data?.blogs?.data[2]?.attributes?.createdAt,
                  publisher:
                    data?.blogs?.data[2]?.attributes?.author?.data
                      ?.attributes?.name ?? ''
                }}
              />
            </div>
          </div>

          <div
            data-aos='fade-up'
            data-aos-delay='50'
            data-aos-duration='400'
            data-aos-easing='ease-out'
            data-aos-once='true'
          >
            <Link
              href='/'
              className='mx-auto mt-8 flex w-fit items-center gap-3 text-base font-medium text-blue-gray-light transition-colors duration-300 hover:text-yellow-medium'
            >
              <span>{t('allPostsButton')}</span>
              {locale == 'ar' ?
                <FaLongArrowAltLeft size={20} className='mt-.5' />
              : <FaLongArrowAltRight size={20} className='mt-.5' />}
            </Link>
          </div>
        </div>
      </section>
    </ConfigAos>
  );
}

export default Articles;
