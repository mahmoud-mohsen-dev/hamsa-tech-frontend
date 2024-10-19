import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';

type PropsType = {
  params: { locale: string };
};

async function OffersPage({ params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('OffersPage');

  return (
    <section>
      <div className='container grid min-h-[calc(100vh-160px)] place-content-center'>
        <h3 className='font-openSans text-xl font-semibold text-black-light'>
          {t('noOffersMessage')}
        </h3>
      </div>
    </section>
  );
}

export default OffersPage;
