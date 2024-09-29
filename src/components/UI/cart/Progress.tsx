import { Progress } from 'antd';
import { useTranslations } from 'next-intl';
import { BsBoxSeam } from 'react-icons/bs';

function AppProgress({
  totalCartCosts = 0
}: {
  totalCartCosts?: number;
}) {
  const t = useTranslations('CartDrawer.spendMessage');
  const freeShippingAt = 1000;
  // prettier-ignore
  const percent = ((Number(totalCartCosts || 0) * 100) / freeShippingAt);
  const difference = freeShippingAt - totalCartCosts;

  return (
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
  );
}

export default AppProgress;
