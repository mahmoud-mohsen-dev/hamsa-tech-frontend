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
            // leaflet_map: {
            //   type: string;
            //   features: [
            //     {
            //       type: string;
            //       geometry: {
            //         type: string | null;
            //         coordinates: [number, number] | null;
            //       } | null;
            //       properties: {
            //         icon: {
            //           options: {
            //             iconUrl: string | null;
            //             iconSize: [number, number] | null;
            //             shadowUrl: string | null;
            //             iconAnchor: [number, number] | null;
            //             shadowSize: [number, number] | null;
            //             popupAnchor: [number, number] | null;
            //             shadowAnchor: [number, number] | null;
            //             iconRetinaUrl: string | null;
            //             tooltipAnchor: [number, number] | null;
            //           };
            //           _needsInit: boolean;
            //           _initHooksCalled: boolean;
            //         };
            //         pane: 'markerPane';
            //         shape: 'Marker';
            //         draggable: boolean;
            //       };
            //     }
            //   ];
            // } | null;
          }[];
        };
      } | null;
    };
  } | null;
  error: string | null;
};
