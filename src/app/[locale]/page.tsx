// import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
// import PageLayout from '@/components-old/PageLayout';

// import AboutUs from '@/components/home/AboutUs';
// import Articles from '@/components/home/Articles';
import CategoriesSection from '@/components/home/CategoriesSection';
// import ContactUs from '@/components/home/ContactUs';
// import FeaturedSection from '@/components/home/FeaturedSection';
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
  pages(locale: "${locale}") {
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

  // const heroResponse = await fetch(
  //   `${process.env.API_BASE_URL}/api/pages?filters[slug][$eq]=/&locale=${locale ?? 'en'}&populate[heroSection][populate]=*`
  // );
  // const spotlightResponse = await fetch(
  //   `${process.env.API_BASE_URL}/api/product-spotlights?filters[section_name][$eq]=productsSpotlight&locale=${locale ?? 'en'}&fields[0]=heading_in_black&fields[1]=heading_in_red&populate[products][fields][0]=name&populate[products][fields][1]=updatedAt&populate[products][fields][2]=spotlight_description&populate[products][populate][image_thumbnail][fields][1]=url&populate[products][populate][image_thumbnail][fields][2]=alternative_text`
  // );

  const response: HomepageResponseType = await fetchGraphql(
    getQueryHomePage(locale ?? 'en')
  );
  console.log(JSON.stringify(response));
  const homepageData = response?.data?.pages?.data[0] || null;
  const homepageError = response?.error || null;
  console.log('homepageError');
  console.log(homepageError);

  return (
    <>
      {(homepageError || homepageData === null) && (
        <p className='font-semiboldbold container mt-40 text-center text-xl text-black-light'>
          Error fetching home page data. Please try again later.
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
