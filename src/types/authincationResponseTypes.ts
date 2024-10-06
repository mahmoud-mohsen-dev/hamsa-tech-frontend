export type SignupResponseType = {
  error: string | null;
  data: {
    register?: {
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
