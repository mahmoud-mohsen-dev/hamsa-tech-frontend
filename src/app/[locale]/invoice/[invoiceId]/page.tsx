'use client';
// import InvoicePDFButton from '@/components/invoice/InvoicePDFViewer';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Spin } from 'antd';

import { useEffect, useState } from 'react';

import dynamic from 'next/dynamic';
const InvoicePDFButton = dynamic(
  () => import('@/components/invoice/InvoicePDFViewer'),
  {
    ssr: false
  }
);

function InvoicePage() {
  const [isClient, setIsClient] = useState(false);
  const locale = useLocale();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ?
        <>
          <div>
            <InvoicePDFButton />
          </div>
          <div className='boder-gray-100 mt-5 rounded-lg border bg-white p-6 font-inter shadow 2xl:min-w-[850px]'>
            <div className='flex flex-col'>
              <div className='mb-2 flex items-center justify-between'>
                <div className='text-lg font-semibold text-gray-800'>
                  Invoice #0472
                </div>
                <Image
                  src='/hamsa-logo.svg'
                  alt='hamsa logo'
                  width={45}
                  height={45}
                  quality={100}
                  className={`${locale === 'ar' ? 'ml-5' : 'mr-5'} block`}
                />
              </div>
              <div className='ml-auto flex items-center gap-1 text-sm font-medium uppercase text-gray-600'>
                <span className='text-blue-dark'>Hamsa</span>
                <span className='text-red-shade-350'>Tech</span>
              </div>
              {/* <div className='ml-auto text-sm text-gray-500'>
                291 N 4th St, San Jose, CA 95112, USA
              </div>
              <div className='ml-auto text-sm text-gray-500'>
                August 1, 2021
              </div> */}
            </div>
            <div className='mt-2'>
              <div className='text-md font-semibold'>Bill to</div>
              <p className='text-sm text-gray-700'>
                Themesberg Inc., LOUISVILLE, Selby 3864 Johnson
                Street, United States of America
                <br />
                VAT Code: AA-1234567890
              </p>
            </div>
            {/* Table */}
            <div className='mt-5 overflow-x-auto'>
              <table className='min-w-full border border-gray-200 bg-white'>
                <thead className='bg-gray-200'>
                  <tr>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                      Item
                    </th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                      Quantity
                    </th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                      Price
                    </th>
                    <th className='px-4 py-2 text-left text-sm font-medium text-gray-600'>
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className='px-4 py-2'>Product A</td>
                    <td className='px-4 py-2'>2</td>
                    <td className='px-4 py-2'>$50.00</td>
                    <td className='px-4 py-2'>$100.00</td>
                  </tr>
                  <tr>
                    <td className='px-4 py-2'>Product B</td>
                    <td className='px-4 py-2'>1</td>
                    <td className='px-4 py-2'>$30.00</td>
                    <td className='px-4 py-2'>$30.00</td>
                  </tr>
                  <tr className='border-t border-gray-200 font-semibold'>
                    <td className='px-4 py-2' colSpan={3}>
                      Total
                    </td>
                    <td className='px-4 py-2'>$130.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className='mb-5 ml-auto mt-4 flex w-2/5 flex-col gap-1 pb-2 text-base'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span>$415.00</span>
              </div>
              <div className='flex justify-between'>
                <span>Discount</span>
                <span>$64.00</span>
              </div>
              <div className='flex justify-between'>
                <span>Shipping</span>
                <span>$35.00</span>
              </div>
              <div className='flex justify-between font-semibold text-blue-sky-accent'>
                <span>Total</span>
                <span>$351.00</span>
              </div>
            </div>
          </div>
        </>
      : <Spin size='large' />}
    </>
  );
}

export default InvoicePage;
