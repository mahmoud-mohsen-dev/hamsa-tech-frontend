export type getAboutUsPageResponseType = {
  data: {
    aboutUs: {
      data: {
        attributes: {
          title: string;
          description: string;
          top_image: {
            data: {
              attributes: {
                alternativeText: string;
                url: string;
              };
            };
          };
          branch: {
            location: {
              address: string;
              geohash: string;
              coordinates: {
                lat: number;
                lng: number;
              };
            };
            address: string;
            phone: {
              phone_number: string;
              id: string;
            }[];
            name: string;
            id: string;
          }[];
        };
      } | null;
    };
  } | null;
  error: string | null;
};
