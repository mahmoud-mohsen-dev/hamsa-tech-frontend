import { unstable_setRequestLocale } from 'next-intl/server';

export default async function Product({
  params: { product, locale }
}: {
  params: { product: string; locale: string };
}) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  //   const { product } = params;
  //   const { data: productData, error } =
  //     await serverGetProduct(product);

  //   if (!productData || error) {
  //     return (
  //       <div className='container mx-6 mt-[100px] text-left text-xl'>
  //         Product Not Found
  //       </div>
  //     );
  //   }
  //   const { basic, info, details, moreDetails } = productData.product;
  //   const { relatedProducts } = productData;
  // console.log(productData);
  //   const offPercent =
  //     ((basic.priceBeforeDeduction - basic.currentPrice) * 100) /
  //     basic.priceBeforeDeduction;

  return (
    <></>
    // <ConfigAntThemes>
    //   <div id='product-page'>
    //     <div className='container mb-[50px] mt-[100px]'>
    //       <ProductBreadcrumb
    //         productName={productData.product.basic.productName}
    //       />
    //       <section className='mx-4 mt-5 grid grid-cols-2'>
    //         <ProductSlider productData={productData} />
    //         <div className='ml-24'>
    //           {/* Basic Data */}
    //           <section>
    //             <h4 className='text-blue-dark'>
    //               {basic.subCategoryName}
    //             </h4>
    //             <h2 className='mt-3 text-3xl font-semibold text-black-medium'>
    //               {basic.productName}
    //             </h2>
    //             <h4 className='mt-5 text-xl font-normal text-gray-medium'>
    //               {info.description}
    //             </h4>
    //             <div className='mt-5 flex items-center gap-2'>
    //               <Rate defaultValue={basic.averageRate} disabled />
    //               <h6 className='text-sm font-medium text-blue-dark'>
    //                 ({basic.averageRate} reviews)
    //               </h6>
    //             </div>

    //             <div className='mt-3 flex items-center gap-2'>
    //               <span className='text-base font-medium text-black-light'>
    //                 EGP {basic.currentPrice}
    //               </span>
    //               <span className='text-sm font-medium text-gray-500 line-through'>
    //                 EGP {basic.priceBeforeDeduction}
    //               </span>
    //               {offPercent > 10 ?
    //                 <span className='text-sm text-red-shade-300'>
    //                   {offPercent.toFixed(2)}% Off
    //                 </span>
    //               : null}
    //             </div>
    //             <h4 className='mt-3 flex items-center gap-2 text-sm font-normal text-blue-gray-medium'>
    //               {basic.quantity > 0 ?
    //                 <>
    //                   <span>Availability:</span>
    //                   <span className='text-green-medium'>
    //                     {basic.quantity}
    //                   </span>
    //                   <span>items in stock</span>
    //                 </>
    //               : 'Out of stock'}
    //             </h4>
    //             <OrderProduct />
    //             <div className='mt-4 text-sm capitalize text-gray-light'>
    //               <p>
    //                 -&nbsp;&nbsp;&nbsp;&nbsp;Delivery within 5 days
    //               </p>
    //               <p className='mt-1'>
    //                 -&nbsp;&nbsp;&nbsp;&nbsp;Free return within 14
    //                 days
    //               </p>
    //             </div>
    //           </section>
    //           <Divider className='bg-gray-lighter' />
    //           {/* Product Info */}
    //           {/* ============================= */}
    //           <section>
    //             <Info infoKey='Brand:' value={basic.brand} />
    //             <Info
    //               infoKey='SKU:'
    //               value={info.sku}
    //               isCapitalized={false}
    //             />
    //             <Info
    //               infoKey='connectivity:'
    //               value={info.connectivity}
    //             />
    //             <Info
    //               infoKey='Model Name:'
    //               value={info.modalName}
    //               isCapitalized={false}
    //             />
    //             <Info
    //               infoKey='waranty:'
    //               value={`${info.waranty.value} ${info.waranty.duration}`}
    //             />
    //             <Info
    //               infoKey='tags:'
    //               value={info.tags.map((tag, i, arr) => (
    //                 <div
    //                   className='flex flex-wrap items-center'
    //                   key={v4()}
    //                 >
    //                   <Link
    //                     href={tag.href ?? '/'}
    //                     className='transition-colors duration-150 ease-out hover:text-yellow-medium'
    //                   >
    //                     {tag.label}
    //                   </Link>
    //                   {i < arr.length - 1 && (
    //                     <span className='mr-2'>,</span>
    //                   )}
    //                 </div>
    //               ))}
    //             />
    //             <Info
    //               infoKey='Share:'
    //               // className='mb-[50px]'
    //               value={
    //                 <div className='flex flex-wrap items-center gap-3'>
    //                   <Link
    //                     href={
    //                       'https://www.facebook.com/sharer/sharer.php?u=https://hamsa-tech.vercel.app/'
    //                     }
    //                     target='_blank'
    //                     className='rounded-[4px] bg-blue-sky-ultralight p-2 transition-colors duration-150 ease-out hover:text-blue-accent'
    //                   >
    //                     <FaFacebookF size={20} />
    //                   </Link>
    //                   <Link
    //                     href={
    //                       'href="https://twitter.com/intent/tweet?original_referer=https://hamsa-tech.vercel.app/'
    //                     }
    //                     target='_blank'
    //                     className='rounded-[4px] bg-blue-sky-ultralight p-2 transition-colors duration-150 ease-out hover:text-blue-accent'
    //                   >
    //                     <RiTwitterXLine size={20} />
    //                   </Link>
    //                   <Link
    //                     href={'https://www.instagram.com'}
    //                     target='_blank'
    //                     className='rounded-[4px] bg-blue-sky-ultralight p-2 transition-colors duration-150 ease-out hover:text-blue-accent'
    //                   >
    //                     <FaInstagram size={20} />
    //                   </Link>
    //                 </div>
    //               }
    //             />
    //           </section>
    //           {/* <Divider className='bg-gray-lighter' /> */}
    //         </div>
    //       </section>
    //     </div>
    //     {/* More Details */}
    //     <section className='container bg-blue-sky-ultralight py-[50px]'>
    //       <div className='grid grid-cols-2 gap-5 px-6'>
    //         {/* Download Center Section */}
    //         <div className='flex flex-col gap-10'>
    //           <div>
    //             <h2 className='mx-auto w-fit text-3xl font-bold text-black-light'>
    //               Download Center
    //             </h2>
    //             <div className='mt-10 flex flex-wrap items-center justify-center gap-5'>
    //               <Btn
    //                 className='gap-4 bg-red-shade-350 px-10 py-3 text-lg font-semibold text-white'
    //                 defaultPadding={false}
    //               >
    //                 <FaBook size={24} />
    //                 <span>Data Sheet</span>
    //               </Btn>
    //               <Btn
    //                 className='gap-4 bg-red-shade-350 px-10 py-3 text-lg font-semibold text-white'
    //                 defaultPadding={false}
    //               >
    //                 <FaAddressBook size={24} />
    //                 <span>User Manual</span>
    //               </Btn>
    //             </div>
    //           </div>
    //           <div className='flex h-full flex-col items-center justify-center'>
    //             <iframe
    //               width='557'
    //               height='314'
    //               src='https://www.youtube.com/embed/AQyIi3UjAdw?si=tN_6bMUSm0QR5lHw'
    //               title='YouTube video player'
    //               frameBorder='0'
    //               allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    //               referrerPolicy='strict-origin-when-cross-origin'
    //               allowFullScreen
    //             ></iframe>
    //           </div>
    //         </div>
    //         {/* ============================= */}

    //         {/* About Product Section */}
    //         <div>
    //           <h2 className='mx-auto w-fit text-3xl font-bold text-black-light'>
    //             About This Product
    //           </h2>
    //           <ul className='mt-10 list-disc'>
    //             {details.aboutProduct.map((item) => (
    //               <li
    //                 key={v4()}
    //                 className='mt-3 text-sm text-blue-gray-light'
    //               >
    //                 {item}
    //               </li>
    //             ))}
    //           </ul>
    //         </div>
    //       </div>
    //     </section>
    //     <section className='tabs-section container bg-white py-[50px]'>
    //       <div className='px-6'>
    //         <TabsSection moreDetails={moreDetails} />
    //       </div>
    //     </section>
    //     <section className='container bg-white-light pb-[70px] pt-[50px]'>
    //       <h2 className='mx-auto w-fit text-3xl font-bold text-black-light'>
    //         <span>Related</span>
    //         <span className='ml-3 text-red-shade-350'>Products</span>
    //       </h2>
    //       <div className='mt-8 grid grid-cols-4 gap-5'>
    //         {relatedProducts.map((product: ProductBasicInfoType) => {
    //           return (
    //             <ProductCard
    //               title={product.productName}
    //               alt={product.alt}
    //               imgSrc={product.imgSrc}
    //               avgRate={product.averageRate}
    //               category={product.subCategoryName ?? ''}
    //               badge={product.badge}
    //               priceBeforeDeduction={product.priceBeforeDeduction}
    //               currentPrice={product.currentPrice}
    //               linkSrc={`/products/${product.id}`}
    //               totalRates={product.totalNumberOfRates}
    //               key={v4()}
    //             />
    //           );
    //         })}
    //       </div>
    //     </section>
    //   </div>
    // </ConfigAntThemes>
  );
}
