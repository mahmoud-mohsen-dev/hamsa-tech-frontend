import { FreeShippingAttributesType } from '@/types/freeShippingResponseType';
import { Progress } from 'antd';
import { useTranslations } from 'next-intl';
import { BsBoxSeam } from 'react-icons/bs';

function AppProgress({
  totalCartCosts = 0,
  freeShippingAt
}: {
  totalCartCosts?: number;
  freeShippingAt: FreeShippingAttributesType | undefined;
}) {
  const t = useTranslations('CartDrawer.spendMessage');
  // const freeShippingAt = 1000;
  let applyFreeShipping = false;
  let percent = 0;
  let difference = 0;
  // prettier-ignore
  if (
    freeShippingAt?.apply_free_shipping_if_total_cart_cost_equals &&
    freeShippingAt.enable
  ) {
    applyFreeShipping = true;
    percent = (Number(totalCartCosts || 0) * 100) / freeShippingAt?.apply_free_shipping_if_total_cart_cost_equals;
    difference =
      freeShippingAt?.apply_free_shipping_if_total_cart_cost_equals -
      totalCartCosts;
  }

  return applyFreeShipping ?
      <div className='progress-wrapper'>
        <Progress
          strokeLinecap='butt'
          percent={percent >= 100 ? 100 : percent}
          showInfo={false}
          strokeColor='rgb(153, 213, 207)'
          trailColor='white'
          style={{ lineHeight: 1, height: 40 }}
        />
        <div className='progress-label w-full text-sm font-medium'>
          <BsBoxSeam size={20} className='mx-2.5' />
          <div>
            {difference >= 0 && (
              <>
                <span>{t('start')} </span>
                <b className='font-bold uppercase'>
                  {difference} {t('currency')}
                </b>
                <span> {t('end')} </span>
              </>
            )}
            <b className='uppercase'>{t('freeShipping')}</b>
          </div>
        </div>
      </div>
    : null;
}

export default AppProgress;
