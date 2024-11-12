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
  address_name: string;
  default: boolean;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  building: string;
  floor: string;
  apartment: number | string;
  city: string;
  zip_code: number;
  shipping_cost: {
    data: {
      attributes: {
        governorate: string;
        localizations: {
          data: {
            attributes: {
              governorate: string;
              locale: string;
            };
          }[];
        };
        locale: string;
      };
    };
  };
  delivery_phone: string;
  updatedAt: string;
}

export interface GetAddressesResponseType {
  data: {
    me: {
      addresses: AdressesType[];
    };
  } | null;
  error: string | null;
}
