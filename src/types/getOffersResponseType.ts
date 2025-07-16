export type OfferDataType = {
  id: string;
  attributes: {
    start_date: string;
    expiration_date: string;
    image: {
      data: {
        attributes: {
          alternativeText: string | null;
          url: string | null;
        };
      } | null;
    };
    offer_link: string | null;
    hide_this_offer: boolean | null;
  };
};

export type GetOffersResponseType = {
  data: {
    offers: {
      data: OfferDataType[];
    };
  } | null;
  error?: string | null;
};
