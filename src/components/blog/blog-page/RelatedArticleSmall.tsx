import { Link } from '@/navigation';
import { RelatedSidebarBlogType } from '@/types/getBlogPageResponse';
import { convertToMinutes } from '@/utils/dateHelpers';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

async function RelatedArticleSmall({
  relatedBlogData
}: {
  relatedBlogData: RelatedSidebarBlogType;
}) {
  const t = await getTranslations(
    'BlogPage.child.content.relatedArticle'
  );
  const articleHref =
    relatedBlogData?.id ?
      `/blog/${relatedBlogData.id}`
    : 'blog/page/1';

  const readTime = convertToMinutes(
    relatedBlogData?.attributes?.read_time
  );

  return (
    <article className='flex w-full gap-5'>
      <Link href={articleHref}>
        <Image
          src={
            relatedBlogData?.attributes?.image_card?.data?.attributes
              ?.formats?.thumbnail?.url ?? '/image-not-found.png'
            // relatedBlogData?.attributes?.image_card?.data?.attributes
            //   ?.url ?? '/image-not-found.png'
          }
          alt={
            relatedBlogData?.attributes?.image_card?.data?.attributes
              ?.alternativeText ??
            (t('imageAltFallback') || '')
          }
          width={100}
          height={100}
          quality={100}
          className='min-h-[100px] min-w-[100px] rounded-lg object-cover'
        />
      </Link>
      <div className='grow'>
        <h4 className='mb-2 text-lg font-bold leading-5 text-gray-900'>
          <Link href={articleHref}>
            {relatedBlogData?.attributes?.short_title ?? ''}
          </Link>
        </h4>
        <p className='mb-1.5 overflow-hidden text-base text-gray-500'>
          {relatedBlogData?.attributes?.short_description ?? ''}
        </p>
        {readTime !== '-' && (
          <Link
            href={articleHref}
            className='inline-flex items-center text-sm font-medium text-blue-sky-medium underline underline-offset-4 hover:text-blue-sky-accent hover:no-underline'
          >
            {Number(readTime) > 1 ?
              t('readInMinutes', { minutes: readTime })
            : t('readInMinute', { minute: readTime })}
          </Link>
        )}
      </div>
    </article>
  );
}

export default RelatedArticleSmall;
