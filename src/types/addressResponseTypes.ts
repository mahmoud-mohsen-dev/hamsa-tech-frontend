export interface CreateAddressResponseType {
  data: {
    createAddress: {
      data: {
        id: string;
      } | null;
    };
  } | null;
  error: string | null;
}

export interface updateAddressResponseType {
  data: {
    updateAddress: {
      data: {
        id: string;
      } | null;
    };
  } | null;
  error: string | null;
}

export interface AdressesType {
  id: string;
  attributes: {
    city: string;
    address_1: string;
    address_2: string;
    zip_code: number;
    first_name: string;
    last_name: string;
    delivery_phone: string;
    building: string;
    floor: string;
    apartment: number;
    address_name: string;
    default: boolean;
    shipping_cost: {
      data: {
        attributes: {
          governorate: string;
          delivery_cost: number;
          localizations: {
            data: Array<{
              attributes: {
                governorate: string;
                locale: string;
              };
            }>;
          };
          locale: string;
        };
      };
    };
    updatedAt: string; // ISO date string
  };
}

export interface GetAddressesResponseType {
  data: {
    usersPermissionsUser: {
      data: {
        attributes: {
          addresses: {
            data: AdressesType[] | null;
          };
        };
      } | null;
    };
  } | null;
  error: string | null;
}

export interface updateUserAddressesResponseType {
  data: {
    updateUser: {
      data: {
        attributes: {
          addresses: {
            data: AdressesType[] | null;
          };
        };
      } | null;
    };
  } | null;
  error: string | null;
}

export interface GetAddressResponseType {
  data: {
    usersPermissionsUser: {
      data: {
        attributes: {
          addresses: {
            data: AdressesType[] | null;
          };
        };
      } | null;
    };
  } | null;
  error: string | null;
}

export interface updateDefaultAddressResponseType {
  data: {
    updateAddress: {
      data: AdressesType | null;
    };
  } | null;
  error: string | null;
}
