import { useMyContext } from '@/context/Store';
import { convertToArabicNumeralsWithFormatting } from '@/utils/numbersFormating';
import { useLocale, useTranslations } from 'next-intl';

function ShippingCost() {
  const { shippingCost } = useMyContext();
  const locale = useLocale();
  const t = useTranslations('CheckoutPage.content');

  return (
    <div>
      <h2 className='mt-4 text-xl font-semibold'>
        {t('shippingTitle')}
      </h2>
      <div className='border-blue-sky-dark mt-4 flex items-center justify-between rounded border border-solid bg-blue-sky-ultralight px-4 py-3'>
        <p>{t('onlyCost', { shippingCost: shippingCost })}</p>
        <p className='font-bold'>
          {convertToArabicNumeralsWithFormatting(
            shippingCost,
            t('currency'),
            locale
          )}
        </p>
      </div>
    </div>
  );
}

export default ShippingCost;
