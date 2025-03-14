'use client';

import Image from 'next/image';
import ImageZoom from './ImageZoom';
import { useEffect, useState } from 'react';
import { ProductDataType } from '@/types/getProduct';
import { useMyContext } from '@/context/Store';
import { v4 } from 'uuid';

function ProductSlider({
  productData,
  enId,
  arId
}: {
  productData: ProductDataType;
  enId: string;
  arId: string;
}) {
  const { setEnProductId, setArProductId } = useMyContext();
  const images = productData?.images.data ?? [];
  const [activeImg, setActiveImg] = useState({
    imgSrc: images[0].attributes?.url ?? '',
    alt: images[0].attributes?.alternativeText ?? '',
    index: 0
  });
  // console.log(productData);
  // console.log(images);
  // console.log(activeImg);

  useEffect(() => {
    setEnProductId(String(enId));
    setArProductId(String(arId));
  }, [enId, arId]);

  return (
    <div className='flex max-h-fit flex-col-reverse items-center justify-center 2xl:sticky 2xl:top-[64px] 3xl:flex-row'>
      <div className='flex flex-wrap items-start justify-center gap-5 3xl:flex-col'>
        {Array.isArray(images) &&
          images.length > 0 &&
          images.map((imgSlide, i) => {
            return (
              <div
                className={`h-[90px] w-[90px] border-2 md:p-[5px] ${activeImg.index === i ? 'border-yellow-medium' : 'border-transparent'}`}
                // key={productData?.images?.data[0].id}
                key={v4()}
                // onMouseEnter={() => {
                //   setActiveImg({
                //     imgSrc: imgSlide.attributes.url ?? '',
                //     alt: imgSlide?.attributes.alternativeText ?? '',
                //     index: i
                //   });
                // }}
                onClick={() => {
                  setActiveImg({
                    imgSrc: imgSlide.attributes.url ?? '',
                    alt: imgSlide?.attributes.alternativeText ?? '',
                    index: i
                  });
                }}
              >
                <Image
                  src={imgSlide?.attributes.url ?? ''}
                  alt={imgSlide?.attributes.alternativeText ?? ''}
                  width={80}
                  height={80}
                  style={{
                    maxHeight: '100%',
                    maxWidth: '100%',
                    minHeight: '80px',
                    minWidth: '80px',
                    objectFit: 'contain',
                    objectPosition: 'center',
                    verticalAlign: 'middle'
                  }}
                />
              </div>
            );
          })}
      </div>
      <div className='m-2 md:m-8'>
        <ImageZoom imgSrc={activeImg.imgSrc} alt={activeImg.alt} />
      </div>
    </div>
  );
}

export default ProductSlider;
