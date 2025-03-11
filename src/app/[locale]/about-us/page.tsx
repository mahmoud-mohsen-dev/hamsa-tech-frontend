import MapLeaflet from '@/components/UI/MapLeaflet';
// import Map from '@/components/UI/Map';
import { MapProvider } from '@/lib/MapProvider';
import { fetchGraphql } from '@/services/graphqlCrud';
import { getAboutUsPageResponseType } from '@/types/aboutUsPageResponse';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import Image from 'next/image';
import { FaLocationDot, FaPhoneVolume } from 'react-icons/fa6';

const getAboutUsPageQuery = (locale: string) => {
  return `{
    aboutUs(locale: "${locale ?? 'en'}") {
        data {
            attributes {
                title
                description
                top_image {
                    data {
                        attributes {
                            alternativeText
                            url
                        }
                    }
                }
                branch(pagination: { pageSize: 20 }) {
                    location
                    address
                    phone {
                        phone_number
                        id
                    }
                    name
                    id
                }
            }
        }
    }
  }`;
};

async function AboutUsPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  // const position = [51.505, -0.09];
  const t = await getTranslations('AboutUsPage.content');

  const { data, error } = (await fetchGraphql(
    getAboutUsPageQuery(locale)
  )) as getAboutUsPageResponseType;

  const attributes = data?.aboutUs?.data?.attributes ?? null;
  if (error || !attributes) {
    throw new Error('Error fetching about us page data');
  }

  return (
    <MapProvider>
      <div
        className={`${locale === 'ar' ? 'font-sans' : 'font-inter'} xl:mx-28`}
      >
        <div className='mb-16 grid items-center gap-10 xl:grid-cols-[1fr_1.25fr]'>
          <Image
            src={attributes?.top_image?.data?.attributes?.url ?? ''}
            alt={
              attributes?.top_image?.data?.attributes
                ?.alternativeText ?? ''
            }
            width={450}
            height={250}
            quality={100}
            className='min-w-[450px] max-w-full justify-self-center rounded-lg grayscale-[30%] xl:justify-self-end'
          />
          <div className='xl:min-w-[450px]'>
            <h2
              className={`font-bold text-black-medium ${locale === 'ar' ? 'text-3xl' : 'text-xl'}`}
            >
              {attributes?.title}
            </h2>
            <h4
              className={`mt-5 text-balance font-normal ${locale === 'ar' ? 'text-lg' : 'text-base'}`}
            >
              {attributes?.description}
            </h4>
          </div>
        </div>

        <div className='flex flex-col gap-10'>
          {attributes?.branch.length > 0 &&
            attributes?.branch.map((branchData) => {
              return (
                <div
                  className='grid items-center gap-5 xl:grid-cols-2'
                  key={branchData?.id}
                >
                  <div>
                    <h2
                      className={`mb-5 font-bold capitalize text-black-medium ${locale === 'ar' ? 'text-2xl' : 'text-xl'}`}
                    >
                      {branchData?.name ?? ''}
                    </h2>
                    <div className='grid items-start gap-5 xl:grid-cols-2'>
                      <div>
                        <div className='flex items-center gap-3 text-black-light'>
                          <FaLocationDot className='text-red-shade-350' />
                          <h3
                            className={`font-medium ${locale === 'ar' ? 'text-xl' : 'text-lg'}`}
                          >
                            {t('locationText')}
                          </h3>
                        </div>
                        <p
                          className={`mt-5 min-w-[270px] ${locale === 'ar' ? 'text-lg' : 'text-base'}`}
                        >
                          {branchData?.address ?? ''}
                        </p>
                      </div>

                      <div>
                        <div className='flex items-center gap-3 text-black-light'>
                          <FaPhoneVolume className='text-red-shade-350' />
                          <h3
                            className={`font-medium ${locale === 'ar' ? 'text-xl' : 'text-lg'}`}
                          >
                            {t('callUsText')}
                          </h3>
                        </div>
                        <p
                          className={`mt-5 flex min-w-[270px] flex-wrap items-center gap-2 ${locale === 'ar' ? 'text-lg' : 'text-base'}`}
                        >
                          {branchData?.phone.map((phone, i, arr) => (
                            <span key={phone?.id}>
                              {phone.phone_number}
                              {i === arr.length - 1 || i % 2 !== 0 ?
                                ' '
                              : ' | '}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='w-full justify-self-end xl:w-[450px]'>
                    <MapLeaflet
                      position={{
                        lat:
                          branchData?.location?.coordinates?.lat ??
                          30.033333,
                        lng:
                          branchData?.location?.coordinates?.lng ??
                          31.233334
                      }}
                      zoom={20}
                      scrollWheelZoom={false}
                      branchName={branchData?.name ?? ''}
                    />
                    {/* <MapLeaflet
                      position={{
                        lat:
                          branchData?.leaflet_map?.features
                            ?.at(0)
                            ?.geometry?.coordinates?.at(1) ??
                          30.033333,
                        lng:
                          branchData?.leaflet_map?.features
                            ?.at(0)
                            ?.geometry?.coordinates?.at(0) ??
                          31.233334
                      }}
                      zoom={18}
                      scrollWheelZoom={false}
                      branchName={branchData?.name ?? ''}
                    /> */}
                    {/* <Map
                      lat={
                        branchData?.location?.coordinates?.lat ?? ''
                      }
                      lng={
                        branchData?.location?.coordinates?.lng ?? ''
                      }
                      zoom={16}
                      branchName={branchData?.name ?? ''}c
                      address={branchData?.address ?? ''}
                    /> */}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </MapProvider>
  );
}

export default AboutUsPage;
