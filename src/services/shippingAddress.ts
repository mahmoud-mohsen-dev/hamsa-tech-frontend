import {
  CreateAddressResponseType,
  GetAddressesResponseType
} from '@/types/addressResponseTypes';
import {
  fetchGraphqlClient,
  fetchGraphqlClientAuthenticated
} from './graphqlCrud';
import { capitalize } from '@/utils/helpers';

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
  userId: string | null;
  guestUserId: string | null;
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
  userId,
  guestUserId,
  firstName,
  lastName,
  deliveryPhone,
  shippingCostId
}: CreateAddressProps) => {
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
            user: ${userId ? `"${userId}"` : null}
            guest_user: ${guestUserId ? `"${guestUserId}"` : null}
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
  userId,
  guestUserId,
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
          userId,
          guestUserId,
          firstName,
          lastName,
          deliveryPhone,
          shippingCostId
        })
      )) as CreateAddressResponseType;

    if (addressData?.createAddress?.data?.id) {
      return {
        addressData: addressData.createAddress.data.id,
        addressError: null
      };
    }
    console.error(addressError);
    return { addressData: null, addressError: addressError };
  } catch (err) {
    console.error('Error creating billing address:', err);
    return { addressData: null, addressError: err };
  }
};

export const getShippingAddressQuery = () => {
  return `{
    me {
        addresses {
            address_name
            default
            first_name
            last_name
            address_1
            address_2
            building
            floor
            apartment
            city
            zip_code
            shipping_cost {
                data {
                    attributes {
                        governorate
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
            delivery_phone
            updatedAt
        }
    }
  }`;
};

export const getUserAddressesAuthenticated = async () => {
  try {
    const { data: addressData, error: addressError } =
      (await fetchGraphqlClientAuthenticated(
        getShippingAddressQuery()
      )) as GetAddressesResponseType;

    if (addressData?.me?.addresses) {
      return {
        addressData: addressData?.me?.addresses,
        addressError: null
      };
    }
    console.error(addressError);
    return { addressData: null, addressError: addressError };
  } catch (err) {
    console.error('Error creating billing address:', err);
    return {
      addressData: null,
      addressError: err ?? 'Error creating billing address'
    };
  }
};

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
