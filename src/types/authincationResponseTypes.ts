export type SignupResponseType = {
  error: string | null;
  data: {
    register?: {
      jwt: string;
    };
  } | null;
};

export type SigninResponseType = {
  error: string | null;
  data: {
    login?: {
      jwt: string;
    };
  } | null;
};

export type UpdateSignupUserResponseType = {
  error: string | null;
  data: {
    updateUsersPermissionsUser: {
      data: {
        id: string;
      };
    };
  } | null;
};
