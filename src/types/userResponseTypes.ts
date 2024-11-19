export type getUserAvatarPhotoResponse = {
  data: {
    usersPermissionsUser: {
      data: {
        attributes: {
          avatar_photo: {
            data: {
              id: string;
              attributes: {
                alternativeText: string;
                url: string;
                name: string;
              };
            } | null;
          };
        };
      } | null;
    };
  } | null;
  error?: null | string;
};

export type getUserProfileSettingsResponse = {
  data: {
    usersPermissionsUser: {
      data: {
        attributes: {
          first_name: null | string;
          last_name: null | string;
          email: string;
          phone: string;
          birth_date: null | string;
        };
      } | null;
    };
  } | null;
  error?: null | string;
};

export type updateUserProfileSettingsResponse = {
  data: {
    updateUser: {
      data: {
        attributes: {
          first_name: string | null;
          last_name: string | null;
          email: string;
          phone: string | null;
          birth_date: string | null;
        };
      } | null;
    };
  } | null;
  error?: null | string;
};

export type ChangePasswordResponse = {
  data: {
    changePassword: {
      jwt: string;
      user: {
        id: string;
      };
    };
  } | null;
  error?: null | string;
};
