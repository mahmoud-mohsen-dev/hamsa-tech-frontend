import SubNavLink from '@/components/account/SubNavLink';
import SignOutButton from '@/components/UI/SignOutButton';
import { Divider } from 'antd';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import { GoGear } from 'react-icons/go';
import { GrMapLocation } from 'react-icons/gr';
import { RiShoppingBag3Fill } from 'react-icons/ri';

// export const revalidate = 120; // invalidate every 60 seconds

type PropsType = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale }
}: Omit<PropsType, 'children'>) {
  const t = await getTranslations({
    locale,
    namespace: 'AccountLayoutPage.metaData'
  });

  return {
    title: t('title'),
    description: t('description')
  };
}

async function InvoiceLayout({
  children,
  params: { locale }
}: PropsType) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations('AccountLayoutPage');

  return (
    <div className='container min-h-[calc(100vh-64px)] py-10'>
      <div
        className={`grid min-h-full justify-center lg:grid-cols-[1fr_3fr] lg:gap-14`}
      >
        <ul className='mx-auto mb-10 flex h-fit w-full flex-col justify-center border-r border-r-[#0505050f] lg:mb-0'>
          <li className='border-b border-b-[#0505050f] px-4 py-4 text-xl font-semibold text-black-light'>
            {t('siderbarAccountTitle')}
          </li>
          <li>
            <SubNavLink href={'/account/orders'} page='orders'>
              <RiShoppingBag3Fill />
              <span className='capitalize'>
                {t('siderbarOrdersTitle')}
              </span>
            </SubNavLink>
          </li>
          <li>
            <SubNavLink href={'/account/addresses'} page='addresses'>
              <GrMapLocation />
              <span className='capitalize'>
                {t('siderbarAddressTitle')}
              </span>
            </SubNavLink>
          </li>
          <li>
            <SubNavLink href={'/account/settings'} page='settings'>
              <GoGear />
              <span className='capitalize'>
                {t('siderbarSettingsTitle')}
              </span>
            </SubNavLink>
          </li>
          <Divider style={{ marginBlock: '0px' }} />
          <li>
            <SignOutButton />
          </li>
        </ul>
        <div className='min-h-[calc(100vh-144px)]'>{children}</div>
      </div>
    </div>
  );
}

export default InvoiceLayout;
