import { Link } from '@/navigation';
import { getCouponsQuery } from '@/services/getCouponsQuery';
import { getOffersQuery } from '@/services/getOffersQuery';
import { fetchGraphqlServerWebAuthenticated } from '@/services/graphqlCrudServerOnly';
import { GetCouponResponseType } from '@/types/getCouponResponseType';
import { GetOffersResponseType } from '@/types/getOffersResponseType';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import Image from 'next/image';
import { v4 } from 'uuid';

type PropsType = {
  params: { locale: string };
};

async function OffersPage({ params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('OffersPage');

  const { data, error } = (await fetchGraphqlServerWebAuthenticated(
    getOffersQuery(locale)
  )) as GetOffersResponseType;

  const offers = data?.offers?.data || [];

  // console.log(JSON.stringify(data?.offers?.data));
  // console.log(error);

  const { data: copuonsData, error: couponsError } =
    (await fetchGraphqlServerWebAuthenticated(
      getCouponsQuery(locale)
    )) as GetCouponResponseType;

  // console.log(JSON.stringify(copuonsData));
  // console.log(couponsError);

  const copuons = copuonsData?.coupons?.data || [];

  return (
    <section>
      <div className='container grid min-h-[calc(100vh-160px)] place-content-center 5xl:min-h-min'>
        <div className='mx-10'>
          {offers.length === 0 ?
            <h3 className='font-openSans text-xl font-semibold text-black-light'>
              {t('noOffersMessage')}
            </h3>
          : <div className='gap-5 md:grid md:grid-cols-3 5xl:grid-cols-4'>
              {offers.map((offer) => {
                return (
                  <Link
                    key={offer.id ?? v4()}
                    href={offer?.attributes?.offer_link ?? '#'}
                  >
                    <Image
                      src={
                        offer?.attributes?.image?.data?.attributes
                          ?.url ?? '/image-not-found.png'
                      }
                      alt={
                        offer?.attributes?.image?.data?.attributes
                          ?.alternativeText ?? 'image not found'
                      }
                      width={500}
                      height={500}
                      quality={100}
                    />
                  </Link>
                );
              })}
            </div>
          }

          {copuons.length > 0 && (
            <div className='mb-5 mt-7 flex w-full flex-col gap-5'>
              {copuons.map((coupon) => (
                <Image
                  key={coupon.id ?? v4()}
                  src={
                    coupon?.attributes?.image?.data?.attributes
                      ?.url ?? '/image-not-found.png'
                  }
                  alt={
                    coupon?.attributes?.image?.data?.attributes
                      ?.alternativeText ?? 'image not found'
                  }
                  width={500}
                  height={500}
                  quality={100}
                  className='min-h-fit min-w-full'
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default OffersPage;
