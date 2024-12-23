import { Link } from '@/navigation';
import { RelatedFooterBlogType } from '@/types/getBlogPageResponse';
import { convertToMinutes } from '@/utils/dateHelpers';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

async function RelatedArticleLarge({
  data
}: {
  data: RelatedFooterBlogType;
}) {
  const t = await getTranslations(
    'BlogPage.child.content.relatedArticle'
  );
  const articleHref = data?.id ? data.id : '/blog/page/1';
  const readTime = convertToMinutes(data?.attributes?.read_time);

  return (
    <article className='max-w-xs text-center xl:text-start'>
      <Link href={articleHref} className='mx-auto inline-block w-fit'>
        <Image
          src={
            data?.attributes?.image_card?.data?.attributes?.url ??
            '/image-not-found.png'
          }
          alt={
            data?.attributes?.image_card?.data?.attributes
              ?.alternativeText ??
            (t('imageAltFallback') || '')
          }
          width={320}
          height={175}
          className='mb-5 h-[175px] w-[320px] rounded-lg object-cover'
        />
      </Link>
      <h2 className='mb-2 text-xl font-bold leading-tight text-gray-900'>
        <Link href={articleHref}>
          {data?.attributes?.short_title ?? ''}
        </Link>
      </h2>
      <p className='mb-4 text-pretty text-gray-500'>
        {data?.attributes?.short_description ?? ''}
      </p>
      {readTime !== '-' && (
        <Link
          href={articleHref}
          className='text-primary-600 inline-flex items-center font-medium underline underline-offset-4 hover:no-underline'
        >
          {Number(readTime) > 1 ?
            t('readInMinutes', { minutes: readTime })
          : t('readInMinute', { minute: readTime })}
        </Link>
      )}
    </article>
  );
}

export default RelatedArticleLarge;
