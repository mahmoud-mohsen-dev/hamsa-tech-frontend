export interface CreateGuestUserResponseType {
  data: {
    createGuestUser: {
      data: {
        id: string;
      } | null;
    };
  } | null;
  error: string | null;
}

export interface UpdateGuestUserResponseType {
  data: {
    updateGuestUser: {
      data: {
        id: string;
      } | null;
    };
  } | null;
  error: string | null;
}
