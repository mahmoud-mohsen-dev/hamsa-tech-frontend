import { Link } from '@/navigation';
import { BlogDataType } from '@/types/getBlogPageResponse';
import { getLocale, getTranslations } from 'next-intl/server';
import Image from 'next/image';

async function HeaderBlogPageSection({
  blogData
}: {
  blogData: BlogDataType;
}) {
  const locale = await getLocale();
  const t = await getTranslations('BlogPage.child.content');

  const title = blogData?.attributes?.title ?? null;
  const imageHeader =
    blogData?.attributes?.image_header?.data?.attributes ?? null;

  const tags =
    (
      Array.isArray(blogData?.attributes?.tags?.data) &&
      blogData?.attributes?.tags?.data.length > 0
    ) ?
      blogData?.attributes?.tags?.data
        .map((tag) => ({
          name: tag?.attributes?.name ?? null,
          slug: tag?.attributes?.slug ?? null
        }))
        .filter((tag) => tag?.name !== null && tag?.slug !== null)
    : null;

  const isArabic = locale === 'ar';

  // console.log(tags);
  const tagsStr =
    tags ?
      tags.map((tag, i, arr) => {
        if (arr.length - 2 === i && arr.length > 1) {
          return (
            <span
              key={tag.slug}
              className={`${isArabic ? 'ml-2' : 'mr-2'} inline-flex items-center gap-2`}
            >
              <Link href={`/blog/tags/${tag.slug}`}>{tag.name}</Link>
              {isArabic ? 'و' : ' and'}
            </span>
          );
        }

        return arr.length - 1 !== i && arr.length > 1 ?
            <Link
              key={tag.slug}
              href={`/blog/tags/${tag.slug}`}
              className={`${isArabic ? 'ml-2' : 'mr-2'} inline-block`}
            >
              {tag.name}
              {isArabic ? '،' : ','}
            </Link>
          : <Link
              key={tag.slug}
              href={`/blog/tags/${tag.slug}`}
              className={`${isArabic ? 'ml-2' : 'mr-2'} inline-block`}
            >
              {tag.name}
            </Link>;
      })
    : '';

  return (
    <header>
      <section className='relative h-[450px] w-full lg:h-[540px]'>
        <div className='absolute z-[2] h-full w-full bg-[rgba(20,19,19,0.55)]' />
        <Image
          src={imageHeader?.url ? imageHeader.url : ''}
          alt={
            imageHeader?.alternativeText ?
              imageHeader.alternativeText
            : ''
          }
          className='z-[1] object-cover'
          fill={true}
          quality={100}
        />

        <div className='container absolute bottom-36 left-1/2 z-[3] -translate-x-1/2'>
          <div className='mx-auto w-full max-w-screen-2xl'>
            <div className='sm:w-[85%]'>
              {tags && (
                <h3 className='flex items-center gap-2.5 text-white'>
                  {t('publishedIn')}
                  <span className='font-bold'>{tagsStr}</span>
                </h3>
              )}

              <h1 className='mt-2 text-2xl font-extrabold text-white lg:text-balance lg:text-4xl lg:leading-[2.7rem]'>
                {title}
              </h1>
            </div>
          </div>
        </div>
      </section>
    </header>
  );
}

export default HeaderBlogPageSection;
