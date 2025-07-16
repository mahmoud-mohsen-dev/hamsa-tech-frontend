import { Link } from '@/navigation';
import { fetchGraphql } from '@/services/graphqlCrud';
import { RelatedProductsInDownloadsPageQueryResponse } from '@/types/DonwloadsPageResponse';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import Image from 'next/image';
import {
  MdOutlineArrowLeft,
  MdOutlineArrowRight
} from 'react-icons/md';
import { v4 } from 'uuid';
import SidebarDowmload from '@/components/downloadPage/SidebarDownload/SidebarDowmload';

// export const revalidate = 60; // invalidate every 60 seconds

interface PropsType {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale }
}: Omit<PropsType, 'children'>) {
  const t = await getTranslations({
    locale,
    namespace: 'DownloadsPage.metaData'
  });

  return {
    title: t('title'),
    description: t('description')
  };
}

const relatedProductsInDownloadsPageQuery = ({
  locale
}: {
  locale: string;
}) => {
  return `query DownloadPage {
    downloadPage(locale: "${locale ?? 'en'}") {
        data {
            attributes {
                related_products(pagination: { pageSize: 4 }) {
                    data {
                        id
                        attributes {
                            name
                            image_thumbnail {
                                data {
                                    attributes {
                                        alternativeText
                                        name
                                        url
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`;
};

export default async function ProductsLayout({
  children,
  params: { locale }
}: PropsType) {
  // Enable static rendering
  unstable_setRequestLocale(locale);
  const t = await getTranslations('DownloadsPage.content');
  const { data, error } = (await fetchGraphql(
    relatedProductsInDownloadsPageQuery({ locale })
  )) as RelatedProductsInDownloadsPageQueryResponse;

  const relatedProducts =
    data?.downloadPage?.data?.attributes?.related_products?.data ??
    null;

  console.log(JSON.stringify(data));
  console.log(error);
  // const mainColor = '#f08200';

  return (
    <div
      className={`mx-auto 5xl:max-w-[1900px] ${locale === 'ar' ? 'font-sans' : 'font-inter'}`}
    >
      <section className='container grid gap-10 py-10 lg:grid-cols-[25%_70%] lg:gap-20'>
        <aside className='mb-[50px]'>
          <SidebarDowmload />

          {relatedProducts && relatedProducts.length > 0 && (
            <>
              <div className='mt-8 w-full border-b border-b-[#e5e5e5]'>
                <h2 className='relative w-fit py-2.5 text-xl font-bold uppercase text-black-medium'>
                  {t('sidebar.newProductsTitle')}
                  <span
                    className={`absolute bottom-0 block h-1 w-1/2 bg-red-shade-400`}
                  ></span>
                </h2>
              </div>
              <ul className='mt-8 flex flex-col gap-4'>
                {relatedProducts.map((product) => {
                  const productLink =
                    product?.id ?
                      `/products/${product?.id}`
                    : 'products';

                  return (
                    <li
                      key={product?.id ?? v4()}
                      className='flex gap-5'
                    >
                      <div
                        className={`h-[90px] min-w-[90px] border border-[#e5e5e5] p-1 transition-colors duration-200 hover:border-orange-medium`}
                      >
                        <Link href={productLink}>
                          <Image
                            src={
                              product?.attributes?.image_thumbnail
                                ?.data?.attributes?.url ?? ''
                            }
                            width={80}
                            height={80}
                            alt={
                              product?.attributes?.image_thumbnail
                                ?.data?.attributes?.alternativeText ||
                              product?.attributes?.image_thumbnail
                                ?.data?.attributes?.name ||
                              ''
                            }
                            className='h-[80px] w-[80px] object-contain'
                          />
                        </Link>
                      </div>
                      <div className='flex flex-col justify-center gap-2.5'>
                        <Link
                          href={productLink}
                          className={`text-sm transition-colors duration-200 hover:text-orange-medium`}
                        >
                          {product?.attributes?.name}
                        </Link>
                        <Link
                          href={productLink}
                          className={`flex items-end text-sm text-red-shade-400 transition-all duration-200 hover:text-orange-medium hover:underline`}
                        >
                          <span className='uppercase'>
                            {t('sidebar.moreText')}
                          </span>{' '}
                          {locale === 'ar' ?
                            <MdOutlineArrowLeft size={18} />
                          : <MdOutlineArrowRight size={18} />}
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </aside>
        <div>{children}</div>
      </section>
    </div>
  );
}
