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
