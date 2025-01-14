import { Button, Divider, Progress, Rate, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { FaStar } from 'react-icons/fa';
import CreateOrEditReview from './CreateOrEditReview';
import { Link } from '@/navigation';
import { reviewType, specificationType } from '@/types/getProduct';
import { ContentType } from '@/types/richTextBlock';
import { getLocale, getTranslations } from 'next-intl/server';
import { CreateBlockContent } from '../UI/strapi-blocks/StrapiBlocks';
import Review from './Review';

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
    averageReviews: number;
    totalReviews: number;
  };
  productIds: { enId: string | null; arId: string | null };
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

  const halfLength = Math.ceil(specification.length / 2);

  const leftSide = specification.slice(0, halfLength);
  const rightSide = specification.slice(
    halfLength,
    specification.length
  );

  const leftSideItems = leftSide.map((item, i) => {
    const lines = item?.value ? item?.value.split('\n') : [''];
    return (
      <li
        key={item?.id}
        className={`grid w-full grid-cols-[1fr_1.5fr] py-4 pl-7 pr-4 ${i % 2 === 0 ? 'border-y border-solid border-y-blue-accent-dark bg-gray-lighter text-gray-normal' : 'bg-white text-gray-normal'}`}
      >
        <span className='font-semibold capitalize'>
          {item?.name ?? ''}:
        </span>
        <span className='capitalize'>
          {lines.map((line, index) => (
            <span key={index} className='block w-full'>
              {line}
            </span>
          ))}
        </span>
      </li>
    );
  });

  const rightSideItems = rightSide.map((item, i) => {
    const lines = item?.value ? item?.value.split('\n') : [''];
    return (
      <li
        key={item?.id}
        className={`grid w-full grid-cols-[1fr_1.5fr] py-4 pl-7 pr-4 ${i % 2 === 0 ? 'bg-white text-gray-normal xl:border-y xl:border-solid xl:border-y-blue-accent-dark xl:bg-gray-lighter' : 'border-y border-solid border-y-blue-accent-dark bg-gray-lighter text-gray-normal xl:border-y-0 xl:border-transparent xl:bg-white'}`}
      >
        <span className='font-semibold capitalize'>
          {item?.name ?? ''}:
        </span>
        <span className='capitalize'>
          {lines.map((line, index) => (
            <span key={index} className='block w-full'>
              {line}
            </span>
          ))}
        </span>
      </li>
    );
  });

  return (
    <div>
      <h3 className='mb-3 font-openSans text-base font-bold capitalize text-black-medium'>
        {t('moreDetailsTitle')}
      </h3>
      <ul className='w-full xl:grid xl:grid-cols-2 xl:gap-2'>
        <div className='flex w-full flex-col'>{leftSideItems}</div>
        <div className='flex w-full flex-col'>{rightSideItems}</div>
        {/* <div className='flex w-full flex-col'>{items}</div> */}
      </ul>
    </div>
  );
}

async function ContentOfReviews({
  reviews,
  productIds,
  totalRatings,
  averageRatings
}: {
  reviews: reviewType[];
  productIds: { arId: string | null; enId: string | null };
  totalRatings: number;
  averageRatings: number;
}) {
  const t = await getTranslations('ProductPage.reviewsTabSection');

  const ratings = reviews
    .filter(
      (review) =>
        !review?.attributes?.hidden && review?.attributes?.rating >= 0
    )
    .map((review) => review.attributes.rating);

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

  // const totalNumberOfRates =
  //   oneRatingCount +
  //   twoRatingCount +
  //   threeRatingCount +
  //   fourRatingCount +
  //   fiveRatingCount;
  // // console.log(totalNumberOfRates);

  const getPercentage = (rate: number) => {
    return (
        isNaN(parseFloat(((rate / totalRatings) * 100).toFixed(2)))
      ) ?
        0
      : Number(((rate / totalRatings) * 100).toFixed(2));
  };
  // console.log(avgRatings);

  const filteredReviews = reviews.filter((review) =>
    review?.attributes?.hidden ? false : true
  );

  return (
    <div className='grid gap-20 md:grid-cols-[250px_1fr] xl:grid-cols-[350px_1fr]'>
      <div>
        <h3 className='font-openSans text-base font-bold text-black-medium'>
          {t('customerReviewsTitle')}
        </h3>
        <div className='mt-4 flex flex-col flex-wrap gap-3 lg:flex-row'>
          {/* <div dir='ltr' className={'w-fit'}> */}
          <Rate
            disabled
            defaultValue={averageRatings}
            value={averageRatings}
            allowHalf={true}
          />
          {/* </div> */}

          {/* <div className='ml-3 inline-flex items-center gap-1'> */}
          <div className={`flex flex-wrap items-center gap-1`}>
            <span
              className={`text-xs font-bold text-blue-gray-medium`}
            >
              {averageRatings}
            </span>
            <span className='text-xs font-bold text-blue-gray-medium'>
              {t('outOfText')}
            </span>
            <span className='text-xs font-bold text-blue-gray-medium'>
              5
            </span>
            <span
              className={`flex items-center gap-1 text-xs font-semibold text-blue-gray-light`}
            >
              <span>({totalRatings}</span>
              <span>
                {totalRatings > 1 ?
                  t('reviewsText')
                : t('reviewText')}
                )
              </span>
            </span>
          </div>
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
          <Link href={'#create-A-review'}>
            <Button className='mt-5 w-full capitalize' type='default'>
              {t('writeAReviewText')}
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <h3 className='font-openSans text-base font-bold capitalize text-black-medium'>
          {t('reviewsText')}
        </h3>
        <div>
          {filteredReviews.length > 0 ?
            filteredReviews.map((review, i, arr) => {
              return (
                <div key={review.id} className='mt-3'>
                  <Review review={review} productIds={productIds} />
                  {i !== arr.length - 1 && (
                    <Divider
                      style={{
                        marginTop: '14px',
                        marginBottom: '14px'
                      }}
                    />
                  )}
                </div>
              );
            })
          : <p className='mt-3'>{t('noReviewsText')}</p>}
        </div>
        <Divider />
        <CreateOrEditReview productIds={productIds} />
      </div>
    </div>
  );
}

async function TabsSection({ moreDetails, productIds }: TypeProps) {
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
        <div className='w-full font-openSans'>
          <h3 className='mb-3 text-base font-bold capitalize text-black-medium'>
            {t('aboutTheProductText')}
          </h3>
          {/* {moreDetails.description.map((item) => (
            <ContentOfDesctiption description={item} key={v4()} />
          ))} */}
          {
            <CreateBlockContent
              content={moreDetails?.description ?? []}
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
      children: (
        <ContentOfReviews
          reviews={moreDetails.reviews}
          totalRatings={moreDetails.totalReviews}
          averageRatings={moreDetails.averageReviews}
          productIds={productIds}
        />
      )
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
