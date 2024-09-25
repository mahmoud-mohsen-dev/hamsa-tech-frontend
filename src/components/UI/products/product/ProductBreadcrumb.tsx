// 'use client';

import CustomBreadcrumb from '@/components/products/CustomBreadcrumb';
import { usePathname } from '@/navigation';
import { HomeOutlined, ProductOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { PiSecurityCamera } from 'react-icons/pi';

function ProductBreadcrumb({ productName }: { productName: string }) {
  const pathname = usePathname();
  const [productId, setProductId] = useState('');

  useEffect(() => {
    // Extract the product ID from pathname
    // const pathSegments = pathname.split('/');
    // const productId = pathSegments[pathSegments.length - 1];
    if (pathname) {
      setProductId(pathname);
    }
  }, [pathname]);
  console.log(productId);

  const items = [
    {
      href: '/',
      title: <HomeOutlined />
    },
    {
      href: '/products?category=Indoor%20HD%20Cameras',
      title: (
        <>
          <ProductOutlined />
          <span>All Products</span>
        </>
      )
    },
    {
      href: `${productId ?? 'product'}`,
      title: (
        <p className='flex items-center gap-2'>
          <PiSecurityCamera className='rotate-90' />
          <span>{productName ?? 'product'}</span>
        </p>
      )
    }
  ];

  return (
    <div className='min-h-[23px]'>
      <CustomBreadcrumb items={items} />
    </div>
  );
}

export default ProductBreadcrumb;
