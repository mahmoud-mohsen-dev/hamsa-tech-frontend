import { generateISODateForGraphQL } from '@/utils/dateHelpers';

export const getOffersQuery = (locale: string) => {
  return `{
        offers(
            filters: {
                start_date: { lte: "${generateISODateForGraphQL()}" }
                expiration_date: { gte: "${generateISODateForGraphQL()}" }
                hide_this_offer: { eq: false }
            }
            sort: ["expiration_date:asc", "start_date:asc"]
            locale: "${locale ?? 'ar'}"
        ) {
            data {
                id
                attributes {
                    start_date
                    expiration_date
                    image {
                        data {
                            attributes {
                                alternativeText
                                url
                            }
                        }
                    }
                    offer_link
                    hide_this_offer
                }
            }
        }
    }`;
};
