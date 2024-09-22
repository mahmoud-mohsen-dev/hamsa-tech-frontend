import { BrandsSectionType } from '@/types/getHomePageTypes';
import ImageWrapper from '../UI/ImageWrapper';
import ScrollerComponent from '../UI/ScrollerComponent';

interface PropsType {
  data: BrandsSectionType;
}

function Partners({ data }: PropsType) {
  return (
    <div className='max-w-[1900px] bg-blue-sky-ultralight py-[50px]'>
      <div
        data-aos='fade-up'
        data-aos-delay='50'
        data-aos-duration='400'
        data-aos-easing='ease-out'
        data-aos-once='true'
      >
        <ScrollerComponent>
          {data.brands.data.map((brand) => {
            return (
              <ImageWrapper
                key={brand.id}
                imgSrc={
                  brand?.attributes?.logo?.data?.attributes?.url ?? ''
                }
                alt={
                  brand?.attributes?.logo?.data?.attributes
                    ?.alternativeText ?? ''
                }
              />
            );
          })}
        </ScrollerComponent>
      </div>
    </div>
  );
}

export default Partners;
