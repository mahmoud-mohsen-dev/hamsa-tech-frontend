import {
  AdressType,
  CreateAddressResponseType,
  GetAddressesResponseType,
  getAddressResponseType,
  updateAddressResponseType,
  updateDefaultAddressResponseType,
  updateUserAddressesResponseType
} from '@/types/addressResponseTypes';
import { fetchGraphqlClientAuthenticated } from './graphqlCrud';
import { capitalize } from '@/utils/helpers';
import { getIdFromToken } from '@/utils/cookieUtils';
import dayjs from 'dayjs';

export const getShippingQuery = () => {
  const firstDay = dayjs().startOf('month'); // local time
  const lastDay = dayjs().endOf('month'); // local time

  const firstDayISO = firstDay.format();
  const lastDayISO = lastDay.format();

  console.log('First day ISO:', firstDayISO); // '2025-05-01T00:00:00+03:00'
  console.log('Last day ISO:', lastDayISO); // '2025-05-31T23:59:59+03:00'

  return `{
    shippingConfig {
        data {
            attributes {
                default_shipping_company {
                    data {
                        id
                        attributes {
                            delivery_zones(pagination: { page: 1, pageSize: 1000 }) {
                                zone_name_in_arabic
                                zone_name_in_english
                                id
                                minimum_delivery_duration_in_days
                                maximum_delivery_duration_in_days
                                calculated_delivery_cost
                            }
                            cash_on_delivery_cost
                            include_cash_on_delivery_in_total_shipping_cost
                            bank_fees_for_each_transfer(pagination: { page: 1, pageSize: 1000 }) {
                                id
                                include_the_fee_in_total_shipping_cost
                                minimum_total_order_price_to_apply_fee
                                fixed_fee_amount
                                percentage_based_fee
                                comment
                                money_increment_amount
                                fixed_extra_fee_per_increment
                                VAT
                                add_base_fees_to_total_increment_fee
                                apply_difference_based_fee
                            }
                            extra_shipping_company_fees_for_cash_on_delivery(
                                pagination: { page: 1, pageSize: 1000 }
                            ) {
                                id
                                include_the_fee_in_total_shipping_cost
                                minimum_total_order_price_to_apply_fee
                                fixed_fee_amount
                                percentage_based_fee
                                comment
                                money_increment_amount
                                fixed_extra_fee_per_increment
                                VAT
                                add_base_fees_to_total_increment_fee
                                apply_difference_based_fee
                            }
                            flyers {
                                include_flyer_cost_in_total_shipping_cost
                                total_flyers_free_every_month
                                average_cost_per_flyer
                            }
                            weight {
                                enable_maximum_weight_fee_for_standard_shipping_in_grams
                                maximum_weight_for_standard_shipping_in_grams
                                volumetric_weight_applied_if_needed
                                volumetric_weight_applied_if_needed_in_grams
                                fixed_extra_fee_per_increment
                                weight_increment_for_fixed_fee_in_grams
                                VAT
                                apply_difference_based_fee
                            }
                            shipping_company_name
                            other_compnay_fees(pagination: { page: 1, pageSize: 1000 }) {
                                id
                                include_the_fee_in_total_shipping_cost
                                minimum_total_order_price_to_apply_fee
                                fixed_fee_amount
                                percentage_based_fee
                                comment
                                money_increment_amount
                                fixed_extra_fee_per_increment
                                VAT
                                add_base_fees_to_total_increment_fee
                                apply_difference_based_fee
                            }
                            orders(
                                filters: {
                                    createdAt: {
                                        gte: ${dayjs(firstDayISO).isValid() ? `"${firstDayISO}"` : null}
                                        lte: ${dayjs(lastDayISO).isValid() ? `"${lastDayISO}"` : null}
                                    }
                                }
                                pagination: { page: 1, pageSize: 100000 }
                            ) {
                                data {
                                    id
                                }
                            }
                        }
                    }
                }
                add_to_total_shipping_cost
                deduct_from_total_shipping_cost
                enable_checkout
            }
        }
    }
  }`;
};

interface CreateAddressProps {
  userId: string | null;
  guestUserId: string | null;
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
  // shippingCostId: string | null;
  deliveryZone: {
    zoneNameInArabic: string | null;
    zoneNameInEnglish: string | null;
    minimumDeliveryDurationInDays: number | null;
    maximumDeliveryDurationInDays: number | null;
  } | null;
}

export const getCreateShippingAddressQuery = ({
  userId,
  guestUserId,
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
  deliveryZone
}: CreateAddressProps) => {
  // console.log(userId);
  // console.log(guestUserId);
  return `mutation CreateAddress {
    createAddress(
        data: {
            user: ${userId ? `"${userId}"` : null}
            guest_user: ${guestUserId ? `"${guestUserId}"` : null}
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
            delivery_zone:  ${
              (
                deliveryZone?.zoneNameInArabic ||
                deliveryZone?.zoneNameInEnglish
              ) ?
                `{
                  zone_name_in_arabic: ${deliveryZone?.zoneNameInArabic ? `"${deliveryZone.zoneNameInArabic}"` : null},
                  zone_name_in_english: ${deliveryZone?.zoneNameInEnglish ? `"${deliveryZone.zoneNameInEnglish}"` : null}
                  ${deliveryZone?.minimumDeliveryDurationInDays ? `, minimum_delivery_duration_in_days: ${deliveryZone.minimumDeliveryDurationInDays}` : ''}
                  ${deliveryZone?.maximumDeliveryDurationInDays ? `, maximum_delivery_duration_in_days: ${deliveryZone.maximumDeliveryDurationInDays}` : ''}
                }
                `
              : null
            }
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
  userId,
  guestUserId,
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
  // shippingCostId
  deliveryZone
}: CreateAddressProps) => {
  try {
    const { data: addressData, error: addressError } =
      (await fetchGraphqlClientAuthenticated(
        getCreateShippingAddressQuery({
          userId,
          guestUserId,
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
          deliveryZone
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
                            delivery_zone {
                                zone_name_in_arabic
                                zone_name_in_english
                                minimum_delivery_duration_in_days
                                maximum_delivery_duration_in_days
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

    if (!userId) {
      return {
        addressesData: null,
        addressesError: 'The user is not logged in.'
      };
    }

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
    // console.error(addressError);
    return { addressesData: null, addressesError: addressError };
  } catch (err) {
    console.error('Error fetching user addresses:', err);
    return {
      addressesData: null,
      addressesError: err ?? 'Error fetching user addresses'
    };
  }
};

export const getUserAddressesData = async () => {
  const { addressesData, addressesError } =
    await getUserAddressesAuthenticated();
  if (addressesError || !addressesData) {
    console.error(addressesError);
    return null;
  }
  console.log(addressesData);
  return addressesData;
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
                            delivery_zone {
                                zone_name_in_arabic
                                zone_name_in_english
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
                            delivery_zone {
                                zone_name_in_arabic
                                zone_name_in_english
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
      )) as getAddressResponseType;

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
  // shippingCostId: string;
  firstName: string;
  lastName: string;
  deliveryPhone: string;
  building: string;
  floor: string;
  apartment: number;
  addressName: string;
  isDefault: boolean;
  deliveryZone: {
    zoneNameInArabic: string | null;
    zoneNameInEnglish: string | null;
    minimumDeliveryDurationInDays: number | null;
    maximumDeliveryDurationInDays: number | null;
  } | null;
}

const updateAddressQuery = ({
  addressId,
  city,
  address1,
  address2,
  zipCode,
  // shippingCostId,
  firstName,
  lastName,
  deliveryPhone,
  building,
  floor,
  apartment,
  addressName,
  isDefault,
  deliveryZone
}: UpdateAddressProps) => {
  return `mutation UpdateAddress {
    updateAddress(
        id: ${addressId ? `${addressId}` : null}
        data: {
            city: "${city}"
            address_1: "${address1}"
            address_2: "${address2}"
            zip_code: ${zipCode}
            delivery_zone:  ${
              (
                deliveryZone?.zoneNameInArabic ||
                deliveryZone?.zoneNameInEnglish
              ) ?
                `{
                  zone_name_in_arabic: ${deliveryZone?.zoneNameInArabic ? `"${deliveryZone.zoneNameInArabic}"` : null},
                  zone_name_in_english: ${deliveryZone?.zoneNameInEnglish ? `"${deliveryZone.zoneNameInEnglish}"` : null}
                }
                `
              : null
            }
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
                delivery_zone {
                  zone_name_in_arabic
                  zone_name_in_english
                }
                updatedAt
            }
        }
    }
  }`;
};

function sortAndValidateData(data: AdressType[]) {
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
        console.log(address.id === defaultAddressId);
        console.log(address.id);
        console.log(defaultAddressId);
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

export const handleShippingAddresses = async ({
  setIsAddressIsLoading,
  setAddressesData
}: {
  setIsAddressIsLoading: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setAddressesData: React.Dispatch<
    React.SetStateAction<AdressType[] | null>
  >;
}) => {
  try {
    setIsAddressIsLoading(true);
    const { addressesData, addressesError } =
      await getUserAddressesAuthenticated();
    if (addressesError || !addressesData) {
      console.error(addressesError);
      setAddressesData(null);
      return null;
    }
    // console.log(addressesData);
    setAddressesData(addressesData);
  } catch (error) {
    console.error('Failed to fetch addresses', error);
    setAddressesData(null);
    return null;
  } finally {
    setIsAddressIsLoading(false);
  }
};
