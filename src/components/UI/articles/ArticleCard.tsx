import Btn from '../Btn';
import { v4 as uuidv4, v4 } from 'uuid';
import dayjs from 'dayjs';
import {
  FaLongArrowAltLeft,
  FaLongArrowAltRight
} from 'react-icons/fa';
import { Link } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { formatDateByLocale } from '@/utils/dateHelpers';

function TagLink({
  linkUrl,
  linkText,
  className
}: {
  linkUrl: string;
  linkText: string;
  className?: string;
}) {
  return (
    <Btn
      href={linkUrl}
      className={`className hover:text-shadow-sm w-fit break-words bg-transparent font-openSans text-xs font-normal uppercase leading-none text-white hover:text-yellow-medium ${className} !px-0 !py-0`}
    >
      {linkText}
    </Btn>
  );
}

function ArticleCard({
  imgSrc,
  alt,
  articleUrl,
  content
}: {
  imgSrc: string;
  alt: string;
  articleUrl: string;
  content: {
    tags: { linkUrl: string; linkText: string }[];
    title: string;
    description: string;
    publishDate: string;
    publisher: string;
  };
}) {
  const locale = useLocale();
  const t = useTranslations('HomePage.articles');
  return (
    <div className='article-card overflow-hidden shadow-featured'>
      <div>
        <img
          src={imgSrc}
          alt={alt}
          className='mx-auto w-full object-cover transition-transform duration-300 ease-out'
        />
      </div>
      <div className='px-10 py-8'>
        <div className='flex w-fit flex-wrap items-center rounded bg-blue-dark px-4 py-[6px]'>
          {content.tags.map((tag, i, arr) => {
            if (arr.length > 1 && i < arr.length && i > 0) {
              return (
                <span key={uuidv4()} className='flex items-center'>
                  <span className='text-white-light'>, </span>
                  <TagLink
                    className='mx-1'
                    key={v4()}
                    linkUrl={`/blog/tags/${tag.linkUrl}`}
                    linkText={tag.linkText}
                  />
                </span>
              );
            }
            return (
              <span key={uuidv4()}>
                <TagLink
                  key={`/blog/tags/${tag.linkUrl}`}
                  linkUrl={tag.linkUrl}
                  linkText={tag.linkText}
                />
              </span>
            );
          })}
        </div>
        <Link href={articleUrl}>
          <h2 className='my-4 text-lg font-medium text-black-medium transition-colors duration-200 hover:text-blue-950'>
            {content.title}
          </h2>
        </Link>
        <p className='my-2 text-base font-normal text-gray-500 sm:my-4 sm:max-h-[120px] sm:leading-6'>
          {content.description}
        </p>
      </div>
      <div className='relative grid grid-cols-[1fr_2px_1fr] border-t border-solid border-t-gray-ultralight pb-[5px] text-gray-medium'>
        <p className='h-full w-full text-center text-sm font-semibold leading-[61px]'>
          {formatDateByLocale(content?.publishDate ?? null, locale)}
        </p>
        <div className='h-full w-[1px] bg-gray-ultralight'></div>
        <p className='text-center text-sm font-semibold capitalize leading-[61px]'>
          {content.publisher}
        </p>
        <Link href={articleUrl}>
          <div className='footer absolute -bottom-[56px] left-0 z-10 h-full w-full transition-all duration-300'>
            <Btn className='hover:white h-full w-full rounded-none bg-blue-dark text-white hover:bg-blue-gray-medium hover:text-white'>
              <span>{t('blogCardButtonText')}</span>
              {locale === 'ar' ?
                <FaLongArrowAltLeft />
              : <FaLongArrowAltRight />}
            </Btn>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default ArticleCard;
