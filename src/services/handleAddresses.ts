import { AdressType } from '@/types/addressResponseTypes';
import { updateDefaultAddress } from './shippingAddress';

export function getDefaultActiveAddressId(
  addressesData: AdressType[] | null
) {
  return addressesData && addressesData.length > 0 ?
      (addressesData
        .map((address) =>
          address?.attributes?.default ? address.id : null
        )
        .filter((address) => address !== null)
        .at(-1) ?? null)
    : null;
  // (addressesData[0].id || null))null
}

export function getDefaultActiveAddressData(
  addressesData: AdressType[] | null
) {
  if (addressesData && addressesData.length > 0) {
    const defaultAddress = addressesData.find(
      (address) =>
        address?.attributes?.default &&
        address?.attributes?.delivery_zone?.zone_name_in_arabic &&
        address?.attributes?.delivery_zone?.zone_name_in_english
    );
    if (defaultAddress) {
      return defaultAddress.attributes;
    }

    return null;
  }
  return null;
  // (addressesData[0].id || null))null
}

export const updateDefaultAddressHandler = async ({
  newDefaultAddressId,
  addressesData,
  setErrorMessage,
  setAddressesData
}: {
  newDefaultAddressId: string | null;
  addressesData: AdressType[] | null;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setAddressesData: React.Dispatch<
    React.SetStateAction<AdressType[] | null>
  >;
}) => {
  if (
    !addressesData ||
    addressesData?.length <= 0 ||
    !newDefaultAddressId
  ) {
    console.error('addressesData', addressesData);
    console.error('newDefaultAddressId', newDefaultAddressId);
    setErrorMessage('Something went wrong, please try again later!');
    return;
  }

  const newArr = addressesData.map((address) => ({
    id: address?.id ?? null,
    isDefault: address?.attributes?.default ?? false
  }));

  try {
    const { addressesData: updatedAddressesData, addressesError } =
      await updateDefaultAddress({
        addresses: newArr,
        defaultAddressId: newDefaultAddressId
      });

    if (addressesError || !updatedAddressesData) {
      console.error('addressesError', addressesError);
      console.error('updatedAddressesData', updatedAddressesData);
      setErrorMessage(
        typeof addressesError === 'string' ? addressesError : (
          'Something went wrong, please try again later!'
        )
      );
      return;
    }

    console.log(updatedAddressesData);
    setAddressesData(updatedAddressesData);
    return updatedAddressesData;
  } catch (error) {
    console.error('error', error);
    setErrorMessage('Something went wrong, please try again later!');
    return;
  }
};
