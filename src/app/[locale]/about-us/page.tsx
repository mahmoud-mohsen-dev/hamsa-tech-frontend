import Map from '@/components/UI/Map';
import { MapProvider } from '@/lib/MapProvider';
import { fetchGraphql } from '@/services/graphqlCrud';
import { getAboutUsPageResponseType } from '@/types/aboutUsPageResponse';
import Image from 'next/image';

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
  const mapPositionsData = [
    {
      lat: 30.045832668653425,
      lng: 31.23879151697493
    }
  ];
  const { data, error } = (await fetchGraphql(
    getAboutUsPageQuery(locale)
  )) as getAboutUsPageResponseType;

  const attributes = data?.aboutUs?.data?.attributes ?? null;
  if (error || !attributes) {
    throw new Error('Error fetching about us page data');
  }

  return (
    <MapProvider>
      <div className='container'>
        <div>
          <div>
            <h2>{attributes?.title}</h2>
            <h4>{attributes?.description}</h4>
          </div>
          <Image
            src={attributes?.top_image?.data?.attributes?.url ?? ''}
            alt={
              attributes?.top_image?.data?.attributes
                ?.alternativeText ?? ''
            }
            width={400}
            height={400}
          />
        </div>
        <div className='flex flex-col gap-6'>
          {attributes?.branch.length > 0 &&
            attributes?.branch.map((branchData) => {
              return (
                <div
                  className='grid grid-cols-2'
                  key={branchData?.id}
                >
                  <div>
                    <h2>{branchData?.name ?? ''}</h2>
                    <div>
                      <p>icon</p>
                      <p>{branchData?.address ?? ''}</p>
                    </div>

                    <div>
                      <p>icon</p>
                      <p className='flex flex-wrap items-center gap-2'>
                        {branchData?.phone.map((phone, i, arr) => (
                          <span key={phone?.id}>
                            {phone.phone_number}
                            {i === arr.length - 1 ? ' ' : ' - '}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <Map
                    lat={branchData?.location?.coordinates?.lat ?? ''}
                    lng={branchData?.location?.coordinates?.lng ?? ''}
                    zoom={18}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </MapProvider>
  );
}

export default AboutUsPage;
