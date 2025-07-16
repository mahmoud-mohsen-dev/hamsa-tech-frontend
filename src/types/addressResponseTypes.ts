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

export interface AdressType {
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
    delivery_zone: {
      zone_name_in_arabic: string | null;
      zone_name_in_english: string | null;
      minimum_delivery_duration_in_days: number | null;
      maximum_delivery_duration_in_days: number | null;
    } | null;
    updatedAt: string; // ISO date string
  };
}

export interface GetAddressesResponseType {
  data: {
    usersPermissionsUser: {
      data: {
        attributes: {
          addresses: {
            data: AdressType[] | null;
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
            data: AdressType[] | null;
          };
        };
      } | null;
    };
  } | null;
  error: string | null;
}

export interface getAddressResponseType {
  data: {
    usersPermissionsUser: {
      data: {
        attributes: {
          addresses: {
            data: AdressType[] | null;
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
      data: AdressType | null;
    };
  } | null;
  error: string | null;
}
