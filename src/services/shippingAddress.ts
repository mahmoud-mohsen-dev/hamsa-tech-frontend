import {
  AdressesType,
  CreateAddressResponseType,
  GetAddressesResponseType,
  GetAddressResponseType,
  updateAddressResponseType,
  updateDefaultAddressResponseType,
  updateUserAddressesResponseType
} from '@/types/addressResponseTypes';
import { fetchGraphqlClientAuthenticated } from './graphqlCrud';
import { capitalize } from '@/utils/helpers';
import { getIdFromToken } from '@/utils/cookieUtils';
import dayjs from 'dayjs';

export const getShippingQuery = (locale: string) => {
  return `{
    shippingCosts(locale: "${locale ?? 'en'}", pagination: { pageSize: 100 }, sort: "governorate:asc") {
        data {
            id
            attributes {
                governorate
                delivery_cost
                delivery_duration_in_days
            }
        }
    }
  }`;
};

interface CreateAddressProps {
  addressName?: string;
  isDefault?: boolean;
  city: string;
  address1: string;
  address2: string;
  building: string;
  floor: string;
  apartment: string;
  zipCode?: string;
  // userId: string | null;
  // guestUserId: string | null;
  firstName: string;
  lastName: string;
  deliveryPhone: string;
  shippingCostId: string | null;
}

export const getCreateShippingAddressQuery = ({
  addressName,
  isDefault,
  city,
  address1,
  address2,
  building,
  floor,
  apartment,
  zipCode,
  // userId,
  // guestUserId,
  firstName,
  lastName,
  deliveryPhone,
  shippingCostId
}: CreateAddressProps) => {
  // console.log(userId);
  // console.log(guestUserId);
  // user: ${userId ? `"${userId}"` : null}
  // guest_user: ${guestUserId ? `"${guestUserId}"` : null}
  return `mutation CreateAddress {
    createAddress(
        data: {
            address_name: "${capitalize(addressName ?? '')}"
            default: ${isDefault ?? false}
            city: "${capitalize(city ?? '')}"
            address_1: "${capitalize(address1 ?? '')}"
            address_2: "${capitalize(address2 ?? '')}"
            building: "${building}"
            floor: "${floor}"
            apartment: ${!isNaN(Number(apartment)) ? Number(apartment) : 0}
            zip_code: ${!isNaN(Number(zipCode)) ? Number(zipCode) : 0}
            first_name: "${capitalize(firstName ?? '')}"
            last_name: "${capitalize(lastName ?? '')}"
            delivery_phone: "${deliveryPhone ?? ''}"
            shipping_cost: ${shippingCostId ? `"${shippingCostId}"` : null}
            publishedAt: "${new Date().toISOString()}"
        }
    ) {
        data {
            id
        }
    }
  }`;
};

export const createAddress = async ({
  addressName,
  isDefault,
  city,
  address1,
  address2,
  building,
  floor,
  apartment,
  zipCode,
  // userId,
  // guestUserId,
  firstName,
  lastName,
  deliveryPhone,
  shippingCostId
}: CreateAddressProps) => {
  try {
    const { data: addressData, error: addressError } =
      (await fetchGraphqlClientAuthenticated(
        getCreateShippingAddressQuery({
          addressName: addressName ?? '',
          isDefault: isDefault ?? false,
          city,
          address1,
          address2,
          building,
          floor,
          apartment,
          zipCode,
          // userId,
          // guestUserId,
          firstName,
          lastName,
          deliveryPhone,
          shippingCostId
        })
      )) as CreateAddressResponseType;

    console.log(addressData?.createAddress?.data);
    if (addressData?.createAddress?.data?.id) {
      return {
        addressData: addressData.createAddress.data.id,
        addressError: null
      };
    }
    console.error(addressError);
    return { addressData: null, addressError: addressError };
  } catch (err) {
    console.error('Error creating address:', err);
    return { addressData: null, addressError: err };
  }
};

export const getShippingAddressesQuery = (userId: string | null) => {
  return `query UsersPermissionsUser {
    usersPermissionsUser(id: ${userId ? `"${userId}"` : null}) {
        data {
            attributes {
                addresses(sort: "updatedAt:asc", pagination: { pageSize: 100 }) {
                    data {
                        id
                        attributes {
                            city
                            address_1
                            address_2
                            zip_code
                            first_name
                            last_name
                            delivery_phone
                            building
                            floor
                            apartment
                            address_name
                            default
                            shipping_cost {
                                data {
                                    attributes {
                                        governorate
                                        delivery_cost
                                        localizations {
                                            data {
                                                attributes {
                                                    governorate
                                                    locale
                                                }
                                            }
                                        }
                                        locale
                                    }
                                }
                            }
                            updatedAt
                        }
                    }
                }
            }
        }
    }
  }`;
};

export const getUserAddressesAuthenticated = async () => {
  try {
    const userId = getIdFromToken();
    const { data: addressData, error: addressError } =
      (await fetchGraphqlClientAuthenticated(
        getShippingAddressesQuery(userId)
      )) as GetAddressesResponseType;

    if (
      addressData?.usersPermissionsUser?.data?.attributes?.addresses
        ?.data
    ) {
      return {
        addressesData:
          addressData.usersPermissionsUser.data.attributes.addresses
            .data,
        addressesError: null
      };
    }
    console.error(addressError);
    return { addressesData: null, addressesError: addressError };
  } catch (err) {
    console.error('Error fetching user addresses:', err);
    return {
      addressesData: null,
      addressesError: err ?? 'Error fetching user addresses'
    };
  }
};

const updateUserAddressQuery = ({
  addressesId,
  userId
}: {
  addressesId: number[] | string[];
  userId: string | null;
}) => {
  return `mutation UpdateUser {
    updateUser(input: { addresses: [${addressesId.join()}] }, id: ${userId ? `"${userId}"` : null}) {
        data {
            attributes {
                addresses(sort: "updatedAt:asc", pagination: { pageSize: 100 }) {
                    data {
                        id
                        attributes {
                            city
                            address_1
                            address_2
                            zip_code
                            first_name
                            last_name
                            delivery_phone
                            building
                            floor
                            apartment
                            address_name
                            default
                            shipping_cost {
                                data {
                                    attributes {
                                        governorate
                                        delivery_cost
                                        localizations {
                                            data {
                                                attributes {
                                                    governorate
                                                    locale
                                                }
                                            }
                                        }
                                        locale
                                    }
                                }
                            }
                            updatedAt
                        }
                    }
                }
            }
        }
    }
  }`;
};

export const updateUserAddresses = async ({
  addressesId
}: {
  addressesId: number[] | string[];
}) => {
  try {
    const userId = getIdFromToken();
    const { data, error } = (await fetchGraphqlClientAuthenticated(
      updateUserAddressQuery({ addressesId, userId })
    )) as updateUserAddressesResponseType;

    if (data?.updateUser?.data?.attributes?.addresses?.data) {
      return {
        addressesData: data.updateUser.data.attributes.addresses.data,
        addressesError: null
      };
    }
    console.error(error);
    return { addressesData: null, addressesError: error };
  } catch (error) {
    console.error('Error updating user addresses:', error);
    return {
      addressesData: null,
      addressesError: error || 'Error updating user addresses'
    };
  }
};

export const getShippingAddressQuery = (
  userId: string | null,
  addressId: string
) => {
  return `query UsersPermissionsUser {
    usersPermissionsUser(id: ${userId ? `"${userId}"` : null}) {
        data {
            attributes {
                addresses(sort: "updatedAt:asc", pagination: { pageSize: 100 }, filters: { id: { eq: "${addressId}" } }) {
                    data {
                        id
                        attributes {
                            city
                            address_1
                            address_2
                            zip_code
                            first_name
                            last_name
                            delivery_phone
                            building
                            floor
                            apartment
                            address_name
                            default
                            shipping_cost {
                                data {
                                    attributes {
                                        governorate
                                        delivery_cost
                                        localizations {
                                            data {
                                                attributes {
                                                    governorate
                                                    locale
                                                }
                                            }
                                        }
                                        locale
                                    }
                                }
                            }
                            updatedAt
                        }
                    }
                }
            }
        }
    }
  }`;
};

export const getUserAddressAuthenticated = async (
  addressId: string
) => {
  try {
    const userId = getIdFromToken();
    const { data: addressData, error: addressError } =
      (await fetchGraphqlClientAuthenticated(
        getShippingAddressQuery(userId, addressId)
      )) as GetAddressResponseType;

    if (
      addressData?.usersPermissionsUser?.data?.attributes?.addresses
        ?.data &&
      addressData?.usersPermissionsUser?.data?.attributes?.addresses
        ?.data?.length >= 1
    ) {
      return {
        addressData:
          addressData.usersPermissionsUser.data.attributes.addresses
            .data[0],
        addressError: null
      };
    }
    console.error(addressError);
    return { addressData: null, addressError: addressError };
  } catch (err) {
    console.error('Error fetching user address:', err);
    return {
      addressData: null,
      addressError: err ?? 'Error fetching user address'
    };
  }
};

interface UpdateAddressProps {
  addressId: string | null;
  city: string;
  address1: string;
  address2: string;
  zipCode: number | undefined;
  shippingCostId: string;
  firstName: string;
  lastName: string;
  deliveryPhone: string;
  building: string;
  floor: string;
  apartment: number;
  addressName: string;
  isDefault: boolean;
}

const updateAddressQuery = ({
  addressId,
  city,
  address1,
  address2,
  zipCode,
  shippingCostId,
  firstName,
  lastName,
  deliveryPhone,
  building,
  floor,
  apartment,
  addressName,
  isDefault
}: UpdateAddressProps) => {
  return `mutation UpdateAddress {
    updateAddress(
        id: ${addressId ? `${addressId}` : null}
        data: {
            city: "${city}"
            address_1: "${address1}"
            address_2: "${address2}"
            zip_code: ${zipCode}
            shipping_cost: ${shippingCostId ? `${shippingCostId}` : null}
            first_name: "${firstName ?? ''}"
            last_name: "${lastName ?? ''}"
            delivery_phone: "${deliveryPhone ?? ''}"
            building: "${building ?? ''}"
            floor: "${floor ?? ''}"
            apartment: ${apartment ?? null}
            address_name: "${addressName ?? ''}"
            default: ${isDefault ?? false}
        }
    ) {
        data {
            id
        }
    }
  }`;
};

export const updateAddress = async (
  updatedAddress: UpdateAddressProps
) => {
  try {
    const { data, error } = (await fetchGraphqlClientAuthenticated(
      updateAddressQuery(updatedAddress)
    )) as updateAddressResponseType;

    if (data?.updateAddress?.data?.id) {
      return {
        addressData: data.updateAddress.data.id,
        addressError: null
      };
    }
    // console.error(error);
    return { addressData: null, addressError: error };
  } catch (error) {
    // console.error('Error occured while updating address:', error);
    return {
      addressData: null,
      addressError: error || 'Error occured while updating address'
    };
  }
};

const updateDefaultAddressQuery = ({
  id,
  isDefault
}: {
  id: string | null;
  isDefault: boolean;
}) => {
  return `mutation UpdateAddress {
    updateAddress(
        id: ${id ? `${id}` : null}
        data: {
            default: ${isDefault ?? false}
        }
    ) {
        data {
            id
            attributes {
                city
                address_1
                address_2
                zip_code
                first_name
                last_name
                delivery_phone
                building
                floor
                apartment
                address_name
                default
                shipping_cost {
                    data {
                        attributes {
                            governorate
                            delivery_cost
                            localizations {
                                data {
                                    attributes {
                                        governorate
                                        locale
                                    }
                                }
                            }
                            locale
                        }
                    }
                }
                updatedAt
            }
        }
    }
  }`;
};

function sortAndValidateData(data: AdressesType[]) {
  if (!Array.isArray(data)) {
    throw new Error('The input data must be an array.');
  }

  return data
    .map((item) => {
      const dateValue = item['attributes']['updatedAt'];
      if (!dayjs(dateValue).isValid()) {
        throw new Error(`Invalid ISO date string: ${dateValue}`);
      }
      return item;
    })
    .sort(
      (a, b) =>
        dayjs(b['attributes']['updatedAt']).valueOf() -
        dayjs(a['attributes']['updatedAt']).valueOf()
    );
}

export const updateDefaultAddress = async ({
  addresses,
  defaultAddressId
}: {
  addresses: {
    id: string | null;
    isDefault: boolean;
  }[];
  defaultAddressId: string | null;
}) => {
  try {
    const updatedAddresses = [];
    for (const address of addresses) {
      if (address.id === defaultAddressId) {
        address.isDefault = true;

        const { data, error } =
          (await fetchGraphqlClientAuthenticated(
            updateDefaultAddressQuery(address)
          )) as updateDefaultAddressResponseType;

        if (error) {
          throw new Error('Failed to update default address');
        }

        if (
          !data?.updateAddress?.data?.id ||
          !data?.updateAddress?.data?.attributes
        ) {
          throw new Error(
            `Couldn't update address id: ${address?.id ?? ''}`
          );
        }

        updatedAddresses.push(data.updateAddress.data);
      } else {
        address.isDefault = false;

        const { data, error } =
          (await fetchGraphqlClientAuthenticated(
            updateDefaultAddressQuery(address)
          )) as updateDefaultAddressResponseType;

        if (error) {
          throw new Error(
            error ||
              `Couldn't update address id: ${address?.id ?? ''}`
          );
        }

        if (
          !data?.updateAddress?.data?.id ||
          !data?.updateAddress?.data?.attributes
        ) {
          throw new Error(
            `Couldn't update address id: ${address?.id ?? ''}`
          );
        }

        updatedAddresses.push(data.updateAddress.data);
      }
    }

    console.log(updatedAddresses);
    // const orderedAddresses = sortAndValidateData(updatedAddresses);
    // console.log('orderedAddresses', orderedAddresses);

    return { addressesData: updatedAddresses, addressesError: null };
  } catch (error) {
    // console.error('Error occured while updating addresses:', error);
    return {
      addressesData: null,
      addressesError:
        error || 'Error occured while updating addresses'
    };
  }
};

export const deleteAddress = async (addressId: string | null) => {
  try {
    const { data, error } =
      await fetchGraphqlClientAuthenticated(`mutation DeleteAddress {
    deleteAddress(id: ${addressId ? `${addressId}` : null}) {
        data {
            id
        }
    }
  }`);

    if (error || !data?.deleteAddress?.data?.id) {
      throw new Error('Failed to delete address');
    }
    return {
      deletedAddressId: data.deleteAddress.data.id as string,
      deletedAddressError: null
    };
  } catch (error: any) {
    // console.error('Error occurred while deleting address:', error);
    return {
      deletedAddressId: null,
      deletedAddressError:
        error?.message ?
          error?.message
        : error || 'Error occurred while deleting address'
    };
  }
};
