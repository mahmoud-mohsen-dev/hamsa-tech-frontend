import { useMyContext } from '@/context/Store';
import { formatCurrencyNumbers } from '@/utils/numbersFormating';
import { useLocale, useTranslations } from 'next-intl';

function ShippingCost() {
  const {
    selectedGovernorate,
    freeShippingAt,
    calculateSubTotalCartCost
  } = useMyContext();
  const locale = useLocale();
  const t = useTranslations('CheckoutPage.content');
  const subTotalCost = calculateSubTotalCartCost();
  let applyFreeShipping = false;
  if (
    freeShippingAt?.apply_free_shipping_if_total_cart_cost_equals &&
    freeShippingAt.enable
  ) {
    applyFreeShipping =
      subTotalCost > 0 &&
      subTotalCost >
        freeShippingAt?.apply_free_shipping_if_total_cart_cost_equals;
  }

  return (
    <div>
      <h2 className='mt-4 text-xl font-semibold'>
        {t('shippingTitle')}
      </h2>
      <div className='mt-4 flex flex-wrap items-center justify-between rounded border border-solid border-blue-sky-dark bg-blue-sky-ultralight px-4 py-3'>
        {selectedGovernorate?.attributes?.delivery_cost ?
          <>
            <p
              className={`${applyFreeShipping ? 'line-through' : ''}`}
            >
              {t('onlyCost', {
                shippingCost:
                  selectedGovernorate?.attributes?.delivery_cost
              })}
            </p>
            <p
              className={`${applyFreeShipping ? 'line-through' : ''} font-bold`}
            >
              {formatCurrencyNumbers(
                selectedGovernorate?.attributes?.delivery_cost,
                t('currency'),
                locale
              )}
            </p>
          </>
        : <p>{t('selectGovernorateForShippingCosts')}</p>}
        {selectedGovernorate?.attributes?.delivery_cost && (
          <p className='mt-1 basis-full font-semibold'>
            {applyFreeShipping && t('freeShippingMessage')}
          </p>
        )}
      </div>
    </div>
  );
}

export default ShippingCost;
