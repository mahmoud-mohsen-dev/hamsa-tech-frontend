'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function ImageZoom({ imgSrc }: { imgSrc: string }) {
  const [zoomStyle, setZoomStyle] = useState({
    // '--display': 'none',
    '--opacity': 0,
    '--zoom-x': '0%',
    '--zoom-y': '0%',
    '--url': `url(${imgSrc})`
  });

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const imageZoom = event.currentTarget;
    const pointer = {
      x: (event.nativeEvent.offsetX * 100) / imageZoom.offsetWidth,
      y: (event.nativeEvent.offsetY * 100) / imageZoom.offsetHeight
    };
    // '--display': 'block',
    setZoomStyle({
      '--opacity': 1,
      '--zoom-x': `${pointer.x}%`,
      '--zoom-y': `${pointer.y}%`,
      '--url': `url(${imgSrc})`
    });
  };

  const handleMouseOut = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    const imageZoom = event.currentTarget;
    const pointer = {
      x: (event.nativeEvent.offsetX * 100) / imageZoom.offsetWidth,
      y: (event.nativeEvent.offsetY * 100) / imageZoom.offsetHeight
    };
    // '--display': 'none',
    setZoomStyle({
      '--opacity': 0,
      '--zoom-x': `${pointer.x}%`,
      '--zoom-y': `${pointer.y}%`,
      '--url': `url(${imgSrc})`
    });
  };

  return (
    <div
      className='imageZoom mt-5 h-[350px] w-[500px] overflow-hidden'
      style={zoomStyle as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
    >
      <Image
        src={imgSrc}
        alt=''
        width={500}
        height={350}
        style={{
          maxHeight: '100%',
          maxWidth: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          verticalAlign: 'middle'
        }}
        // className='transition-opacity duration-300 ease-linear'
      />
    </div>
  );
}
