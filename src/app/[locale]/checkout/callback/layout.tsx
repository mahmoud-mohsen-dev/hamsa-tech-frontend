import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import React from 'react';

type PropsType = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale }
}: Omit<PropsType, 'children'>) {
  const t = await getTranslations({
    locale,
    namespace: 'CallbackCheckoutPage.metaData'
  });

  return {
    title: t('title'),
    description: t('description')
  };
}

function layout({ children, params: { locale } }: PropsType) {
  // unstable_setRequestLocale(locale);
  return <div>{children}</div>;
}

export default layout;
