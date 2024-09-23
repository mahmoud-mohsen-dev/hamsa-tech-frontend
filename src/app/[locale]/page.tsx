import { unstable_setRequestLocale } from 'next-intl/server';
import CategoriesSection from '@/components/home/CategoriesSection';
import HeroSection from '@/components/home/HeroSection';
import { HomepageResponseType } from '@/types/getHomePageTypes';
import Featured from '@/components/home/FeaturedSection';
import { fetchGraphql } from '@/services/graphqlCrud';
import Partners from '@/components/home/Partners';
import AboutUs from '@/components/home/AboutUs';
import Articles from '@/components/home/Articles';
import ContactUs from '@/components/home/ContactUs';

interface PropsType {
  params: { locale: string };
}

export const revalidate = 120; // invalidate every hour

const getQueryHomePage = (locale: string) => `{
  pages(locale: "${locale ?? 'en'}") {
    data {
      attributes {
        heroSection {
          id
          headingTop
          headingBottom
          direction
          image {
            data {
                attributes {
                    url
                    alternativeText
                }
            }
          }
          buttonLink {
            id
            buttonText
            button_slug
          }
        }
        products_spotlight {
          section_name
          heading_in_black
          heading_in_red
          products {
            data {
                id
                attributes {
                    name
                    updatedAt
                    image_thumbnail {
                        data {
                            attributes {
                                url
                                alternativeText
                            }
                        }
                    }
                    spotlight_description
                }
            }
          }
        }
        categories {
          section_name
          heading_in_black
          heading_in_red
          description
          category {
            id
            title
            description
            slug
            image {
                data {
                    attributes {
                        url
                        alternativeText
                    }
                }
            }
          }  
        }
        brands{
            brands{
                data {
                    id
                    attributes {
                        logo {
                            data {
                                attributes {
                                    url
                                    alternativeText
                                }
                            }
                        }
                    }
                }
            }
        }
        about_us {
          title
          description
          button_text
          section_name
          image {
            data {
                attributes {
                    url
                    alternativeText
                }
            }
          }
        }
        featured_blogs {
          section_name
          heading_in_black
          heading_in_red
          blogs {
            data {
                id
                attributes {
                    createdAt
                    title
                    image {
                        data {
                            attributes {
                                url
                                alternativeText
                            }
                        }
                    }
                    card_description
                    tags {
                        data {
                            id
                            attributes {
                                name
                                slug
                            }
                        }
                    }
                    author {
                        data {
                            attributes {
                                name
                            }   
                        }
                    }

                }
            }
          }
        }
        contact_us {
          section_name
          heading
					button_text
          button_url
        }
      }
    }
  }
}`;

export default async function IndexPage({
  params: { locale }
}: PropsType) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const response: HomepageResponseType = await fetchGraphql(
    getQueryHomePage(locale ?? 'en')
  );
  const homepageData = response?.data?.pages?.data[0] || null;
  const homepageError = response?.error || null;
  if (homepageError) {
    console.error('Failed to fetch home page data');
    console.log('homepageError');
    console.log(homepageError);
  }
  // console.log('=*='.repeat(10));
  // console.log(JSON.stringify(response));
  // console.log('=*='.repeat(10));
  // console.log('==='.repeat(10));

  return (
    <>
      {(homepageError || homepageData === null) && (
        <p className='font-semiboldbold container mt-40 text-center text-xl text-black-light'>
          {locale === 'ar' ?
            'حدث خطأ أثناء جلب بيانات الصفحة الرئيسية. يُرجى المحاولة مرة أخرى لاحقًا.'
          : 'Error fetching home page data. Please try again later.'}
        </p>
      )}
      {homepageData?.attributes?.heroSection && (
        <HeroSection data={homepageData.attributes.heroSection} />
      )}
      {homepageData?.attributes['products_spotlight'] && (
        <Featured
          data={homepageData?.attributes['products_spotlight']}
        />
      )}
      {homepageData?.attributes?.categories && (
        <CategoriesSection
          data={homepageData.attributes.categories}
        />
      )}
      {homepageData?.attributes?.brands && (
        <Partners data={homepageData.attributes.brands} />
      )}
      {homepageData?.attributes?.about_us && (
        <AboutUs data={homepageData.attributes.about_us} />
      )}
      {homepageData?.attributes?.featured_blogs && (
        <Articles data={homepageData.attributes.featured_blogs} />
      )}
      {homepageData?.attributes?.contact_us && (
        <ContactUs data={homepageData.attributes.contact_us} />
      )}
    </>
  );
}
