import { Button, Divider, Progress, Rate, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { v4 } from 'uuid';
import CreateReview from './CreateReview';
import dayjs from 'dayjs';
import { Link } from '@/navigation';
import { reviewType, specificationType } from '@/types/getProduct';
import { ContentType } from '@/types/richTextBlock';
import { useLocale } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import { CreateBlockContent } from '../UI/strapi-blocks/StrapiBlocks';

// interface DescriptionType {
//   heading?: string | undefined;
//   p?: string | undefined;
//   img?:
//     | {
//         src: string;
//         alt?: string;
//       }
//     | undefined;
//   alt?: string | undefined;
//   ul?: string[] | undefined;
// }

interface TypeProps {
  moreDetails: {
    description: ContentType[];
    specification: specificationType[];
    reviews: reviewType[];
  };
}

// function ContentOfDesctiption({
//   description
// }: {
//   description: ContentType;
// }) {
//   const keys = Object.keys(description);

//   const convertItem = (itemKey: string) => {
//     switch (itemKey) {
//       case 'p':
//         return (
//           <p className='mt-3 max-w-[75ch] text-base font-normal text-blue-gray-medium'>
//             {description.p}
//           </p>
//         );
//       case 'img':
//         return (
//           <img
//             src={description.img?.src}
//             alt={description.alt}
//             className='block h-[660px] w-full object-cover'
//           />
//         );
//       case 'heading':
//         return (
//           <h2 className='mt-4 text-lg font-semibold text-blue-normal'>
//             {description.heading}
//           </h2>
//         );
//       case 'ul':
//         return (
//           <ul className='mx-[15px] mt-3 list-disc'>
//             {description.ul?.map((item) => (
//               <li key={v4()}>{item}</li>
//             ))}
//           </ul>
//         );
//       default:
//         return null;
//     }
//   };
//   const elements = keys.map((keyName) => {
//     return <div key={v4()}>{convertItem(keyName)}</div>;
//   });

//   return <div className='w-full'>{elements}</div>;
// }

async function ConentOfSpecification({
  specification
}: {
  specification: specificationType[];
}) {
  const t = await getTranslations('ProductPage');
  const items = specification.map((item, i) => (
    <li
      key={item?.id}
      className={`grid w-full grid-cols-2 py-4 pl-7 pr-4 ${i % 2 === 0 ? 'border-y border-solid border-y-blue-accent-dark bg-gray-lighter text-gray-normal' : 'bg-white text-gray-normal'}`}
    >
      <span className='font-semibold capitalize'>
        {item?.name ?? ''}:
      </span>
      <span className='capitalize'>{item?.value ?? ''}</span>
    </li>
  ));

  const halfLength = Math.ceil(items.length / 2);

  const leftSide = items.slice(0, halfLength);
  const rightSide = items.slice(halfLength, items.length);

  return (
    <div>
      <h3 className='mb-3 font-openSans text-base font-bold capitalize text-black-medium'>
        {t('moreDetailsTitle')}
      </h3>
      <ul className='grid w-full grid-cols-2 gap-2'>
        <div className='flex w-full flex-col'>{leftSide}</div>
        <div className='flex w-full flex-col'>{rightSide}</div>
      </ul>
    </div>
  );
}

function Review({ review }: { review: reviewType }) {
  return (
    <div>
      <div className='mt-4 flex items-start gap-4'>
        <Image
          src={
            review?.attributes?.user_detail?.data?.attributes
              ?.avatar_photo?.data?.attributes?.url ??
            '/empty-avatar-photo.png'
          }
          alt={
            review?.attributes?.user_detail?.data?.attributes
              ?.avatar_photo?.data?.attributes?.alternativeText ?? ''
          }
          // 'user ahmed avatar profile picture'
          width={40}
          height={40}
          quality={100}
          className='min-h-[40px] min-w-[40px] rounded-full object-cover'
        />
        <div>
          <div>
            <h4 className='text-base capitalize text-black-medium'>
              {review?.attributes?.user_detail?.data?.attributes
                ?.first_name ?? ''}
            </h4>
            <h4 className='text-gray-normal'>
              {dayjs(review?.attributes.updatedAt ?? '').format(
                'DD MMMM YYYY'
              )}
            </h4>
          </div>

          <div>
            <div className='mt-2 flex items-center gap-4'>
              <Rate
                disabled
                defaultValue={review?.attributes?.rating ?? 0}
                allowHalf
                style={{ fontSize: 16 }}
              />
              <h4 className='text-base font-semibold capitalize text-black-light'>
                {/* Need to recheck the weight at delivery point */}
                {review?.attributes?.headline ?? ''}
              </h4>
            </div>
            <p className='mt-1 text-sm font-normal text-black-light'>
              {review?.attributes?.comment ?? ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

async function ContentOfReviews({
  reviews
}: {
  reviews: reviewType[];
}) {
  const locale = await getLocale();
  const t = await getTranslations('ProductPage.reviewsTabSection');
  const avgRatings =
    reviews.reduce(
      (acc, cur) => (acc += cur?.attributes?.rating ?? 0),
      0
    ) / reviews.length;

  const ratings = reviews.map((review) => review?.attributes?.rating);
  let oneRatingCount = 0,
    twoRatingCount = 0,
    threeRatingCount = 0,
    fourRatingCount = 0,
    fiveRatingCount = 0;

  ratings.forEach((rating) => {
    switch (Math.floor(rating)) {
      case 1:
        oneRatingCount++;
        break;
      case 2:
        twoRatingCount++;
        break;
      case 3:
        threeRatingCount++;
        break;
      case 4:
        fourRatingCount++;
        break;
      case 5:
        fiveRatingCount++;
        break;
      default:
        break;
    }
  });

  const totalNumberOfRates =
    oneRatingCount +
    twoRatingCount +
    threeRatingCount +
    fourRatingCount +
    fiveRatingCount;
  console.log(totalNumberOfRates);

  const getPercentage = (rate: number) => {
    return Number(((rate / totalNumberOfRates) * 100).toFixed(1));
  };
  console.log(avgRatings);

  return (
    <div className='grid grid-cols-[350px_1fr] gap-20'>
      <div>
        <h3 className='font-openSans text-base font-bold text-black-medium'>
          {t('customerReviewsTitle')}
        </h3>
        <div className='mt-4 flex items-center gap-1'>
          <Rate
            disabled
            defaultValue={Number(avgRatings.toFixed(1)) ?? 0}
            allowHalf={true}
          />
          {/* <div className='ml-3 inline-flex items-center gap-1'> */}
          <span
            className={`${locale === 'ar' ? 'mr-3' : 'ml-3'} text-xs font-bold text-blue-gray-medium`}
          >
            {isNaN(Number(avgRatings.toFixed(1))) ?
              0
            : (Number(avgRatings.toFixed(1)) ?? 0)}
          </span>
          <span className='text-xs font-bold text-blue-gray-medium'>
            {t('outOfText')}
          </span>
          <span className='text-xs font-bold text-blue-gray-medium'>
            5
          </span>
          <span
            className={`${locale === 'ar' ? 'mr-3' : 'ml-3'} flex items-center gap-1 text-xs font-semibold text-blue-gray-light`}
          >
            <span>{totalNumberOfRates ?? 0}</span>
            <span>
              {totalNumberOfRates > 1 ?
                t('reviewsText')
              : t('reviewText')}
            </span>
          </span>
          {/* </div> */}
        </div>
        <div className='mt-4 flex items-center gap-2'>
          <span>5</span>
          <FaStar className='text-yellow-lighter' size={20} />
          <Progress
            percent={getPercentage(fiveRatingCount) ?? 0}
            status='active'
            strokeColor={'rgb(250 219 20)'}
          />
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <span>4</span>
          <FaStar className='text-yellow-lighter' size={20} />
          <Progress
            percent={getPercentage(fourRatingCount) ?? 0}
            status='active'
            strokeColor={'rgb(250 219 20)'}
          />
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <span>3</span>
          <FaStar className='text-yellow-lighter' size={20} />
          <Progress
            percent={getPercentage(threeRatingCount) ?? 0}
            status='active'
            strokeColor={'rgb(250 219 20)'}
          />
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <span>2</span>
          <FaStar className='text-yellow-lighter' size={20} />
          <Progress
            percent={getPercentage(twoRatingCount) ?? 0}
            status='active'
            strokeColor={'rgb(250 219 20)'}
          />
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <span>1</span>
          <FaStar className='text-yellow-lighter' size={20} />
          <Progress
            percent={getPercentage(oneRatingCount) ?? 0}
            status='active'
            strokeColor={'rgb(250 219 20)'}
          />
        </div>
        <div className='mt-5'>
          <h3 className='font-openSans text-base font-bold text-black-medium'>
            {t('reviewThiProductTitle')}
          </h3>
          <h3 className='mt-2 font-openSans text-sm font-semibold text-black-light'>
            {t('shareThoughtTitle')}
          </h3>
          <Link href={'#Reviews-Create-A-Comment'}>
            <Button className='mt-5 w-full capitalize' type='default'>
              {t('writeAReviewText')}
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <h3 className='font-openSans text-base font-bold text-black-medium'>
          {t('reviewsText')}
        </h3>
        <div>
          {reviews.length > 0 ?
            reviews.map((review) => {
              return <Review review={review} key={review.id} />;
            })
          : <p className='mt-3'>{t('noReviewsText')}</p>}
        </div>
        <Divider />
        <div>
          <h3 className='mb-5 font-openSans text-base font-bold capitalize text-black-medium'>
            {t('createReviewText')}
          </h3>
          <CreateReview />
        </div>
      </div>
    </div>
  );
}

async function TabsSection({ moreDetails }: TypeProps) {
  //   const onChange = (key: string) => {
  //     console.log(key);
  //   };
  const t = await getTranslations('ProductPage');
  const locale = await getLocale();
  const items: TabsProps['items'] = [
    {
      key: 'tab-1',
      label: (
        <h3 className='text-xl font-semibold'>
          {t('descriptionSectionTitle')}
        </h3>
      ),
      children: (
        <div className='w-full'>
          <h3 className='mb-3 font-openSans text-base font-bold capitalize text-black-medium'>
            {t('aboutTheProductText')}
          </h3>
          {/* {moreDetails.description.map((item) => (
            <ContentOfDesctiption description={item} key={v4()} />
          ))} */}
          {
            <CreateBlockContent
              arr={moreDetails?.description ?? []}
            />
          }
        </div>
      )
    },
    {
      key: 'tab-2',
      label: (
        <h3 className='text-xl font-semibold'>
          {t('specificationSectionTitle')}
        </h3>
      ),
      children: (
        <ConentOfSpecification
          specification={moreDetails.specification}
        />
      )
    },
    {
      key: 'tab-3',
      label: (
        <h3 className='text-xl font-semibold'>
          {t('reviewsSectionTitle')}
        </h3>
      ),
      children: <ContentOfReviews reviews={moreDetails.reviews} />
    }
  ];

  return (
    <Tabs
      defaultActiveKey='tab-1'
      items={items}
      className={`review-tabs w-full ${locale === 'ar' ? 'left' : 'right'}`}
    />
  );
}

export default TabsSection;
