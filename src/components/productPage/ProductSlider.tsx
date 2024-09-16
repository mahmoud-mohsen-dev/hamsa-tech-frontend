'use client';

import Image from 'next/image';
import { v4 } from 'uuid';
import ImageZoom from './ImageZoom';
import { useState } from 'react';
import { productDetailsType } from '@/types';

function ProductSlider({
  productData
}: {
  productData: productDetailsType;
}) {
  const [activeImg, setActiveImg] = useState({
    imgSrc: productData.product.sliderImgs[0].imgSrc ?? '',
    index: 0
  });

  return (
    <div className='sticky top-[64px] ml-10 flex max-h-[450px] items-center gap-10'>
      <div className='flex flex-col items-start justify-center gap-5'>
        {Array.isArray(productData?.product?.sliderImgs) &&
          productData?.product?.sliderImgs.length > 0 &&
          productData?.product?.sliderImgs.map((imgSlide, i) => {
            return (
              <div
                className={`h-[90px] w-[90px] border-2 p-[5px] ${activeImg.index === i ? 'border-yellow-medium' : 'border-transparent'}`}
                key={v4()}
                onMouseEnter={() => {
                  setActiveImg({
                    imgSrc: imgSlide.imgSrc ?? '',
                    index: i
                  });
                }}
                onClick={() => {
                  setActiveImg({
                    imgSrc: imgSlide.imgSrc ?? '',
                    index: i
                  });
                }}
              >
                <Image
                  src={imgSlide.imgSrc}
                  alt={imgSlide.alt}
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
      <div>
        <ImageZoom imgSrc={activeImg.imgSrc} />
      </div>
    </div>
  );
}

export default ProductSlider;
