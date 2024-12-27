import { FaWhatsapp } from 'react-icons/fa';
import { TbDeviceLandlinePhone } from 'react-icons/tb';
import { FiMail } from 'react-icons/fi';
import SupportForm from '@/components/support/SupportForm';
import {
  getTranslations,
  unstable_setRequestLocale
} from 'next-intl/server';
import { fetchGraphql } from '@/services/graphqlCrud';
import { SupportPageContactInfoResponseType } from '@/types/supportResponseTypes';

type PropsType = {
  params: { locale: string };
};

const supportPageContactInfoQuery = () => {
  return `{
    supportPage {
        data {
            attributes {
                telephone
                whatsapp
                email
            }
        }
    }
  }`;
};

async function SupportPage({ params: { locale } }: PropsType) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations('SupportPage.content');
  const { data, error } = (await fetchGraphql(
    supportPageContactInfoQuery()
  )) as SupportPageContactInfoResponseType;

  const contactInfo = data?.supportPage?.data?.attributes ?? null;

  if (error || contactInfo === null) {
    throw new Error('Error fetching support page contact info data');
  }

  return (
    <section>
      <div className='mx-auto max-w-[600px] rounded-lg border border-gray-200 p-8 font-inter shadow-lg'>
        <h1 className='text-2xl font-semibold text-black'>
          {t('title')}
        </h1>
        <p className='mt-1 text-base'>{t('subtitle')}</p>
        <SupportForm />
      </div>
      <div className='mt-12 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr));] gap-3 font-inter sm:px-20'>
        <div className='flex items-center gap-5 rounded-md border border-gray-light px-8 py-5'>
          <TbDeviceLandlinePhone size={48} />
          <div>
            <h2 className='text-xl font-medium' dir='ltr'>
              {contactInfo?.telephone ?? ''}
            </h2>
            <p className='text-base'>{t('contactInfo.telephone')}</p>
          </div>
        </div>
        <div className='flex items-center gap-5 rounded-md border border-gray-light px-8 py-5'>
          <FaWhatsapp size={48} />
          <div>
            <h2 className='text-xl font-medium' dir='ltr'>
              {contactInfo?.whatsapp ?? ''}
            </h2>
            <p className='text-base'>{t('contactInfo.whatsapp')}</p>
          </div>
        </div>
        <div className='flex items-center gap-5 rounded-md border border-gray-light px-8 py-5'>
          <FiMail size={48} />
          <div>
            <h2 className='text-xl font-medium'>
              {contactInfo?.email ?? ''}
            </h2>
            <p className='text-base'>{t('contactInfo.email')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SupportPage;
