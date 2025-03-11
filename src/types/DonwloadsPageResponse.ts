export type RelatedProductsInDownloadsPageQueryResponse = {
  data: {
    downloadPage: {
      data: {
        attributes: {
          related_products: {
            data: {
              id: string;
              attributes: {
                name: string;
                image_thumbnail: {
                  data: {
                    attributes: {
                      alternativeText: string | null;
                      name: string | null;
                      url: string | null;
                    };
                  };
                };
              };
            }[];
          };
        };
      } | null;
    };
  } | null;
  error?: string | null;
};

export interface DriversPageResponse {
  data: {
    products: {
      data:
        | {
            attributes: {
              driver: Driver | null;
            } | null;
          }[]
        | null;
      meta: {
        pagination: {
          total: number;
          page: number;
          pageSize: number;
          pageCount: number;
        };
      };
    };
  } | null;
  error?: null | string;
}
export interface DatasheetsPageResponse {
  data: {
    products: {
      data:
        | {
            attributes: {
              new_datasheet: datasheet | null;
            } | null;
          }[]
        | null;
      meta: {
        pagination: {
          total: number;
          page: number;
          pageSize: number;
          pageCount: number;
        };
      };
    };
  } | null;
  error?: null | string;
}

// export interface DriversPageIdsResponse {
//   data: {
//     downloadPage: {
//       data: {
//         attributes: {
//           drivers: { id: string }[] | null;
//         } | null;
//       } | null;
//     };
//   } | null;
//   error?: null | string;
// }

// export interface DatasheetsPageIdsResponse {
//   data: {
//     downloadPage: {
//       data: {
//         attributes: {
//           datasheets: { id: string }[] | null;
//         } | null;
//       } | null;
//     };
//   } | null;
//   error?: null | string;
// }

export interface Driver {
  id: string | null;
  title: string | null;
  system: string | null;
  applicable_model: string | null;
  file_link: string | null;
}
export interface datasheet {
  id: string | null;
  title: string | null;
  applicable_model: string | null;
  datasheet: {
    data: {
      attributes: {
        name: string | null;
        alternativeText: string | null;
        url: string | null;
      };
    } | null;
  } | null;
}
