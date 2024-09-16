import { Button, Divider, Progress, Rate, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { v4 } from 'uuid';
import CreateReview from './CreateReview';
import dayjs from 'dayjs';
import { Link } from '@/navigation';

interface DescriptionType {
  heading?: string | undefined;
  p?: string | undefined;
  img?:
    | {
        src: string;
        alt?: string;
      }
    | undefined;
  alt?: string | undefined;
  ul?: string[] | undefined;
}

interface SpecificationType {
  key: string;
  value: string;
}

interface ReviewsProps {
  // total: number;
  // avgRatings: number;
  // avgRates: {
  //   one: number;
  //   two: number;
  //   three: number;
  //   four: number;
  //   five: number;
  // };
  customerReviews: ReveiewProps[];
}

interface TypeProps {
  moreDetails: {
    description: DescriptionType[];
    specification: SpecificationType[];
    reviews: ReviewsProps;
  };
}

function ContentOfDesctiption({
  description
}: {
  description: DescriptionType;
}) {
  const keys = Object.keys(description);

  const convertItem = (itemKey: string) => {
    switch (itemKey) {
      case 'p':
        return (
          <p className='mt-3 max-w-[75ch] text-base font-normal text-blue-gray-medium'>
            {description.p}
          </p>
        );
      case 'img':
        return (
          <img
            src={description.img?.src}
            alt={description.alt}
            className='block h-[660px] w-full object-cover'
          />
        );
      case 'heading':
        return (
          <h2 className='mt-4 text-lg font-semibold text-blue-normal'>
            {description.heading}
          </h2>
        );
      case 'ul':
        return (
          <ul className='mx-[15px] mt-3 list-disc'>
            {description.ul?.map((item) => (
              <li key={v4()}>{item}</li>
            ))}
          </ul>
        );
      default:
        return null;
    }
  };
  const elements = keys.map((keyName) => {
    return <div key={v4()}>{convertItem(keyName)}</div>;
  });

  return <div className='w-full'>{elements}</div>;
}

function ConentOfSpecification({
  specification
}: {
  specification: SpecificationType[];
}) {
  const items = specification.map((item, i) => (
    <li
      key={v4()}
      className={`grid w-full grid-cols-2 py-4 pl-7 pr-4 ${i % 2 === 0 ? 'border-y border-solid border-y-blue-accent-dark bg-gray-lighter text-gray-normal' : 'bg-white text-gray-normal'}`}
    >
      <span className='font-semibold capitalize'>{item.key}:</span>
      <span className='capitalize'>{item.value}</span>
    </li>
  ));

  const halfLength = Math.ceil(items.length / 2);

  const leftSide = items.slice(0, halfLength);
  const rightSide = items.slice(halfLength, items.length);

  return (
    <div>
      <h3 className='mb-3 font-openSans text-base font-bold capitalize text-black-medium'>
        More details
      </h3>
      <ul className='grid w-full grid-cols-2 gap-2'>
        <div className='flex w-full flex-col'>{leftSide}</div>
        <div className='flex w-full flex-col'>{rightSide}</div>
      </ul>
    </div>
  );
}

interface ReveiewProps {
  rating: number;
  title: string;
  content: string;
  user: {
    name: string;
    avatarURL: string;
    avrtarAlt: string;
  };
  createdAt: string;
}

function Review({ review }: { review: ReveiewProps }) {
  return (
    <div>
      <div className='mt-4 flex items-start gap-4'>
        <Image
          src={review.user.avatarURL ?? '/empty-avatar-photo.png'}
          alt={review.user.avrtarAlt ?? ''}
          // 'user ahmed avatar profile picture'
          width={40}
          height={40}
          className='rounded-full'
        />
        <div>
          <div>
            <h4 className='text-base capitalize text-black-medium'>
              {review.user.name}
            </h4>
            <h4 className='text-gray-normal'>
              {dayjs(review.createdAt).format('DD MMMM YYYY')}
            </h4>
          </div>

          <div>
            <div className='mt-2 flex items-center gap-4'>
              <Rate
                disabled
                defaultValue={review.rating ?? 0}
                allowHalf
                style={{ fontSize: 16 }}
              />
              <h4 className='text-base font-semibold capitalize text-black-light'>
                {/* Need to recheck the weight at delivery point */}
                {review.title ?? ''}
              </h4>
            </div>
            <p className='mt-1 text-sm font-normal text-black-light'>
              {review.content}
              {/* Product quality is good. But, weight seemed less than
              1kg. Since it is being sent in open package, there is a
              possibility of pilferage in between. FreshCart sends the
              veggies and fruits through sealed plastic covers and
              Barcode on the weight etc. . */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentOfReviews({ reviews }: { reviews: ReviewsProps }) {
  const avgRatings =
    reviews.customerReviews.reduce(
      (acc, cur) => (acc += cur.rating),
      0
    ) / reviews.customerReviews.length;

  const ratings = reviews.customerReviews.map(
    (review) => review.rating
  );
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
  // console.log(avgRatings);

  return (
    <div className='grid grid-cols-[350px_1fr] gap-20'>
      <div>
        <h3 className='font-openSans text-base font-bold text-black-medium'>
          Customer Reviews
        </h3>
        <div className='mt-4 flex items-center gap-1'>
          <Rate
            disabled
            defaultValue={Number(avgRatings.toFixed(1)) ?? 0}
            allowHalf={true}
          />
          {/* <div className='ml-3 inline-flex items-center gap-1'> */}
          <span className='ml-3 text-xs font-bold text-blue-gray-medium'>
            {avgRatings.toFixed(2) ?? 0}
          </span>
          <span className='text-xs font-bold text-blue-gray-medium'>
            out of
          </span>
          <span className='text-xs font-bold text-blue-gray-medium'>
            5
          </span>
          <span className='ml-3 flex items-center gap-1 text-xs font-semibold text-blue-gray-light'>
            <span>{totalNumberOfRates ?? 0}</span>
            <span>reviews</span>
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
            Review this product
          </h3>
          <h3 className='mt-2 font-openSans text-sm font-semibold text-black-light'>
            Share your thoughts with other customers.
          </h3>
          <Link href={'#Reviews-Create-A-Comment'}>
            <Button className='mt-5 w-full capitalize' type='default'>
              Write a review
            </Button>
          </Link>
        </div>
      </div>
      <div>
        <h3 className='font-openSans text-base font-bold text-black-medium'>
          Reviews
        </h3>
        <div>
          {reviews.customerReviews.map((review, index) => {
            return <Review review={review} key={index} />;
          })}
        </div>
        <Divider />
        <div>
          <h3 className='mb-5 font-openSans text-base font-bold capitalize text-black-medium'>
            Create Review
          </h3>
          <CreateReview />
        </div>
      </div>
    </div>
  );
}

function TabsSection({ moreDetails }: TypeProps) {
  //   const onChange = (key: string) => {
  //     console.log(key);
  //   };
  const items: TabsProps['items'] = [
    {
      key: 'tab-1',
      label: <h3 className='text-xl font-semibold'>Description</h3>,
      children: (
        <div className='w-full'>
          <h3 className='mb-3 font-openSans text-base font-bold capitalize text-black-medium'>
            About the product
          </h3>
          {moreDetails.description.map((item) => (
            <ContentOfDesctiption description={item} key={v4()} />
          ))}
        </div>
      )
    },
    {
      key: 'tab-2',
      label: <h3 className='text-xl font-semibold'>Specification</h3>,
      children: (
        <ConentOfSpecification
          specification={moreDetails.specification}
        />
      )
    },
    {
      key: 'tab-3',
      label: <h3 className='text-xl font-semibold'>Reviews</h3>,
      children: <ContentOfReviews reviews={moreDetails.reviews} />
    }
  ];

  return (
    <Tabs
      defaultActiveKey='tab-1'
      items={items}
      className='review-tabs w-full'
    />
  );
}

export default TabsSection;
