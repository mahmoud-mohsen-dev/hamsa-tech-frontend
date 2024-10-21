import { fetchGraphqlServerAuthenticated } from '@/services/graphqlCrud';
import { OrdersPaginationResponseType } from '@/types/orderResponseTypes';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

export const revalidate = 3600; // invalidate every 1 hour

type PropsType = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale }
}: Omit<PropsType, 'children'>) {
  const t = await getTranslations({
    locale,
    namespace: 'BlogPage.metaData'
  });

  return {
    title: t('title'),
    description: t('description')
  };
}

function InvoiceLayout({ children, params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  return <div>{children}</div>;
}

export default InvoiceLayout;
