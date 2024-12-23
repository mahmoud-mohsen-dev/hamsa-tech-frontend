import { BlogDataType } from '@/types/getBlogPageResponse';
import { formatDateByLocale } from '@/utils/dateHelpers';
import { getLocale } from 'next-intl/server';

async function PublisherSection({
  blogData
}: {
  blogData: BlogDataType;
}) {
  const locale = await getLocale();
  const isArabic = locale === 'ar';
  const author =
    blogData?.attributes?.author?.data?.attributes ?? null;
  return (
    <section className='mb-4 lg:mb-6'>
      <address className='mb-6 flex items-center not-italic'>
        <div
          className={`${isArabic ? 'ml-3' : 'mr-3'} inline-flex items-center text-sm text-gray-900`}
        >
          <img
            className={`${isArabic ? 'ml-4' : 'mr-4'} h-16 w-16 rounded-full`}
            src={
              author?.avatar?.data?.attributes?.url ?
                author?.avatar?.data?.attributes?.url
              : '/empty-avatar-photo.png'
            }
            alt={
              author?.avatar?.data?.attributes?.alternativeText ?? ''
            }
          />
          <div>
            <h5
              rel='author'
              className='text-xl font-bold capitalize text-gray-900'
            >
              {author?.name ?? ''}
            </h5>
            <p className='text-base font-light text-gray-500'>
              {formatDateByLocale(
                blogData?.attributes?.createdAt ?? null,
                locale
              )}
            </p>
          </div>
        </div>
      </address>
    </section>
  );
}

export default PublisherSection;
