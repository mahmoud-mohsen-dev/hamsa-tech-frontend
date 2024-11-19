import { getIdFromToken } from '@/utils/cookieUtils';
import { fetchGraphqlClientAuthenticated } from './graphqlCrud';
import {
  ChangePasswordResponse,
  getUserProfileSettingsResponse,
  updateUserProfileSettingsResponse
} from '@/types/userResponseTypes';
import { capitalize } from '@/utils/helpers';

const profileInfoQuery = (userID: string) => {
  return `query usersPermissionsUser {
    usersPermissionsUser(id: "${userID}") {
        data {
            attributes {
                first_name
                last_name
                email
                phone
                birth_date
            }
        }
    }
  }`;
};

type updateProfileSettignsDataProps = {
  userID: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string | null;
};

const updateProfileSettingsQuery = ({
  userID,
  firstName,
  lastName,
  email,
  phone,
  birthDate
}: updateProfileSettignsDataProps) => {
  //   const input = {};
  //   firstName && input.firstName = firstName;
  const input = {
    first_name: capitalize(firstName),
    last_name: capitalize(lastName),
    email: email,
    phone: phone,
    birth_date: birthDate
  };
  //   console.log(input);

  // Convert the object to GraphQL-compatible string
  const inputString = Object.entries(input)
    .map(([key, value]) => {
      // Add quotes around string values
      const formattedValue =
        typeof value === 'string' ? `"${value}"` : value;
      return `${key}: ${formattedValue}`;
    })
    .join(', ');
  //   console.log(inputString);

  return `mutation UpdateUser {
        updateUser(
            id: "${userID}"
            input: { ${inputString} }
        ) {
            data {
                attributes {
                    first_name
                    last_name
                    email
                    phone
                    birth_date
                }
            }
        }
    }`;
};

export const getProfileSettignsData = async () => {
  try {
    const userId = getIdFromToken();
    const { data, error } = (await fetchGraphqlClientAuthenticated(
      profileInfoQuery(userId ?? '')
    )) as getUserProfileSettingsResponse;

    if (error || !data?.usersPermissionsUser?.data?.attributes) {
      console.error('Failed to fetch profile settings', error);
      return null;
    }

    return data.usersPermissionsUser.data.attributes;
  } catch (err) {
    console.error('Failed to fetch profile settings', err);
    return null;
  }
};

export const updateProfileSettignsData = async ({
  firstName,
  lastName,
  email,
  phone,
  birthDate
}: Omit<updateProfileSettignsDataProps, 'userID'>) => {
  try {
    const userId = getIdFromToken();
    const { data, error } = (await fetchGraphqlClientAuthenticated(
      updateProfileSettingsQuery({
        userID: userId ?? '',
        firstName,
        lastName,
        email,
        phone,
        birthDate
      })
    )) as updateUserProfileSettingsResponse;

    if (error || !data?.updateUser?.data?.attributes) {
      console.error('Failed to update profile settings', error);
      return null;
    }

    return data.updateUser.data.attributes;
  } catch (err) {
    console.error('Failed to update profile settings', err);
    return null;
  }
};

const changePasswordQuery = ({
  currentPassword,
  newPassword,
  confirmNewPassword
}: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  return `mutation ChangePassword {
        changePassword(
            currentPassword: "${currentPassword}"
            password: "${newPassword}"
            passwordConfirmation: "${confirmNewPassword}"
        ) {
            jwt
            user {
                id
            }
        }
    }`;
};

export const changePassword = async ({
  currentPassword,
  newPassword,
  confirmNewPassword
}: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}) => {
  try {
    const { data, error } = (await fetchGraphqlClientAuthenticated(
      changePasswordQuery({
        currentPassword,
        newPassword,
        confirmNewPassword
      })
    )) as ChangePasswordResponse;

    if (
      error ||
      !data?.changePassword?.jwt ||
      !data?.changePassword?.user?.id
    ) {
      throw new Error(`${error ? `${error}` : ''}`);
    }

    return {
      jwt: data.changePassword.jwt,
      id: data.changePassword.user.id
    };
  } catch (err: any) {
    console.error(err?.message ?? '');
    throw new Error(`${err?.message ?? ''}`);
  }
};

export const deleteUser = async () => {
  try {
    const userId = getIdFromToken();
    const { data, error } =
      await fetchGraphqlClientAuthenticated(`mutation {
        deleteUser(id: "${userId}")
    }`);
    if (error) {
      throw new Error(`${error || ''}`);
    }
    if (!data?.deleteUser) {
      throw new Error(`Failed to delete account`);
    }

    return data.deleteUser;
  } catch (err: any) {
    console.error(err?.message ?? '');
    throw new Error(`${err?.message ?? ''}`);
  }
};
